"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export interface PlanView {
  id: string;
  name: string;
  tagline: string;
  priceMonth: number;
  priceYear: number | null; // null → no annual option (free plan)
  highlights: string[];
  label: string;
  href: string;
  isCurrent: boolean;
  featured: boolean;
}

export interface PricingLabels {
  monthly: string;
  yearly: string;
  save: string;
  billedYearly: string; // contains "{price}"
  perMonth: string;
  current: string;
  popular: string;
}

export function PricingPlans({
  plans,
  labels,
}: {
  plans: PlanView[];
  labels: PricingLabels;
}) {
  const [cycle, setCycle] = useState<"month" | "year">("month");

  return (
    <div>
      <CycleToggle cycle={cycle} setCycle={setCycle} labels={labels} />

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const yearly = cycle === "year" && plan.priceYear != null;
          const bigPrice = yearly
            ? Math.round((plan.priceYear as number) / 12)
            : plan.priceMonth;

          return (
            <div
              key={plan.id}
              className={
                "rounded-2xl border bg-white p-7 " +
                (plan.isCurrent
                  ? "border-emerald-400 ring-1 ring-emerald-200"
                  : plan.featured
                    ? "border-brand shadow-lg ring-1 ring-brand/20"
                    : "border-slate-200")
              }
            >
              {plan.isCurrent ? (
                <span className="mb-3 inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                  {labels.current}
                </span>
              ) : plan.featured ? (
                <span className="mb-3 inline-block rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                  {labels.popular}
                </span>
              ) : null}
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{plan.tagline}</p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-bold">${bigPrice}</span>
                <span className="mb-1 text-sm text-slate-400">{labels.perMonth}</span>
              </div>
              {/* keep vertical rhythm stable between toggles */}
              <p className="mt-1 h-4 text-xs text-emerald-600">
                {yearly
                  ? labels.billedYearly.replace("{price}", `$${plan.priceYear}`)
                  : ""}
              </p>

              <Link
                href={plan.href}
                aria-disabled={plan.isCurrent}
                className={
                  "mt-5 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition " +
                  (plan.isCurrent
                    ? "cursor-default border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : plan.featured
                      ? "bg-brand text-white hover:bg-indigo-700"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50")
                }
              >
                {plan.label}
              </Link>
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

export function CycleToggle({
  cycle,
  setCycle,
  labels,
}: {
  cycle: "month" | "year";
  setCycle: (c: "month" | "year") => void;
  labels: Pick<PricingLabels, "monthly" | "yearly" | "save">;
}) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 text-sm font-semibold shadow-sm">
        <button
          type="button"
          onClick={() => setCycle("month")}
          className={
            "rounded-full px-4 py-1.5 transition " +
            (cycle === "month"
              ? "bg-brand text-white"
              : "text-slate-500 hover:text-slate-800")
          }
        >
          {labels.monthly}
        </button>
        <button
          type="button"
          onClick={() => setCycle("year")}
          className={
            "flex items-center gap-1.5 rounded-full px-4 py-1.5 transition " +
            (cycle === "year"
              ? "bg-brand text-white"
              : "text-slate-500 hover:text-slate-800")
          }
        >
          {labels.yearly}
          <span
            className={
              "rounded-full px-1.5 py-0.5 text-[10px] font-bold " +
              (cycle === "year"
                ? "bg-white/20 text-white"
                : "bg-emerald-100 text-emerald-700")
            }
          >
            {labels.save}
          </span>
        </button>
      </div>
    </div>
  );
}
