import Link from "next/link";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plans";
import { getLocale } from "@/lib/i18n/getLocale";
import { getAppDict, tpl } from "@/lib/i18n/app";
import { SubmitButton } from "@/components/SubmitButton";
import { createChatbot, deleteChatbot } from "./actions";
import type { Chatbot } from "@/lib/types";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ limit?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const { userId, profile } = await requireUser();
  const plan = getPlan(profile.plan);
  const dict = getAppDict(await getLocale());
  const t = dict.dash;

  const supabase = await createClient();
  const { data } = await supabase
    .from("chatbots")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  const chatbots = (data as Chatbot[]) ?? [];
  const atLimit = chatbots.length >= plan.limits.chatbots;

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {tpl(t.usageTpl, {
              used: chatbots.length,
              total: plan.limits.chatbots,
              plan: plan.name,
            })}
          </p>
        </div>
      </div>

      {sp.limit === "chatbots" && (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {tpl(t.limitBanner, { plan: plan.name })}{" "}
          <Link href="/dashboard/billing" className="font-semibold underline">
            {dict.common.upgrade}
          </Link>
        </p>
      )}
      {sp.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {sp.error}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {chatbots.map((bot) => (
          <div
            key={bot.id}
            className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <Link href={`/dashboard/chatbots/${bot.id}`} className="block">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 place-items-center rounded-lg text-white"
                  style={{ backgroundColor: bot.widget_color }}
                >
                  <MessageSquare size={18} />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{bot.name}</h3>
                  <p className="text-xs text-slate-400">
                    {tpl(t.createdTpl, {
                      date: new Date(bot.created_at).toLocaleDateString(),
                    })}
                  </p>
                </div>
              </div>
            </Link>
            <form action={deleteChatbot} className="absolute right-3 top-3">
              <input type="hidden" name="id" value={bot.id} />
              <button
                className="rounded-lg p-1.5 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                title={t.deleteChatbot}
                aria-label={t.deleteChatbot}
              >
                <Trash2 size={16} />
              </button>
            </form>
          </div>
        ))}
      </div>

      {/* Create new chatbot */}
      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-5">
        {atLimit ? (
          <p className="text-sm text-slate-500">
            {t.limitReached}{" "}
            <Link href="/dashboard/billing" className="font-semibold text-brand">
              {t.upgradeToCreate}
            </Link>
          </p>
        ) : (
          <form action={createChatbot} className="flex flex-col gap-3 sm:flex-row">
            <input
              name="name"
              placeholder={t.namePh}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <SubmitButton pendingText={t.creating}>
              <Plus size={16} className="mr-1" />
              {t.newChatbot}
            </SubmitButton>
          </form>
        )}
      </div>
    </div>
  );
}
