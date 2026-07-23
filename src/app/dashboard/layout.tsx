import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getPlan } from "@/lib/plans";
import { signout } from "@/app/(auth)/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email, profile } = await requireUser();
  const plan = getPlan(profile.plan);

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-slate-900"
              title="Back to homepage"
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-sm text-white">
                S
              </span>
              Shopmate
            </Link>
            <Link
              href="/dashboard"
              className="hidden text-sm font-medium text-slate-500 hover:text-slate-900 sm:inline"
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/dashboard/billing"
              className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 hover:bg-slate-200"
            >
              {plan.name} plan
            </Link>
            <span className="hidden text-slate-500 sm:inline">{email}</span>
            <form action={signout}>
              <button className="rounded-lg px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
