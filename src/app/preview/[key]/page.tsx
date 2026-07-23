import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBaseUrl } from "@/lib/baseUrl";
import type { Chatbot } from "@/lib/types";

export const dynamic = "force-dynamic";

// A mock website that embeds the widget so owners see how their assistant looks
// as a floating chat bubble on a real page (instead of the full-screen chat).
export default async function PreviewPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const admin = createAdminClient();
  const { data } = await admin
    .from("chatbots")
    .select("*")
    .eq("public_key", key)
    .single();
  if (!data) notFound();
  const bot = data as Chatbot;
  const appUrl = await getBaseUrl();

  const inject = `(function(){var s=document.createElement('script');s.src=${JSON.stringify(
    appUrl + "/widget.js",
  )};s.setAttribute('data-key',${JSON.stringify(
    bot.public_key,
  )});s.setAttribute('data-color',${JSON.stringify(
    bot.widget_color,
  )});s.async=true;document.body.appendChild(s);})();`;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Preview banner */}
      <div className="bg-slate-900 px-4 py-2.5 text-center text-sm text-white">
        👀 Preview — this is how <b>{bot.name}</b> looks on a real website. Try the
        chat bubble in the bottom-right corner.
      </div>

      {/* Mock storefront */}
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="text-lg font-extrabold tracking-tight">Northwind Goods</div>
          <nav className="hidden gap-6 text-sm text-slate-500 sm:flex">
            <span>Shop</span>
            <span>Collections</span>
            <span>About</span>
            <span>Contact</span>
          </nav>
          <div className="text-sm font-medium">Cart · 0</div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Beautifully made goods for everyday life
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-slate-500">
            Free shipping over $50 · 30-day returns · shipped worldwide.
          </p>
          <button
            className="mt-8 rounded-lg px-6 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: bot.widget_color }}
          >
            Shop the collection
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-6 text-xl font-bold">Featured products</h2>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {["🕯️", "☕", "🧺", "🌿", "🍶", "🧴", "🪑", "🧷"].map((e, i) => (
            <div key={i} className="rounded-xl border border-slate-100 p-4">
              <div className="grid h-24 place-items-center rounded-lg bg-slate-50 text-4xl">
                {e}
              </div>
              <div className="mt-3 text-sm font-medium">Product {i + 1}</div>
              <div className="text-sm text-slate-400">${20 + i * 7}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-100 py-10 text-center text-sm text-slate-400">
        © 2026 Northwind Goods — demo storefront for widget preview.
      </footer>

      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <script dangerouslySetInnerHTML={{ __html: inject }} />
    </div>
  );
}
