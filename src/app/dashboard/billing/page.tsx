import Link from "next/link";
import { ArrowLeft, Check, Zap } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getPlan, PLANS, PLAN_ORDER } from "@/lib/plans";
import { countMessagesThisMonth } from "@/lib/usage";
import { activeTopup, TOPUPS } from "@/lib/limits";
import { getLocale } from "@/lib/i18n/getLocale";
import { getAppDict, tpl } from "@/lib/i18n/app";
import { getDict } from "@/lib/i18n/site";
import { SubmitButton } from "@/components/SubmitButton";
import { startCheckout, openPortal, buyTopup } from "./actions";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    canceled?: string;
    error?: string;
    topup?: string;
  }>;
}) {
  const sp = await searchParams;
  const { userId, profile } = await requireUser();
  const current = getPlan(profile.plan);
  const isFree = current.id === "free";
  const hasCustomer = Boolean(profile.stripe_customer_id);

  const locale = await getLocale();
  const b = getAppDict(locale).billing;
  const site = getDict(locale).pricing;

  const used = await countMessagesThisMonth(userId);
  const topup = activeTopup(profile);
  const effectiveLimit = current.limits.messagesPerMonth + topup;
  const pct = Math.min(100, Math.round((used / effectiveLimit) * 100));

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> {getAppDict(locale).common.dashboard}
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{b.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {tpl(b.onPlanTpl, { plan: current.name })}
          </p>
        </div>
        {hasCustomer && (
          <form action={openPortal}>
            <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              {b.manage}
            </button>
          </form>
        )}
      </div>

      {sp.success && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {b.success}
        </p>
      )}
      {sp.canceled && (
        <p className="mt-4 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-600">
          {b.canceled}
        </p>
      )}
      {sp.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {sp.error}
        </p>
      )}
      {sp.topup && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {b.topup}
        </p>
      )}

      {/* Message usage + top-up */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">
          {b.messagesThisMonth}
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">
          {tpl(b.usageTpl, {
            used: used.toLocaleString(),
            total: effectiveLimit.toLocaleString(),
          })}
          {topup > 0 && (
            <span className="text-emerald-600">
              {tpl(b.includesTopupTpl, { n: topup.toLocaleString() })}
            </span>
          )}
        </p>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={
              "h-full rounded-full " +
              (pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-brand")
            }
            style={{ width: `${pct}%` }}
          />
        </div>
        {used >= effectiveLimit && (
          <p className="mt-3 text-sm text-amber-700">{b.hitLimit}</p>
        )}

        {/* Top-up packs */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <h3 className="text-sm font-medium text-slate-700">{b.topupTitle}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {TOPUPS.map((pack) => (
              <form key={pack.id} action={buyTopup}>
                <input type="hidden" name="pack" value={pack.id} />
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand">
                  <Zap size={14} />
                  {tpl(b.buyTpl, {
                    n: pack.messages.toLocaleString("en-US"),
                    price: (pack.priceCents / 100).toFixed(0),
                  })}
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-400">
        {b.plans}
      </h2>
      <div className="mt-3 grid items-start gap-5 lg:grid-cols-3">
        {PLAN_ORDER.map((id) => {
          const plan = PLANS[id];
          const isCurrent = id === current.id;
          const featured = id === "starter";

          return (
            <div
              key={id}
              className={
                "rounded-2xl border bg-white p-6 " +
                (isCurrent ? "border-brand ring-1 ring-brand/20" : "border-slate-200")
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                {isCurrent && (
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                    {b.current}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="mb-1 text-sm text-slate-400">{site.perMonth}</span>
              </div>

              <div className="mt-5">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-400"
                  >
                    {b.yourPlan}
                  </button>
                ) : plan.price === 0 ? (
                  <p className="py-2.5 text-center text-xs text-slate-400">
                    {b.downgradeVia}
                  </p>
                ) : isFree ? (
                  <form action={startCheckout}>
                    <input type="hidden" name="plan" value={id} />
                    <SubmitButton className="w-full" pendingText="…">
                      {b.upgradeTo} {plan.name}
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
                      {b.switchTo} {plan.name}
                    </button>
                  </form>
                )}
              </div>

              <ul className="mt-6 space-y-2.5">
                {site.plans[id].highlights.map((h) => (
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

      <p className="mt-6 text-center text-xs text-slate-400">{b.testCardNote}</p>
    </div>
  );
}
