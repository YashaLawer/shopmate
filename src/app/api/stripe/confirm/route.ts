import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { planIdFromPriceId } from "@/lib/plans";

export const runtime = "nodejs";

// Checkout success landing. Retrieves the session, verifies payment, and updates
// the user's plan. This makes upgrades work even before the webhook is wired up
// (the webhook remains the production source of truth).
export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.redirect(`${appUrl}/dashboard/billing`);
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "subscription"],
    });

    const userId =
      session.client_reference_id || session.metadata?.userId || null;
    const priceId = session.line_items?.data?.[0]?.price?.id ?? null;
    const planId = planIdFromPriceId(priceId);
    const paid =
      session.payment_status === "paid" || session.status === "complete";

    if (userId && planId && paid) {
      const subId =
        typeof session.subscription === "string"
          ? session.subscription
          : (session.subscription?.id ?? null);
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : (session.customer?.id ?? null);

      const admin = createAdminClient();
      await admin
        .from("profiles")
        .update({
          plan: planId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subId,
          subscription_status: "active",
        })
        .eq("id", userId);
    }
  } catch {
    // Ignore — the webhook will reconcile if this fails.
  }

  return NextResponse.redirect(`${appUrl}/dashboard/billing?success=1`);
}
