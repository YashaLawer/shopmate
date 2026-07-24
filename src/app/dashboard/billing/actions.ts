"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/baseUrl";
import { priceIdForPlan } from "@/lib/plans";
import { getTopup, TOPUPS } from "@/lib/limits";
import type { PlanId, BillingCycle } from "@/lib/plans";

// Statuses that mean "there is a live subscription we can modify in place".
const LIVE_SUB_STATUSES = ["active", "trialing", "past_due", "unpaid"];

// redirect() throws a special error we must let propagate; only real failures
// (e.g. a Stripe/network hiccup) should be turned into a friendly error page.
function isRedirect(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "digest" in e &&
    typeof (e as { digest?: unknown }).digest === "string" &&
    (e as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

const STRIPE_ERR =
  "/dashboard/billing?error=" +
  encodeURIComponent("Couldn't reach the payment service. Please try again.");

// Single entry point for every paid-plan change:
//  - no live subscription (free / cancelled) -> Stripe Checkout (new subscription)
//  - live subscription (Starter/Pro)          -> update it in place, with proration,
//    switching plan and/or billing cycle and un-cancelling if it was set to cancel.
// This replaces the old "send existing customers to the Customer Portal to switch"
// path, which only let them cancel and ignored the Month/Year choice.
export async function changePlan(formData: FormData) {
  const planId = String(formData.get("plan")) as PlanId;
  const cycle: BillingCycle =
    String(formData.get("cycle")) === "year" ? "year" : "month";
  const priceId = priceIdForPlan(planId, cycle);
  if (!priceId) {
    redirect(
      "/dashboard/billing?error=" +
        encodeURIComponent("This plan isn't configured yet."),
    );
  }

  const { userId, email, profile } = await requireUser();

  try {
    const stripe = getStripe();
    const base = await getBaseUrl();

    // Ensure the user has a Stripe customer.
    let customerId = profile.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email ?? undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      const supabase = await createClient();
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", userId);
    }

    // Is there a live subscription we can switch in place?
    let liveSub: import("stripe").Stripe.Subscription | null = null;
    if (profile.stripe_subscription_id) {
      try {
        const sub = await stripe.subscriptions.retrieve(
          profile.stripe_subscription_id,
        );
        if (LIVE_SUB_STATUSES.includes(sub.status)) liveSub = sub;
      } catch {
        // Subscription no longer exists in Stripe — fall through to Checkout.
      }
    }

    if (liveSub) {
      const itemId = liveSub.items.data[0]?.id;
      if (itemId) {
        await stripe.subscriptions.update(liveSub.id, {
          items: [{ id: itemId, price: priceId! }],
          proration_behavior: "create_prorations",
          cancel_at_period_end: false,
          metadata: { userId, planId, cycle },
        });
        // Reflect the change immediately (webhook is the eventual source of truth).
        const admin = createAdminClient();
        await admin
          .from("profiles")
          .update({ plan: planId, subscription_status: "active" })
          .eq("id", userId);
        redirect("/dashboard/billing?success=1");
      }
    }

    // No live subscription → start a fresh Checkout.
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId!, quantity: 1 }],
      client_reference_id: userId,
      metadata: { userId, planId, cycle },
      allow_promotion_codes: true,
      success_url: `${base}/api/stripe/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/dashboard/billing?canceled=1`,
    });

    if (!session.url) {
      redirect("/dashboard/billing?error=" + encodeURIComponent("Could not start checkout."));
    }
    redirect(session.url);
  } catch (e) {
    if (isRedirect(e)) throw e;
    redirect(STRIPE_ERR);
  }
}

// Back-compat alias (the free-plan upgrade path uses the same logic).
export const startCheckout = changePlan;

// One-time purchase of a message top-up pack for the current month.
export async function buyTopup(formData: FormData) {
  const pack = getTopup(String(formData.get("pack"))) ?? TOPUPS[0];
  const { userId, email, profile } = await requireUser();

  try {
    const stripe = getStripe();
    const base = await getBaseUrl();

    let customerId = profile.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email ?? undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      const supabase = await createClient();
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", userId);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${pack.messages.toLocaleString("en-US")} extra messages`,
            },
            unit_amount: pack.priceCents,
          },
          quantity: 1,
        },
      ],
      client_reference_id: userId,
      metadata: { userId, type: "topup", messages: String(pack.messages) },
      success_url: `${base}/api/stripe/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/dashboard/billing?canceled=1`,
    });

    if (!session.url) {
      redirect("/dashboard/billing?error=" + encodeURIComponent("Could not start checkout."));
    }
    redirect(session.url);
  } catch (e) {
    if (isRedirect(e)) throw e;
    redirect(STRIPE_ERR);
  }
}

export async function openPortal() {
  const { profile } = await requireUser();
  if (!profile.stripe_customer_id) {
    redirect("/dashboard/billing?error=" + encodeURIComponent("No subscription yet."));
  }

  const stripe = getStripe();
  const base = await getBaseUrl();
  let url: string | null = null;
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id!,
      return_url: `${base}/dashboard/billing`,
    });
    url = session.url;
  } catch {
    redirect(
      "/dashboard/billing?error=" +
        encodeURIComponent(
          "Billing portal isn't set up in Stripe yet (Settings → Billing → Customer portal).",
        ),
    );
  }
  redirect(url!);
}
