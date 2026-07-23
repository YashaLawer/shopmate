"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { SubmitButton } from "@/components/SubmitButton";
import { CycleToggle } from "@/components/PricingPlans";

export interface BillingPlanView {
  id: string;
  name: string;
  priceMonth: number;
  priceYear: number | null;
  highlights: string[];
  featured: boolean;
  isPaid: boolean;
}

export interface BillingLabels {
  monthly: string;
  yearly: string;
  save: string;
  billedYearly: string; // contains "{price}" (card sub-line)
  perMonth: string;
  current: string;
  yourPlan: string;
  upgradeTo: string;
  switchTo: string;
  switchToAnnual: string;
  switchToMonthly: string;
  downgradeVia: string;
  // confirmation dialog
  confirmTitle: string;
  confirmLine: string; // "{plan} {price} {billed}"
  confirmNote: string;
  confirmCta: string;
  cancelBtn: string;
  billedMonthlyWord: string; // "billed monthly"
  billedYearlyWord: string; // "billed yearly"
}

type Pending = { plan: BillingPlanView; cycle: "month" | "year"; label: string };

export function BillingPlans({
  plans,
  labels,
  isFreeUser,
  currentPlanId,
  currentInterval,
  changePlan,
}: {
  plans: BillingPlanView[];
  labels: BillingLabels;
  isFreeUser: boolean;
  currentPlanId: string;
  currentInterval: "month" | "year" | null;
  changePlan: (formData: FormData) => Promise<void>;
}) {
  const [cycle, setCycle] = useState<"month" | "year">(
    currentInterval ?? "month",
  );
  const [pending, setPending] = useState<Pending | null>(null);

  return (
    <div>
      <div className="mb-6">
        <CycleToggle cycle={cycle} setCycle={setCycle} labels={labels} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const yearly = cycle === "year" && plan.priceYear != null;
          const big = yearly
            ? Math.round((plan.priceYear as number) / 12)
            : plan.priceMonth;

          const isSamePlan = plan.id === currentPlanId;
          const isExact = isSamePlan && (!plan.isPaid || cycle === currentInterval);

          let switchLabel: string;
          if (isSamePlan) {
            switchLabel =
              cycle === "year" ? labels.switchToAnnual : labels.switchToMonthly;
          } else {
            switchLabel = `${isFreeUser ? labels.upgradeTo : labels.switchTo} ${plan.name}`;
          }

          return (
            <div
              key={plan.id}
              className={
                "rounded-2xl border bg-white p-6 " +
                (isExact
                  ? "border-brand ring-1 ring-brand/20"
                  : "border-slate-200")
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                {isExact && (
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                    {labels.current}
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-end gap-1">
                <span className="text-3xl font-bold">${big}</span>
                <span className="mb-1 text-sm text-slate-400">{labels.perMonth}</span>
              </div>
              <p className="mt-1 h-4 text-xs text-emerald-600">
                {yearly
                  ? labels.billedYearly.replace("{price}", `$${plan.priceYear}`)
                  : ""}
              </p>

              <div className="mt-4">
                {isExact ? (
                  <button
                    disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-400"
                  >
                    {labels.yourPlan}
                  </button>
                ) : !plan.isPaid ? (
                  <p className="py-2.5 text-center text-xs text-slate-400">
                    {labels.downgradeVia}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPending({ plan, cycle, label: switchLabel })}
                    className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    {switchLabel}
                  </button>
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

      {pending && (
        <ConfirmDialog
          pending={pending}
          labels={labels}
          changePlan={changePlan}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}

function ConfirmDialog({
  pending,
  labels,
  changePlan,
  onCancel,
}: {
  pending: Pending;
  labels: BillingLabels;
  changePlan: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const { plan, cycle } = pending;
  const amount = cycle === "year" ? plan.priceYear ?? plan.priceMonth : plan.priceMonth;
  const priceStr = `$${amount}`;
  const billed = cycle === "year" ? labels.billedYearlyWord : labels.billedMonthlyWord;
  const line = labels.confirmLine
    .replace("{plan}", plan.name)
    .replace("{price}", priceStr)
    .replace("{billed}", billed);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-slate-900">{labels.confirmTitle}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label={labels.cancelBtn}
          >
            <X size={18} />
          </button>
        </div>
        <p className="mt-3 text-sm font-medium text-slate-800">{line}</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">{labels.confirmNote}</p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {labels.cancelBtn}
          </button>
          <form action={changePlan}>
            <input type="hidden" name="plan" value={plan.id} />
            <input type="hidden" name="cycle" value={cycle} />
            <SubmitButton pendingText="…">{labels.confirmCta}</SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
}
