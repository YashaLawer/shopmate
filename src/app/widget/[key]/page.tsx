import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlan } from "@/lib/plans";
import { hostAllowed, normalizeHost } from "@/lib/security";
import { pickLang, WIDGET_STRINGS } from "@/lib/i18n/widget";
import { botDefaults } from "@/lib/botDefaults";
import { WidgetChat } from "./WidgetChat";
import type { Chatbot } from "@/lib/types";

export const dynamic = "force-dynamic";

// Standalone chat page rendered inside the embeddable widget's iframe.
// Public — resolved by the chatbot's public_key.
export default async function WidgetPage({
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

  const h = await headers();
  const lang = pickLang(h.get("accept-language"));

  // Domain allow-list: block the widget from loading on unauthorized sites.
  const allowed = bot.allowed_domains ?? [];
  if (allowed.length > 0) {
    const referer = h.get("referer");
    const appHost = normalizeHost(h.get("x-forwarded-host") ?? h.get("host") ?? "");
    let refHost: string | null = null;
    try {
      if (referer) refHost = normalizeHost(new URL(referer).host);
    } catch {
      /* ignore malformed referer */
    }
    // Allow our own domain (preview / direct open); block a mismatching host.
    if (refHost && refHost !== appHost && !hostAllowed(refHost, allowed)) {
      return <NotAuthorized allowed={allowed} lang={lang} />;
    }
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("plan")
    .eq("id", bot.user_id)
    .single();
  const plan = getPlan(profile?.plan);

  // Free plan always shows branding; paid plans remove it.
  const showBranding = !plan.features.removeBranding;

  return (
    <WidgetChat
      publicKey={bot.public_key}
      name={bot.name}
      welcome={
        bot.welcome_message?.trim()
          ? bot.welcome_message
          : botDefaults(lang).welcome
      }
      accent={bot.widget_color}
      showBranding={showBranding}
      handoffUrl={handoffHref(bot.handoff_type, bot.handoff_value)}
      lang={lang}
    />
  );
}

// Turn the owner's chosen support channel into a clickable link.
function handoffHref(
  type: string | null | undefined,
  value: string | null | undefined,
): string | null {
  const v = (value ?? "").trim();
  if (!v) return null;
  const isUrl = /^https?:\/\//i.test(v);
  switch (type) {
    case "email":
      return `mailto:${v}`;
    case "phone":
      return `tel:${v}`;
    case "whatsapp":
      return isUrl ? v : `https://wa.me/${v.replace(/\D/g, "")}`;
    case "telegram":
      return isUrl ? v : `https://t.me/${v.replace(/^@/, "")}`;
    case "link":
      return isUrl ? v : `https://${v}`;
    default:
      return isUrl ? v : `mailto:${v}`;
  }
}

function NotAuthorized({
  allowed,
  lang,
}: {
  allowed: string[];
  lang: ReturnType<typeof pickLang>;
}) {
  const t = WIDGET_STRINGS[lang] ?? WIDGET_STRINGS.en;
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <p className="text-sm font-medium text-slate-700">{t.notAllowed}</p>
      <p className="mt-2 max-w-xs text-xs text-slate-400">{allowed.join(", ")}</p>
    </div>
  );
}
