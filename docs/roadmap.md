# Shopmate — backlog / roadmap

Working list of tasks from Denis. We go through them one at a time.

## Questions answered (context, not tasks)

### How the Downgrade / cancel works today
- There is **no one-click cancel** inside our app. The only way to downgrade is:
  `Billing → Manage subscription → Stripe Customer Portal → Cancel plan` (Stripe
  shows its own confirmation there).
- On the landing pricing, the Free card's "Downgrade" is just a **link to Billing** —
  it cancels nothing.
- **Canceling does NOT delete anything.** Bots, knowledge, settings all stay. The
  account just reverts to Free limits at the end of the paid period. Nothing is zeroed.
- Planned safety: a confirmation step + a visible "your data stays, only limits change"
  note so it can never feel accidental.

### How the widget "key" works
- Every chatbot has a `public_key` — a random hex string **auto-generated on creation**
  (`gen_random_bytes` in the DB). We never hand-issue keys.
- It's a **public identifier** (like a Google Analytics ID / Intercom app_id), not a
  secret or a license. Safe to sit in the page source.
- It only permits **chatting** with that one bot. Editing the bot, reading the
  knowledge base, or touching the account all require the owner's login (Supabase auth
  + RLS). So a stolen key ≠ account access — worst case someone chats with the bot.
- Upgrade → more bots allowed → each new bot gets its own key.
- Roadmap: a "Regenerate key" button (rotate if a key gets abused).

### Anti-spam / abuse (why it matters)
The widget endpoint is public, so someone could hammer it and burn the owner's quota +
our API cost. Defense layers:
1. Monthly message quota per owner — **already live** (cost backstop).
2. Message length cap — **already live** (4000 chars).
3. **Domain allow-list** (planned): owner lists their domain(s); endpoint checks the
   request Origin/Referer. Stops others from using your key on their site. Strongest,
   cheap.
4. **Per-IP rate limit** (planned): e.g. N messages/min per IP+key. Stops hammering.
5. **Key rotation** (planned): regenerate a compromised key.

---

## Task list (in suggested order)

- [ ] **1. Downgrade safety** — confirmation + "your data stays" wording. _Small._
- [ ] **2. Anti-spam** — domain allow-list (per bot) + per-IP rate limit. _Medium; protects money._
- [ ] **3. Dark theme** — theme toggle across app (respect system pref + manual switch). _Medium._
- [ ] **4. Language selector** — needs scope decision (see note). _Medium–large._
- [ ] **5. Regenerate key button** — ties into anti-spam. _Small._

### Note on the language task (decide scope before building)
"Language" can mean several things:
- **Bot answers** in the customer's language — **already works** (the LLM replies in
  whatever language the customer writes in).
- **Widget UI strings** ("Type your message…", "We usually reply instantly") — a
  per-bot language setting. _Most valuable for international stores._
- **Dashboard UI** (the owner's interface) — full app i18n. Bigger effort.
- **Landing page** — marketing i18n.

Recommended MVP: a **per-bot widget language** (RU/EN/FR/ES/DE + auto), which localizes
the widget strings and sets the bot's default reply language. Confirm before building.
