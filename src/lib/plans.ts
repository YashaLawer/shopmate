// Central definition of pricing plans, limits and gated features.
// Limits are enforced server-side; the landing/pricing UI renders from this too.

export type PlanId = "free" | "starter" | "pro";
export type BillingCycle = "month" | "year";

export interface PlanLimits {
  chatbots: number;
  messagesPerMonth: number;
  pages: number; // knowledge sources (docs/pages) per chatbot
}

export interface PlanFeatures {
  removeBranding: boolean;
  customColor: boolean;
  analytics: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // USD / month
  priceYear?: number; // USD / year (annual billing)
  tagline: string;
  limits: PlanLimits;
  features: PlanFeatures;
  /** Env var name holding the monthly Stripe price id (undefined for free) */
  priceEnv?: "STRIPE_PRICE_STARTER" | "STRIPE_PRICE_PRO";
  /** Env var name holding the yearly Stripe price id */
  priceEnvYear?: "STRIPE_PRICE_STARTER_YEARLY" | "STRIPE_PRICE_PRO_YEARLY";
  highlights: string[];
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    tagline: "Try it on one store",
    limits: { chatbots: 1, messagesPerMonth: 50, pages: 20 },
    features: { removeBranding: false, customColor: false, analytics: false },
    highlights: [
      "1 chatbot",
      "50 messages / month",
      "20 knowledge pages",
      '"Powered by Shopmate" badge',
    ],
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: 29,
    priceYear: 290,
    tagline: "For a growing store",
    priceEnv: "STRIPE_PRICE_STARTER",
    priceEnvYear: "STRIPE_PRICE_STARTER_YEARLY",
    limits: { chatbots: 1, messagesPerMonth: 2000, pages: 200 },
    features: { removeBranding: true, customColor: true, analytics: false },
    highlights: [
      "1 chatbot",
      "2,000 messages / month",
      "200 knowledge pages",
      "Remove Shopmate badge",
      "Custom widget color",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 99,
    priceYear: 990,
    tagline: "For multiple stores & scale",
    priceEnv: "STRIPE_PRICE_PRO",
    priceEnvYear: "STRIPE_PRICE_PRO_YEARLY",
    limits: { chatbots: 3, messagesPerMonth: 10000, pages: 1000 },
    features: { removeBranding: true, customColor: true, analytics: true },
    highlights: [
      "3 chatbots",
      "10,000 messages / month",
      "1,000 knowledge pages",
      "Conversation analytics",
      "Everything in Starter",
    ],
  },
};

export const PLAN_ORDER: PlanId[] = ["free", "starter", "pro"];

export function getPlan(id: string | null | undefined): Plan {
  if (id && id in PLANS) return PLANS[id as PlanId];
  return PLANS.free;
}

// Resolve the Stripe price id for a plan + billing cycle from env (server-only).
export function priceIdForPlan(
  id: PlanId,
  cycle: BillingCycle = "month",
): string | undefined {
  const p = PLANS[id];
  if (cycle === "year") return p.priceEnvYear ? process.env[p.priceEnvYear] : undefined;
  return p.priceEnv ? process.env[p.priceEnv] : undefined;
}

// Reverse lookup: which plan does a Stripe price id belong to (server-only).
// Matches both the monthly and yearly price of each plan.
export function planIdFromPriceId(priceId: string | null | undefined): PlanId | null {
  if (!priceId) return null;
  if (
    priceId === process.env.STRIPE_PRICE_STARTER ||
    priceId === process.env.STRIPE_PRICE_STARTER_YEARLY
  )
    return "starter";
  if (
    priceId === process.env.STRIPE_PRICE_PRO ||
    priceId === process.env.STRIPE_PRICE_PRO_YEARLY
  )
    return "pro";
  return null;
}
