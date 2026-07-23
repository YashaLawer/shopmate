import Stripe from "stripe";

let _stripe: Stripe | null = null;

// Lazy init so `next build` doesn't fail when the key isn't present at build time.
export function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  return _stripe;
}
