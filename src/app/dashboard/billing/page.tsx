import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getPlan, PLANS, PLAN_ORDER } from "@/lib/plans";
import { SubmitButton } from "@/components/SubmitButton";
import { startCheckout, openPortal } from "./actions";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    canceled?: string;
    error?: string;
  }>;
}) {
  const sp = await searchParams;
  const { profile } = await requireUser();
  const current = getPlan(profile.plan);
  const isFree = current.id === "free";
  const hasCustomer = Boolean(profile.stripe_customer_id);

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> Dashboard
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing & plans</h1>
          <p className="mt-1 text-sm text-slate-500">
            You&apos;re on the <span className="font-semibold">{current.name}</span>{" "}
            plan.
          </p>
        </div>
        {hasCustomer && (
          <form action={openPortal}>
            <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Manage subscription
            </button>
          </form>
        )}
      </div>

      {sp.success && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          🎉 Payment successful — your plan is now active.
        </p>
      )}
      {sp.canceled && (
        <p className="mt-4 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-600">
          Checkout canceled. No charge was made.
        </p>
      )}
      {sp.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {sp.error}
        </p>
      )}

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-3">
        {PLAN_ORDER.map((id) => {
          const plan = PLANS[id];
          const isCurrent = id === current.id;
          const featured = id === "starter";

          return (
            <div
              key={id}
              className={
                "rounded-2xl border bg-white p-6 " +
                (isCurrent
                  ? "border-brand ring-1 ring-brand/20"
                  : "border-slate-200")
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                {isCurrent && (
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                    Current
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="mb-1 text-sm text-slate-400">/month</span>
              </div>

              <div className="mt-5">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-400"
                  >
                    Your current plan
                  </button>
                ) : plan.price === 0 ? (
                  <p className="py-2.5 text-center text-xs text-slate-400">
                    Downgrade via “Manage subscription”
                  </p>
                ) : isFree ? (
                  <form action={startCheckout}>
                    <input type="hidden" name="plan" value={id} />
                    <SubmitButton className="w-full" pendingText="Redirecting…">
                      Upgrade to {plan.name}
                    </SubmitButton>
                  </form>
                ) : (
                  <form action={openPortal}>
                    <button
                      className={
                        "w-full rounded-lg px-4 py-2.5 text-sm font-semibold " +
                        (featured
                          ? "bg-brand text-white hover:bg-indigo-700"
                          : "border border-slate-300 text-slate-700 hover:bg-slate-50")
                      }
                    >
                      Switch to {plan.name}
                    </button>
                  </form>
                )}
              </div>

              <ul className="mt-6 space-y-2.5">
                {plan.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Test mode — use card <code className="rounded bg-slate-100 px-1">4242 4242 4242 4242</code>,
        any future date, any CVC.
      </p>
    </div>
  );
}
