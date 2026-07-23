import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquare, Users, Sparkles, Lock } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plans";
import { startOfMonthISO } from "@/lib/cors";
import type { Chatbot } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId, profile } = await requireUser();
  const plan = getPlan(profile.plan);

  const supabase = await createClient();
  const { data: botData } = await supabase
    .from("chatbots")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  if (!botData) notFound();
  const bot = botData as Chatbot;

  const backLink = (
    <Link
      href={`/dashboard/chatbots/${id}`}
      className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
    >
      <ArrowLeft size={16} /> {bot.name}
    </Link>
  );

  // Gated feature — Pro only.
  if (!plan.features.analytics) {
    return (
      <div className="mx-auto max-w-2xl">
        {backLink}
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-brand">
            <Lock size={22} />
          </span>
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Analytics is a Pro feature
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            See every question your customers ask, spot gaps in your help
            content, and track how much support your assistant handles.
          </p>
          <Link
            href="/dashboard/billing"
            className="mt-6 inline-block rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    );
  }

  // --- Gather stats ---
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const [{ count: convCount }, { count: msgMonth }, recentRes, weekRes] =
    await Promise.all([
      supabase
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq("chatbot_id", id),
      supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("chatbot_id", id)
        .eq("role", "user")
        .gte("created_at", startOfMonthISO()),
      supabase
        .from("messages")
        .select("content, created_at")
        .eq("chatbot_id", id)
        .eq("role", "user")
        .order("created_at", { ascending: false })
        .limit(15),
      supabase
        .from("messages")
        .select("created_at")
        .eq("chatbot_id", id)
        .eq("role", "user")
        .gte("created_at", weekAgo),
    ]);

  const recent = (recentRes.data as { content: string; created_at: string }[]) ?? [];
  const week = (weekRes.data as { created_at: string }[]) ?? [];

  // Build a last-7-days histogram.
  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    const count = week.filter((m) => m.created_at.slice(0, 10) === key).length;
    days.push({
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
      count,
    });
  }
  const maxDay = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="mx-auto max-w-3xl">
      {backLink}
      <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
      <p className="mt-1 text-sm text-slate-500">
        What customers are asking {bot.name}.
      </p>

      {/* Stat tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat icon={Users} label="Conversations" value={convCount ?? 0} />
        <Stat
          icon={MessageSquare}
          label="Questions this month"
          value={msgMonth ?? 0}
        />
        <Stat icon={Sparkles} label="Plan limit" value={plan.limits.messagesPerMonth} />
      </div>

      {/* Last 7 days */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">
          Questions · last 7 days
        </h2>
        <div className="mt-5 flex h-32 items-end justify-between gap-2">
          {days.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t bg-brand/80"
                style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count ? 4 : 0 }}
                title={`${d.count}`}
              />
              <span className="text-xs text-slate-400">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent questions */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">Recent questions</h2>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">
            No customer questions yet. Once people chat with your widget, their
            questions show up here.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {recent.map((m, i) => (
              <li key={i} className="flex items-start justify-between gap-4 py-2.5">
                <span className="text-sm text-slate-700">{m.content}</span>
                <span className="shrink-0 text-xs text-slate-400">
                  {new Date(m.created_at).toLocaleDateString()}
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
