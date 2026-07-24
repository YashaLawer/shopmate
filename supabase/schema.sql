-- Shopmate database schema
-- Run this in the Supabase SQL editor (Dashboard -> SQL -> New query -> paste -> Run).

-- === Extensions ===
create extension if not exists vector;

-- === PROFILES (1:1 with auth.users) ===
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- === CHATBOTS ===
create table if not exists public.chatbots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My store assistant',
  public_key text not null unique default encode(gen_random_bytes(16), 'hex'),
  system_prompt text,
  welcome_message text not null default 'Hi! How can I help you with your order today?',
  widget_color text not null default '#4f46e5',
  show_branding boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists chatbots_user_idx on public.chatbots(user_id);
create index if not exists chatbots_public_key_idx on public.chatbots(public_key);

-- === DOCUMENTS (knowledge sources) ===
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  chatbot_id uuid not null references public.chatbots(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  source_type text not null default 'text', -- text | file | url
  source_url text,
  char_count int not null default 0,
  status text not null default 'ready',      -- processing | ready | error
  created_at timestamptz not null default now()
);
create index if not exists documents_chatbot_idx on public.documents(chatbot_id);

-- === CHUNKS (vector embeddings) ===
create table if not exists public.chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  chatbot_id uuid not null references public.chatbots(id) on delete cascade,
  content text not null,
  embedding vector(1536),
  created_at timestamptz not null default now()
);
create index if not exists chunks_chatbot_idx on public.chunks(chatbot_id);
create index if not exists chunks_embedding_idx
  on public.chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- === CONVERSATIONS + MESSAGES (chat history + usage/analytics) ===
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  chatbot_id uuid not null references public.chatbots(id) on delete cascade,
  source text not null default 'app',        -- app | widget
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  chatbot_id uuid not null references public.chatbots(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade, -- chatbot owner, for usage counting
  role text not null,                         -- user | assistant
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_chatbot_created_idx on public.messages(chatbot_id, created_at);
create index if not exists messages_owner_created_idx on public.messages(owner_id, created_at);

-- === Vector similarity search ===
create or replace function public.match_chunks(
  query_embedding vector(1536),
  match_chatbot_id uuid,
  match_count int default 5
)
returns table (id uuid, content text, similarity float)
language sql stable
as $$
  select c.id, c.content, 1 - (c.embedding <=> query_embedding) as similarity
  from public.chunks c
  where c.chatbot_id = match_chatbot_id
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- === Row Level Security ===
alter table public.profiles      enable row level security;
alter table public.chatbots      enable row level security;
alter table public.documents     enable row level security;
alter table public.chunks        enable row level security;
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;

-- profiles: user sees/updates only their own
drop policy if exists "own profile select" on public.profiles;
create policy "own profile select" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update using (auth.uid() = id);

-- chatbots: owner full access
drop policy if exists "own chatbots" on public.chatbots;
create policy "own chatbots" on public.chatbots
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- documents: owner full access
drop policy if exists "own documents" on public.documents;
create policy "own documents" on public.documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- chunks: owner access via parent chatbot
drop policy if exists "own chunks" on public.chunks;
create policy "own chunks" on public.chunks
  for all using (
    exists (select 1 from public.chatbots c where c.id = chunks.chatbot_id and c.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.chatbots c where c.id = chunks.chatbot_id and c.user_id = auth.uid())
  );

-- conversations: owner read via parent chatbot
drop policy if exists "own conversations" on public.conversations;
create policy "own conversations" on public.conversations
  for select using (
    exists (select 1 from public.chatbots c where c.id = conversations.chatbot_id and c.user_id = auth.uid())
  );

-- messages: owner read
drop policy if exists "own messages" on public.messages;
create policy "own messages" on public.messages
  for select using (owner_id = auth.uid());

-- === Message top-ups (add-on credits, one-time purchase) ===
-- Run these two lines if you already created the tables above earlier.
alter table public.profiles add column if not exists topup_messages int not null default 0;
alter table public.profiles add column if not exists topup_period text; -- 'YYYY-MM' the credits apply to

-- === Security: domain allow-list + per-IP rate limiting ===
alter table public.chatbots add column if not exists allowed_domains text[] not null default '{}';
alter table public.messages  add column if not exists ip text; -- hashed requester IP (for rate limiting)
create index if not exists messages_chatbot_ip_created_idx on public.messages(chatbot_id, ip, created_at);

-- === Email notifications (Resend) ===
alter table public.profiles add column if not exists warned_period text; -- 'YYYY-MM' we sent the 80%-usage email for
alter table public.profiles add column if not exists locale text;        -- owner UI language, for localized emails

-- === Human handoff (widget "Talk to a human" button) ===
alter table public.chatbots add column if not exists handoff_type text;  -- email | whatsapp | telegram | phone | link
alter table public.chatbots add column if not exists handoff_value text; -- the address / number / url

-- NOTE: all public/widget writes (chunks during ingestion, conversations & messages
-- during chat) go through the server using the service-role key, which bypasses RLS.
