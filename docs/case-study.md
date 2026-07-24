# Shopmate — Case Study

**Turn your store's help docs into an AI support agent — in the dashboard as a
ChatGPT-style chat, and as a one-line embeddable widget on any website.**

Live app: https://shopmate-topaz-beta.vercel.app
Try the assistant on a real external store:
https://yashalawer.github.io/acme-demo-store/?key=be16588730518063c3633c3de39f240b

---

## The brief, delivered

The assignment: *"An app that lets users upload documents/materials about their
company and turns them into a chatbot — available in-app as a ChatGPT-like chat
and as an embeddable widget customers can place on their own sites."*

Every part is built, working, and verified live:

| Requirement | Status |
| --- | --- |
| Upload docs/materials → chatbot | ✅ Paste text, import a URL, or upload a file (PDF, Word, image, TXT/MD) |
| In-app ChatGPT-style chat | ✅ Streaming answers, grounded strictly in the store's content |
| Embeddable widget on customer sites | ✅ One `<script>` line; proven cross-origin on a separate domain |
| Accounts (sign up / log in) | ✅ Email + password, email confirmation, password reset |
| Pricing / subscription | ✅ Stripe (test): Free / Starter / Pro, monthly + yearly, top-ups |
| Landing page | ✅ Full marketing page, 5 languages |

---

## How it works (the core)

1. **Ingest.** The owner adds knowledge as pasted text, a URL, or a file. Files
   are parsed server-side: PDFs (unpdf), Word docs (mammoth), and even **images**
   (transcribed by a vision model). Tables are rewritten as one self-contained
   sentence per row so the bot can retrieve a precise cell ("the height of panel
   61 is 2070 mm"), not just a fuzzy paragraph.
2. **Index.** Text is chunked and embedded (`text-embedding-3-small`, 1536-dim)
   into Postgres + pgvector, scoped per chatbot.
3. **Answer.** A customer question is embedded, the most relevant chunks are
   retrieved by cosine similarity, and the model answers **only** from that
   context — streaming, word by word. If the answer isn't in the knowledge, the
   bot says so and points to support instead of inventing policies or prices.

The owner can **click any knowledge source to see exactly what the assistant
reads** — full transparency into the indexed content.

---

## Beyond the brief

Things the assignment didn't ask for, added because a real product needs them:

- **Fully multilingual** — the whole site *and* dashboard follow the owner's
  chosen language (EN / RU / FR / ES / DE), and the widget auto-adapts to each
  visitor's browser language while the bot answers in the customer's language.
- **Analytics (Pro)** — conversations, questions this month, a daily chart, and
  a **"Top questions"** ranking with counts so owners see what customers ask
  most and where their help content has gaps.
- **Human handoff** — an optional "Contact support" button (email / WhatsApp /
  Telegram / phone / link) the owner toggles on; live-agent chat is on the
  roadmap.
- **Transactional email** (Resend) — a welcome email and an "80% of your
  messages used" heads-up, localized.
- **Guardrails everywhere** — confirmation dialogs before deleting a bot or a
  knowledge source and before any plan change; locale-aware defaults; friendly
  error states.

---

## Monetization

A complete, real billing lifecycle on Stripe test mode:

- **Three tiers** — Free (50 msgs), Starter ($29/mo, 2,000 msgs), Pro ($99/mo,
  10,000 msgs + analytics), each gating chatbots / messages / knowledge pages /
  branding.
- **Monthly and annual** billing with a Month/Year toggle (annual ≈ 2 months
  free). Switching plan *or* cycle updates the live subscription in place, with
  proration — no dead ends, no double subscriptions.
- **Message top-ups** — 1k / 5k / 15k one-time packs for months a store spikes.
- **Manage subscription** via the Stripe Customer Portal (payment method,
  invoices, cancel).
- **Unit economics** — ~$0.0004 per message, ~93% gross margin per plan;
  break-even at ~2 Starter customers. (See `docs/pricing-economics.md`.)

---

## Security & anti-abuse

The widget's key is public by design (it ships in the embed snippet), so the
product is built so a leaked key stays low-value and users can't be cheated.

**Data isolation**
- Row-Level Security on every table — a user can only ever read/write their own
  profiles, bots, documents, chunks, conversations, and messages.
- The privileged service-role key lives only in server code; it is never
  imported into any client component. Verified.

**Widget / key abuse**
- **Domain allow-list** — the owner restricts which sites may run the widget;
  it's enforced both on the widget render *and* on the chat API.
- **Per-IP rate limiting** — burst requests are capped before any expensive
  work; raw IPs are stored only as salted SHA-256 hashes.
- **Key rotation** — one click issues a new public key and instantly retires the
  old snippet.
- **Quota gating** — every message counts against the owner's monthly plan; when
  the limit is hit the widget degrades to a polite "try later" instead of
  running up cost.

**Prompt-injection defense**
- The system prompt treats knowledge as *data, not instructions*, and refuses
  role changes or "reveal your prompt" requests embedded in content or messages.
- The public chat endpoint **ignores client-supplied roles and history** — only
  genuine user/assistant turns are kept, length- and count-capped — so a caller
  can't inject a fake "system" message or put words in the assistant's mouth.

**Payment integrity**
- Top-up credits are **idempotent** — a processed-payments ledger means pressing
  Back or reloading the confirmation page can never grant messages twice.
- "Payment successful" is shown only when a payment actually completed.
- Stripe calls are wrapped so a transient outage shows a friendly billing
  message, never a crash page.

**Input safety**
- **SSRF-guarded URL import** — before the server fetches a user-supplied URL it
  resolves the host and rejects localhost, cloud-metadata, and private-network
  addresses, and caps response size and content type.
- File uploads are size-limited; blank/low-text files are rejected with a clear
  message.

**Honesty over hype**
- The bot never fabricates — it answers only from the store's content.
- In-product security copy was deliberately toned down from absolute claims to
  accurate ones after review.

---

## Attention to detail

- Confirmation dialogs so a bot, a knowledge source, or a subscription can't be
  changed or deleted by an accidental click.
- Every user-facing string localized across 5 languages (deliberate exception:
  platform-specific install steps that reference each platform's own English
  admin menus).
- Locale-aware defaults, loading skeletons, and friendly empty/error states.
- Platform-specific install guides (Shopify, WooCommerce, Wix, Squarespace,
  Webflow, Tilda, GTM, custom) plus a one-click "Check installation".

---

## Stack

Next.js 16 (App Router, Server Actions) · Supabase (Auth, Postgres, pgvector,
RLS) · OpenRouter (chat + embeddings) · Stripe (test) · Resend (email) ·
deployed on Vercel with auto-deploy from GitHub.

---

## Honest scope

This is a portfolio MVP. Stripe runs in test mode (as the brief allows); the
built-in Supabase email service is rate-limited (fine for a demo, a custom SMTP
would be the production step); and it hasn't been load-tested with real paying
customers. Within the assignment's bar — focused scope, a descriptive landing,
working features, and attention to detail — it is complete and verified.
