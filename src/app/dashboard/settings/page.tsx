import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getPlan } from "@/lib/plans";
import { getLocale } from "@/lib/i18n/getLocale";
import { getAppDict } from "@/lib/i18n/app";
import { LOCALES } from "@/lib/i18n/site";
import { PasswordForm } from "./PasswordForm";

export default async function SettingsPage() {
  const { email, profile } = await requireUser();
  const plan = getPlan(profile.plan);
  const locale = await getLocale();
  const s = getAppDict(locale).settings;
  const langLabel = LOCALES.find((l) => l.code === locale)?.label ?? "English";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">{s.title}</h1>

      {/* Account */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">{s.account}</h2>
        <dl className="mt-4 divide-y divide-slate-100 text-sm">
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-slate-500">{s.emailLabel}</dt>
            <dd className="font-medium text-slate-800">{email}</dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-slate-500">{s.planLabel}</dt>
            <dd className="flex items-center gap-2 font-medium text-slate-800">
              {plan.name}
              <Link href="/dashboard/billing" className="text-xs font-semibold text-brand hover:underline">
                {s.managePlan}
              </Link>
            </dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-slate-500">{s.languageLabel}</dt>
            <dd className="font-medium text-slate-800">{langLabel}</dd>
          </div>
        </dl>
      </div>

      {/* Password */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">{s.security}</h2>
        <label className="mt-3 block text-xs font-medium text-slate-600">
          {s.newPassword}
        </label>
        <PasswordForm s={s} />
      </div>
    </div>
  );
}
