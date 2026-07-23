import Link from "next/link";
import { getLocale } from "@/lib/i18n/getLocale";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher current={locale} />
      </div>

      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-xl font-bold text-slate-900"
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
          S
        </span>
        Shopmate
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
