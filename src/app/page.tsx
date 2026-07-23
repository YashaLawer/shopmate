import Link from "next/link";
import {
  ArrowRight,
  Upload,
  Sparkles,
  Code2,
  ShieldCheck,
  Zap,
  Palette,
  BarChart3,
  Globe,
  Check,
} from "lucide-react";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDict, type Dict, type Locale } from "@/lib/i18n/site";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const STEP_ICONS = [Upload, Sparkles, Code2];
const FEATURE_ICONS = [ShieldCheck, Code2, Globe, Zap, Palette, BarChart3];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentPlan: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    currentPlan = profile?.plan ?? "free";
  }

  const locale = await getLocale();
  const d = getDict(locale);

  return (
    <div className="bg-white text-slate-900">
      <Nav isAuthed={!!user} d={d} locale={locale} />
      <Hero d={d} />
      <TrustBar d={d} />
      <HowItWorks d={d} />
      <Features d={d} />
      <Showcase d={d} />
      <Pricing currentPlan={currentPlan} d={d} />
      <Faq d={d} />
      <FinalCta d={d} />
      <Footer d={d} />
    </div>
  );
}

/* ---------------- Nav ---------------- */
function Nav({
  isAuthed,
  d,
  locale,
}: {
  isAuthed: boolean;
  d: Dict;
  locale: Locale;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-sm text-white">
            S
          </span>
          Shopmate
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          <a href="#how" className="hover:text-slate-900">{d.nav.how}</a>
          <a href="#features" className="hover:text-slate-900">{d.nav.features}</a>
          <a href="#pricing" className="hover:text-slate-900">{d.nav.pricing}</a>
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <LanguageSwitcher current={locale} />
          {isAuthed ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-brand px-4 py-2 font-semibold text-white transition hover:bg-indigo-700"
            >
              {d.nav.dashboard}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-2 font-medium text-slate-600 hover:text-slate-900 sm:block"
              >
                {d.nav.signin}
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-brand px-4 py-2 font-semibold text-white transition hover:bg-indigo-700"
              >
                {d.nav.getStarted}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ d }: { d: Dict }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(79,70,229,0.10),transparent)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-brand">
            <Sparkles size={13} /> {d.hero.badge}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            {d.hero.title}
          </h1>
          <p className="mt-5 max-w-lg text-lg text-slate-600">{d.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {d.hero.cta} <ArrowRight size={16} />
            </Link>
            <a
              href="#how"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {d.hero.see}
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-400">{d.hero.trustline}</p>
        </div>
        <ChatMockup d={d} />
      </div>
    </section>
  );
}

