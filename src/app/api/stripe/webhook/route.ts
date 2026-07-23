import { NextRequest } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { planIdFromPriceId } from "@/lib/plans";

export const runtime = "nodejs";

// Production source of truth for subscription state. Point a Stripe webhook here
// (or `stripe listen --forward-to localhost:3000/api/stripe/webhook`) and put the
// signing secret in STRIPE_WEBHOOK_SECRET.
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    if (!secret || !sig || secret.includes("...")) throw new Error("no secret");
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const admin = createAdminClient();

  const idOf = (v: string | { id: string } | null | undefined): string | null =>
    typeof v === "string" ? v : (v?.id ?? null);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId =
          session.client_reference_id || session.metadata?.userId || null;
        const subId = idOf(session.subscription as never);
        let planId = session.metadata?.planId ?? null;

        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          planId = planIdFromPriceId(sub.items.data[0]?.price.id) ?? planId;
        }
        if (userId && planId) {
          await admin
            .from("profiles")
            .update({
              plan: planId,
              stripe_customer_id: idOf(session.customer as never),
              stripe_subscription_id: subId,
              subscription_status: "active",
            })
            .eq("id", userId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = idOf(sub.customer as never);
        const planId = planIdFromPriceId(sub.items.data[0]?.price.id);
        const patch: Record<string, unknown> = { subscription_status: sub.status };
        if (planId && sub.status === "active") patch.plan = planId;
        if (customerId) {
          await admin.from("profiles").update(patch).eq("stripe_customer_id", customerId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = idOf(sub.customer as never);
        if (customerId) {
          await admin
            .from("profiles")
            .update({
              plan: "free",
              subscription_status: "canceled",
              stripe_subscription_id: null,
            })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }
    }
  } catch {
    return new Response("Handler error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
