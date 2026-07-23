"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { SubmitButton } from "@/components/SubmitButton";
import { CycleToggle } from "@/components/PricingPlans";

export interface BillingPlanView {
  id: string;
  name: string;
  priceMonth: number;
  priceYear: number | null;
  highlights: string[];
  isCurrent: boolean;
  featured: boolean;
  isPaid: boolean;
}

export interface BillingLabels {
  monthly: string;
  yearly: string;
  save: string;
  billedYearly: string; // contains "{price}"
  perMonth: string;
  current: string;
  yourPlan: string;
  upgradeTo: string;
  switchTo: string;
  downgradeVia: string;
}

export function BillingPlans({
  plans,
  labels,
  isFreeUser,
  changePlan,
}: {
  plans: BillingPlanView[];
  labels: BillingLabels;
  isFreeUser: boolean;
  changePlan: (formData: FormData) => Promise<void>;
}) {
  const [cycle, setCycle] = useState<"month" | "year">("month");

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

          return (
            <div
              key={plan.id}
              className={
                "rounded-2xl border bg-white p-6 " +
                (plan.isCurrent
                  ? "border-brand ring-1 ring-brand/20"
                  : "border-slate-200")
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                {plan.isCurrent && (
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
                {plan.isCurrent ? (
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
                  <form action={changePlan}>
                    <input type="hidden" name="plan" value={plan.id} />
                    <input type="hidden" name="cycle" value={cycle} />
                    <SubmitButton className="w-full" pendingText="…">
                      {isFreeUser ? labels.upgradeTo : labels.switchTo} {plan.name}
                    </SubmitButton>
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
    </div>
  );
}
