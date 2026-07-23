"use client";

import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { LOCALES, type Locale } from "@/lib/i18n/site";

// Sets a `locale` cookie and refreshes so server components re-render translated.
export function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();

  function change(value: string) {
    document.cookie = `locale=${value}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <label className="relative inline-flex items-center">
      <Globe
        size={15}
        className="pointer-events-none absolute left-2.5 text-slate-500"
      />
      <select
        aria-label="Language"
        value={current}
        onChange={(e) => change(e.target.value)}
        className="appearance-none rounded-lg border border-slate-300 bg-white py-1.5 pl-8 pr-6 text-sm font-medium text-slate-700 outline-none hover:bg-slate-50 focus:border-brand"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
