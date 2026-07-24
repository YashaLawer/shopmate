import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { planIdFromPriceId } from "@/lib/plans";
import { currentPeriod } from "@/lib/limits";

export const runtime = "nodejs";

// Checkout success landing. Retrieves the session, verifies payment, and updates
// the user's plan. This makes upgrades work even before the webhook is wired up
// (the webhook remains the production source of truth).
export async function GET(req: NextRequest) {
  const appUrl = req.nextUrl.origin;
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

    // One-time message top-up
    if (userId && paid && session.metadata?.type === "topup") {
      const admin = createAdminClient();
      // Idempotency: claim this checkout session before crediting so pressing
      // Back / reloading the confirm URL can't add the messages twice. Only a
      // genuine duplicate (unique-violation 23505) skips crediting; if the
      // ledger table isn't present yet we fall back to crediting once.
      const { error: claimErr } = await admin
        .from("processed_payments")
        .insert({ session_id: sessionId });
      const alreadyProcessed = claimErr?.code === "23505";
      if (!alreadyProcessed) {
        const add = parseInt(session.metadata.messages || "0", 10) || 0;
        const period = currentPeriod();
        const { data: prof } = await admin
          .from("profiles")
          .select("topup_messages, topup_period")
          .eq("id", userId)
          .single();
        const existing =
          prof?.topup_period === period ? (prof?.topup_messages ?? 0) : 0;
        await admin
          .from("profiles")
          .update({ topup_messages: existing + add, topup_period: period })
          .eq("id", userId);
      }
      return NextResponse.redirect(`${appUrl}/dashboard/billing?topup=1`);
    }

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
