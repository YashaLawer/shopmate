import Link from "next/link";
import { MessageSquare, Users, Lock } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plans";
import { startOfMonthISO } from "@/lib/cors";
import { getLocale } from "@/lib/i18n/getLocale";
import { getAppDict } from "@/lib/i18n/app";

export const dynamic = "force-dynamic";

export default async function GlobalAnalyticsPage() {
  const { userId, profile } = await requireUser();
  const plan = getPlan(profile.plan);
  const locale = await getLocale();
  const dict = getAppDict(locale);
  const g = dict.ganalytics;
  const an = dict.analytics;

  const supabase = await createClient();
  const { data: botsData } = await supabase
    .from("chatbots")
    .select("id, name, widget_color")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  const bots = (botsData as { id: string; name: string; widget_color: string }[]) ?? [];

  // No bots yet
  if (bots.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900">{g.title}</h1>
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-400">
          {g.noBots}
        </p>
      </div>
    );
  }

  // Pro-gated
  if (!plan.features.analytics) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900">{g.title}</h1>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-brand">
            <Lock size={22} />
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-900">{an.proFeature}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{an.proDesc}</p>
          <Link
            href="/dashboard/billing"
            className="mt-6 inline-block rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            {an.upgradePro}
          </Link>
        </div>
      </div>
    );
  }

  // Aggregate stats
  const { count: convTotal } = await supabase
    .from("conversations")
    .select("id", { count: "exact", head: true });

  const { data: msgData } = await supabase
    .from("messages")
    .select("chatbot_id, content, created_at")
    .eq("owner_id", userId)
    .eq("role", "user")
    .gte("created_at", startOfMonthISO())
    .order("created_at", { ascending: false });
  const messages = (msgData as { chatbot_id: string; content: string; created_at: string }[]) ?? [];

  const perBot = bots
    .map((b) => ({
      ...b,
      count: messages.filter((m) => m.chatbot_id === b.id).length,
    }))
    .sort((a, b) => b.count - a.count);
  const maxBot = Math.max(1, ...perBot.map((b) => b.count));
  const recent = messages.slice(0, 12);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">{g.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{g.subtitle}</p>

      {/* Stat tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Stat icon={Users} label={an.conversations} value={convTotal ?? 0} />
        <Stat icon={MessageSquare} label={g.totalMessages} value={messages.length} />
      </div>

      {/* Per-bot breakdown */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">{g.perBot}</h2>
        <div className="mt-4 space-y-3">
          {perBot.map((b) => (
            <Link
              key={b.id}
              href={`/dashboard/chatbots/${b.id}/analytics`}
              className="block"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{b.name}</span>
                <span className="text-slate-400">{b.count}</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(b.count / maxBot) * 100}%`,
                    minHeight: 8,
                    backgroundColor: b.widget_color,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent questions across bots */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">{an.recentQuestions}</h2>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">{an.noQuestions}</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {recent.map((m, i) => (
              <li key={i} className="flex items-start justify-between gap-4 py-2.5">
                <span className="text-sm text-slate-700">{m.content}</span>
                <span className="shrink-0 text-xs text-slate-400">
                  {new Date(m.created_at).toLocaleDateString(locale)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-50 text-brand">
        <Icon size={17} />
      </span>
      <p className="mt-3 text-2xl font-bold text-slate-900">
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