function ChatMockup({ d }: { d: Dict }) {
  const m = d.hero.mockup;
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 rounded bg-white px-2 py-0.5 text-[11px] text-slate-400">
            acme-store.com
          </span>
        </div>
        <div className="relative h-72 bg-gradient-to-br from-slate-50 to-slate-100 p-5">
          <div className="h-3 w-24 rounded bg-slate-200" />
          <div className="mt-3 h-6 w-40 rounded bg-slate-300" />
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg bg-white p-2 shadow-sm">
                <div className="h-12 rounded bg-slate-100" />
                <div className="mt-2 h-2 w-3/4 rounded bg-slate-200" />
                <div className="mt-1 h-2 w-1/2 rounded bg-slate-200" />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 right-4 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center gap-2 bg-brand px-3 py-2 text-white">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-xs font-bold">
                A
              </span>
              <span className="text-xs font-semibold">{m.title}</span>
            </div>
            <div className="space-y-2 bg-slate-50 p-3">
              <Msg who="bot">{m.welcome}</Msg>
              <Msg who="user">{m.q}</Msg>
              <Msg who="bot">{m.a}</Msg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Msg({ who, children }: { who: "bot" | "user"; children: React.ReactNode }) {
  const isUser = who === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          "max-w-[85%] rounded-xl px-2.5 py-1.5 text-[11px] leading-snug " +
          (isUser ? "bg-brand text-white" : "bg-white text-slate-700 shadow-sm")
        }
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------- Trust bar ---------------- */
function TrustBar({ d }: { d: Dict }) {
  return (
    <section className="border-y border-slate-100 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-4 text-sm text-slate-500">
        {d.trust.map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <Check size={15} className="text-emerald-500" /> {t}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */
function HowItWorks({ d }: { d: Dict }) {
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeading eyebrow={d.how.eyebrow} title={d.how.title} />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {d.how.steps.map((s, i) => {
          const Icon = STEP_ICONS[i];
          return (
            <div
              key={s.title}
              className="relative rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="absolute right-5 top-5 text-4xl font-bold text-slate-100">
                {i + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-brand">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */
function Features({ d }: { d: Dict }) {
  return (
    <section id="features" className="border-y border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading eyebrow={d.features.eyebrow} title={d.features.title} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {d.features.items.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-brand">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Showcase ---------------- */
function Showcase({ d }: { d: Dict }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeading eyebrow={d.showcase.eyebrow} title={d.showcase.title} />
      <div className="mx-auto mt-12 max-w-2xl space-y-4">
        {d.showcase.qa.map((item) => (
          <div key={item.q} className="space-y-2">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl bg-brand px-4 py-2.5 text-sm text-white">
                {item.q}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-800">
                {item.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */
function Pricing({ currentPlan, d }: { currentPlan: string | null; d: Dict }) {
  const curPrice =
    currentPlan && currentPlan in PLANS
      ? PLANS[currentPlan as keyof typeof PLANS].price
      : -1;

  return (
    <section id="pricing" className="border-y border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading eyebrow={d.pricing.eyebrow} title={d.pricing.title} />
        <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
          {PLAN_ORDER.map((id) => {
            const plan = PLANS[id];
            const featured = id === "starter";
            const isCurrent = currentPlan === id;

            let label: string;
            let href: string;
            if (!currentPlan) {
              label = plan.price === 0 ? d.pricing.getFree : `${d.pricing.choose} ${plan.name}`;
              href = "/signup";
            } else if (isCurrent) {
              label = d.pricing.current;
              href = "/dashboard/billing";
            } else {
              href = "/dashboard/billing";
              label =
                plan.price > curPrice
                  ? `${d.pricing.upgrade} ${plan.name}`
                  : plan.price === 0
                    ? d.pricing.downgrade
                    : `${d.pricing.switchTo} ${plan.name}`;
            }

            return (
              <div
                key={id}
                className={
                  "rounded-2xl border bg-white p-7 " +
                  (isCurrent
                    ? "border-emerald-400 ring-1 ring-emerald-200"
                    : featured
                      ? "border-brand shadow-lg ring-1 ring-brand/20"
                      : "border-slate-200")
                }
              >
                {isCurrent ? (
                  <span className="mb-3 inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                    {d.pricing.current}
                  </span>
                ) : featured ? (
                  <span className="mb-3 inline-block rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                    {d.pricing.popular}
                  </span>
                ) : null}
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{d.pricing.plans[id].tagline}</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="mb-1 text-sm text-slate-400">{d.pricing.perMonth}</span>
                </div>
                <Link
                  href={href}
                  aria-disabled={isCurrent}
                  className={
                    "mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition " +
                    (isCurrent
                      ? "cursor-default border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : featured
                        ? "bg-brand text-white hover:bg-indigo-700"
                        : "border border-slate-300 text-slate-700 hover:bg-slate-50")
                  }
                >
                  {label}
                </Link>
                <ul className="mt-6 space-y-2.5">
                  {d.pricing.plans[id].highlights.map((h) => (
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
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function Faq({ d }: { d: Dict }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20">
      <SectionHeading eyebrow={d.faq.eyebrow} title={d.faq.title} />
      <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
        {d.faq.items.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              {f.q}
              <span className="text-slate-400 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
function FinalCta({ d }: { d: Dict }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-8 py-14 text-center text-white">
        <h2 className="mx-auto max-w-xl text-3xl font-bold sm:text-4xl">
          {d.cta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-indigo-100">{d.cta.text}</p>
        <Link
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand transition hover:bg-indigo-50"
        >
          {d.cta.button} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer({ d }: { d: Dict }) {
  return (
    <footer className="border-t border-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-slate-400 sm:flex-row">
        <div className="flex items-center gap-2 font-semibold text-slate-600">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-brand text-xs text-white">
            S
          </span>
          Shopmate
        </div>
        <p>© 2026 Shopmate. {d.footer}</p>
      </div>
    </footer>
  );
}

/* ---------------- Shared ---------------- */
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
