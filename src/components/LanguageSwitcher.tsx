"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { LOCALES, type Locale } from "@/lib/i18n/site";

// Animated language dropdown: sets a `locale` cookie and refreshes so server
// components re-render in the chosen language.
export function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cur = LOCALES.find((l) => l.code === current) ?? LOCALES[0];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  function pick(code: string) {
    setOpen(false);
    document.cookie = `locale=${code}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <span className="text-base leading-none">{cur.flag}</span>
        <span className="hidden sm:inline">{cur.label}</span>
        <ChevronDown
          size={14}
          className={"text-slate-400 transition-transform duration-200 " + (open ? "rotate-180" : "")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="animate-dropdown absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
        >
          {LOCALES.map((l) => {
            const active = l.code === current;
            return (
              <button
                key={l.code}
                onClick={() => pick(l.code)}
                role="option"
                aria-selected={active}
                className={
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors " +
                  (active
                    ? "bg-indigo-50 font-semibold text-slate-900"
                    : "text-slate-600 hover:bg-slate-50")
                }
              >
                <span className="text-base leading-none">{l.flag}</span>
                <span className="flex-1 text-left">{l.label}</span>
                {active && <Check size={15} className="text-brand" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
