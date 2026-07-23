# Shopmate — unit economics & pricing

_Napkin math on what a message actually costs us, and whether the pricing earns money._

## What one customer message costs us

Each customer message triggers: **1 embedding** (of the question) + **1 chat completion** (with retrieved store context). Model: `gpt-4o-mini` via OpenRouter — $0.15 / 1M input tokens, $0.60 / 1M output tokens. Embeddings `text-embedding-3-small` — $0.02 / 1M tokens.

| Piece | Tokens | Cost |
|---|---|---|
| Embed the question | ~25 | ~$0.0000005 (negligible) |
| Chat input (system + 6 knowledge chunks + history) | ~2,100 | ~$0.00032 |
| Chat output (the answer) | ~120 | ~$0.00007 |
| **Total per message** | | **≈ $0.0004** (four hundredths of a cent) |

So **1,000 messages ≈ $0.40**, 10,000 messages ≈ $4. Text LLM inference is cheap — this is the key insight.

## Per-plan economics (monthly)

Stripe fee ≈ 2.9% + $0.30 per charge.

| Plan | Price | Msgs incl. | Our API cost | Stripe fee | **Net / mo** | Margin |
|---|---|---|---|---|---|---|
| Free | $0 | 50 | ~$0.02 | — | −$0.02 | loss leader |
| Starter | $29 | 2,000 | ~$0.80 | ~$1.14 | **≈ $27** | ~93% |
| Pro | $99 | 10,000 | ~$4.00 | ~$3.17 | **≈ $92** | ~93% |

## Top-up packs (one-time)

| Pack | Price | Our cost | Stripe fee | Net | $/msg |
|---|---|---|---|---|---|
| 1,000 | $9 | ~$0.40 | ~$0.56 | ~$8.0 | $0.0090 |
| 5,000 | $39 | ~$2.00 | ~$1.43 | ~$35.6 | $0.0078 |
| 15,000 | $99 | ~$6.00 | ~$3.17 | ~$89.8 | $0.0066 |

Bulk discount baked in → nudges bigger packs. Don't sell anything under ~$5 (Stripe's $0.30 flat fee kills tiny charges).

## Fixed monthly costs

| Item | Cost |
|---|---|
| Supabase | $0 (free tier) → $25 once past free limits |
| Vercel | $0 (hobby) → $20 for commercial (Pro) |
| OpenRouter | pay-as-you-go (the per-message cost above) |
| **Break-even** | **~2 Starter customers cover all infra** |

## Takeaways

1. **Margins are ~93%.** Text LLM cost is tiny; API spend is NOT the risk.
2. **The real risk is abuse** (someone hammering a public widget) — mitigated with per-IP rate limit + monthly quota + domain lock.
3. **Price on value, not cost.** A store deflecting even 100 support tickets/mo saves hours of human time. Competitors: Chatbase $19–$399, Tidio Lyro $39/mo for **50** conversations, Intercom Fin **$0.99 per resolution**. Our $29 for 2,000 messages is competitive-to-generous.
4. **Markup is already healthy** — no need to raise per-message pricing to be profitable. If anything, room to add value (annual plans −2 months, higher Pro tier, usage analytics) rather than cut limits.

## Recommended next pricing moves (roadmap)
- Annual billing (pay 10, get 12) → boosts LTV & cash upfront.
- A higher "Business" tier ($249?) for agencies / many stores.
- Keep Free generous for adoption; monetize via upgrade + top-ups.
