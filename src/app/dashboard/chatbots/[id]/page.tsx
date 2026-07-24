import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plans";
import { getBaseUrl } from "@/lib/baseUrl";
import { getLocale } from "@/lib/i18n/getLocale";
import { getAppDict } from "@/lib/i18n/app";
import { updateChatbot } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { KnowledgeManager } from "./KnowledgeManager";
import { TestChat } from "./TestChat";
import { InstallWidget } from "./InstallWidget";
import { HandoffSettings } from "./HandoffSettings";
import type { Chatbot, KnowledgeDocument } from "@/lib/types";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default async function ChatbotDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const { userId, profile } = await requireUser();
  const plan = getPlan(profile.plan);
  const appUrl = await getBaseUrl();
  const dict = getAppDict(await getLocale());
  const t = dict.bot;

  const supabase = await createClient();
  const { data } = await supabase
    .from("chatbots")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (!data) notFound();
  const bot = data as Chatbot;

  const { data: docsData } = await supabase
    .from("documents")
    .select("*")
    .eq("chatbot_id", id)
    .order("created_at", { ascending: false });
  const documents = (docsData as KnowledgeDocument[]) ?? [];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={16} /> {t.allChatbots}
        </Link>
        <Link
          href={`/dashboard/chatbots/${bot.id}/analytics`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <BarChart3 size={15} /> {t.analytics}
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-900">{bot.name}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>

      {sp.saved && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {t.saved}
        </p>
      )}

      {/* Test chat */}
      <div className="mt-6">
        <TestChat
          chatbotId={bot.id}
          welcomeMessage={bot.welcome_message}
          accent={bot.widget_color}
          hasKnowledge={documents.length > 0}
          strings={dict.chat}
        />
      </div>

      {/* Knowledge base */}
      <div className="mt-6">
        <KnowledgeManager
          chatbotId={bot.id}
          documents={documents}
          pagesUsed={documents.length}
          pagesLimit={plan.limits.pages}
          strings={dict.kb}
        />
      </div>

      {/* Settings */}
      <form
        action={updateChatbot}
        className="mt-6 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="id" value={bot.id} />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {t.assistantName}
          </label>
          <input name="name" defaultValue={bot.name} className={inputClass} />
          <p className="mt-1 text-xs text-slate-400">{t.assistantNameHint}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {t.welcomeMessage}
          </label>
          <input
            name="welcome_message"
            defaultValue={bot.welcome_message}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-400">{t.welcomeHint}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {t.systemInstr}{" "}
            <span className="font-normal text-slate-400">{t.optional}</span>
          </label>
          <textarea
            name="system_prompt"
            rows={4}
            defaultValue={bot.system_prompt ?? ""}
            placeholder={t.systemPh}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {t.widgetColor}
          </label>
          <input
            name="widget_color"
            type="color"
            defaultValue={bot.widget_color}
            className="h-10 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
          />
        </div>

        <HandoffSettings
          initialType={bot.handoff_type}
          initialValue={bot.handoff_value}
          strings={t}
        />

        <div className="flex justify-end">
          <SubmitButton pendingText={t.saving}>{t.saveSettings}</SubmitButton>
        </div>
      </form>

      {/* Install / embed */}
      <div className="mt-4">
        <InstallWidget
          chatbotId={bot.id}
          appUrl={appUrl}
          publicKey={bot.public_key}
          color={bot.widget_color}
          allowedDomains={bot.allowed_domains ?? []}
          strings={dict.install}
        />
      </div>
    </div>
  );
}
