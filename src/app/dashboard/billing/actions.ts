"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/baseUrl";
import { priceIdForPlan } from "@/lib/plans";
import { TOPUP } from "@/lib/limits";
import type { PlanId } from "@/lib/plans";

export async function startCheckout(formData: FormData) {
  const planId = String(formData.get("plan")) as PlanId;
  const priceId = priceIdForPlan(planId);
  if (!priceId) {
    redirect("/dashboard/billing?error=" + encodeURIComponent("This plan isn't configured."));
  }

  const { userId, email, profile } = await requireUser();
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

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId!, quantity: 1 }],
    client_reference_id: userId,
    metadata: { userId, planId },
    allow_promotion_codes: true,
    success_url: `${base}/api/stripe/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/dashboard/billing?canceled=1`,
  });

  if (!session.url) {
    redirect("/dashboard/billing?error=" + encodeURIComponent("Could not start checkout."));
  }
  redirect(session.url);
}

// One-time purchase of extra messages for the current month.
export async function buyTopup() {
  const { userId, email, profile } = await requireUser();
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
          product_data: { name: TOPUP.label },
          unit_amount: TOPUP.priceCents,
        },
        quantity: 1,
      },
    ],
    client_reference_id: userId,
    metadata: { userId, type: "topup", messages: String(TOPUP.messages) },
    success_url: `${base}/api/stripe/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/dashboard/billing?canceled=1`,
  });

  if (!session.url) {
    redirect("/dashboard/billing?error=" + encodeURIComponent("Could not start checkout."));
  }
  redirect(session.url);
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
