import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getPlan } from "@/lib/plans";
import { signout } from "@/app/(auth)/actions";
import { getLocale } from "@/lib/i18n/getLocale";
import { getAppDict } from "@/lib/i18n/app";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { DashboardNav } from "@/components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email, profile } = await requireUser();
  const plan = getPlan(profile.plan);
  const locale = await getLocale();
  const dict = getAppDict(locale);
  const c = dict.common;

  const planBadge = (
    <Link
      href="/dashboard/billing"
      className="block rounded-lg bg-slate-100 px-3 py-1.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-200"
    >
      {plan.name} {c.planSuffix}
    </Link>
  );

  const signOutBtn = (
    <form action={signout}>
      <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
        {c.signOut}
      </button>
    </form>
  );

  return (
    <div className="lg:flex lg:min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-4 font-bold text-slate-900"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-sm text-white">
            S
          </span>
          Shopmate
        </Link>

        <div className="mt-2 flex-1">
          <DashboardNav nav={dict.nav} variant="sidebar" />
        </div>

        <div className="space-y-2 border-t border-slate-100 p-3">
          {planBadge}
          <div className="flex items-center justify-between gap-2">
            <LanguageSwitcher current={locale} up />
            {signOutBtn}
          </div>
          <p className="truncate px-1 text-xs text-slate-400">{email}</p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-sm text-white">
              S
            </span>
            Shopmate
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher current={locale} />
            {signOutBtn}
          </div>
        </header>

        {/* Mobile nav */}
        <div className="lg:hidden">
          <DashboardNav nav={dict.nav} variant="tabs" />
        </div>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      </div>
    </div>
  );
}
