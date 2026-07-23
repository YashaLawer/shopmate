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

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-white text-slate-900">
      <Nav isAuthed={!!user} />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Features />
      <Showcase />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}

/* ---------------- Nav ---------------- */
function Nav({ isAuthed }: { isAuthed: boolean }) {
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
          <a href="#how" className="hover:text-slate-900">How it works</a>
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#pricing" className="hover:text-slate-900">Pricing</a>
        </nav>
        <div className="flex items-center gap-2 text-sm">
          {isAuthed ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-brand px-4 py-2 font-semibold text-white transition hover:bg-indigo-700"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 font-medium text-slate-600 hover:text-slate-900"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-brand px-4 py-2 font-semibold text-white transition hover:bg-indigo-700"
              >
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(79,70,229,0.10),transparent)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-brand">
            <Sparkles size={13} /> AI support for online stores
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            Turn your help docs into a support agent that never sleeps
          </h1>
          <p className="mt-5 max-w-lg text-lg text-slate-600">
            Shopmate turns your store&apos;s FAQs, policies and product info into
            an AI assistant that answers customers instantly — in a chat widget
            right on your website.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Get started free <ArrowRight size={16} />
            </Link>
            <a
              href="#how"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Free plan • No credit card required • Set up in 5 minutes
          </p>
        </div>

        <ChatMockup />
      </div>
    </section>
  );
}

/* A static, realistic mockup of the widget running on a store. */
function ChatMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Browser frame */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 rounded bg-white px-2 py-0.5 text-[11px] text-slate-400">
            acme-store.com
          </span>
        </div>
        {/* Faux store content */}
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

          {/* Chat widget */}
          <div className="absolute bottom-4 right-4 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center gap-2 bg-brand px-3 py-2 text-white">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-xs font-bold">
                A
              </span>
              <span className="text-xs font-semibold">Acme Store Support</span>
            </div>
            <div className="space-y-2 bg-slate-50 p-3">
              <Msg who="bot">Hi! How can I help you with your order today?</Msg>
              <Msg who="user">How long does shipping take?</Msg>
              <Msg who="bot">
                US orders arrive in 3–5 business days, and shipping is free over
                $50 🚚
              </Msg>
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
function TrustBar() {
  const items = [
    "Answers only from your content",
    "No code required",
    "Works with PDF, URLs & text",
    "Live in minutes",
  ];
  return (
    <section className="border-y border-slate-100 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-4 text-sm text-slate-500">
        {items.map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <Check size={15} className="text-emerald-500" /> {t}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */
function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Add your knowledge",
      text: "Paste your FAQ, upload a policy doc, or point us at your help pages. Shopmate reads and indexes it in seconds.",
    },
    {
      icon: Sparkles,
      title: "Preview your assistant",
      text: "Test it right in your dashboard. It answers strictly from your content — no made-up policies or prices.",
    },
    {
      icon: Code2,
      title: "Embed on your store",
      text: "Copy one line of code into your site. A chat bubble appears, ready to answer customers 24/7.",
    },
  ];
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeading
        eyebrow="How it works"
        title="From docs to live support in three steps"
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="relative rounded-2xl border border-slate-200 bg-white p-6"
          >
            <span className="absolute right-5 top-5 text-4xl font-bold text-slate-100">
              {i + 1}
            </span>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-brand">
              <s.icon size={20} />
            </span>
            <h3 className="mt-4 font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */
function Features() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Grounded, not guessing",
      text: "Answers come only from your knowledge base. If it doesn't know, it says so and points to support — never invents.",
    },
    {
      icon: Code2,
      title: "One-line embed",
      text: "A single script tag adds a polished chat widget to any store — Shopify, WooCommerce, custom, anything.",
    },
    {
      icon: Globe,
      title: "Feed it anything",
      text: "Pasted text, .txt/.md files, or a URL to your help pages. Update anytime and the assistant stays current.",
    },
    {
      icon: Zap,
      title: "Instant streaming replies",
      text: "Customers get fast, word-by-word answers — the same experience they expect from modern chat.",
    },
    {
      icon: Palette,
      title: "Match your brand",
      text: "Set the widget color and welcome message so it feels like a native part of your store.",
    },
    {
      icon: BarChart3,
      title: "See what customers ask",
      text: "Every conversation is saved, so you learn the real questions and the gaps in your help content.",
    },
  ];
  return (
    <section id="features" className="border-y border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to deflect support tickets"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-brand">
                <f.icon size={20} />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Showcase ---------------- */
function Showcase() {
  const qa = [
    { q: "Can I return something after 3 weeks?", a: "Yes! You can return any unused item within 30 days for a full refund. Just email support@acme.com with your order number." },
    { q: "Do you ship to Canada?", a: "We ship worldwide 🌍 International orders usually arrive in 7–14 business days." },
    { q: "What payment methods do you take?", a: "Visa, Mastercard, Amex, Apple Pay and Google Pay — all processed securely via Stripe." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeading
        eyebrow="In action"
        title="Real answers, straight from your store's own content"
      />
      <div className="mx-auto mt-12 max-w-2xl space-y-4">
        {qa.map((item) => (
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
function Pricing() {
  return (
    <section id="pricing" className="border-y border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading
          eyebrow="Pricing"
          title="Start free. Upgrade when your store grows."
        />
        <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
          {PLAN_ORDER.map((id) => {
            const plan = PLANS[id];
            const featured = id === "starter";
            return (
              <div
                key={id}
                className={
                  "rounded-2xl border bg-white p-7 " +
                  (featured
                    ? "border-brand shadow-lg ring-1 ring-brand/20"
                    : "border-slate-200")
                }
              >
                {featured && (
                  <span className="mb-3 inline-block rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{plan.tagline}</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="mb-1 text-sm text-slate-400">/month</span>
                </div>
                <Link
                  href="/signup"
                  className={
                    "mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition " +
                    (featured
                      ? "bg-brand text-white hover:bg-indigo-700"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50")
                  }
                >
                  {plan.price === 0 ? "Get started free" : `Choose ${plan.name}`}
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
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function Faq() {
  const faqs = [
    {
      q: "How does Shopmate know the answers?",
      a: "You give it your store's own content — FAQs, shipping & return policies, product details. It only answers from that. If something isn't covered, it tells the customer to contact support instead of guessing.",
    },
    {
      q: "Do I need to write any code?",
      a: "No. You add knowledge and customize the assistant in the dashboard, then paste one line of code into your site. If you use Shopify or WooCommerce, that's a single copy-paste.",
    },
    {
      q: "Which website builders does it work with?",
      a: "Any website where you can add an HTML snippet — Shopify, WooCommerce, Wix, Squarespace, Webflow, or a fully custom site.",
    },
    {
      q: "What happens if I hit my message limit?",
      a: "The assistant pauses new answers until the next month or until you upgrade. Your knowledge and settings are always kept.",
    },
  ];
  return (
    <section className="mx-auto max-w-3xl px-5 py-20">
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />
      <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
        {faqs.map((f) => (
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
function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-8 py-14 text-center text-white">
        <h2 className="mx-auto max-w-xl text-3xl font-bold sm:text-4xl">
          Stop answering the same questions over and over
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-indigo-100">
          Give your customers instant answers and give yourself back your time.
          Set up your assistant in minutes — free.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand transition hover:bg-indigo-50"
        >
          Get started free <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="border-t border-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-slate-400 sm:flex-row">
        <div className="flex items-center gap-2 font-semibold text-slate-600">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-brand text-xs text-white">
            S
          </span>
          Shopmate
        </div>
        <p>© 2026 Shopmate. AI support for online stores.</p>
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
