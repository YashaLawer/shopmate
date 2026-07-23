import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlan } from "@/lib/plans";
import { hostAllowed, normalizeHost } from "@/lib/security";
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

  // Domain allow-list: block the widget from loading on unauthorized sites.
  const allowed = bot.allowed_domains ?? [];
  if (allowed.length > 0) {
    const h = await headers();
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
      return <NotAuthorized allowed={allowed} />;
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
      welcome={bot.welcome_message}
      accent={bot.widget_color}
      showBranding={showBranding}
    />
  );
}

function NotAuthorized({ allowed }: { allowed: string[] }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <p className="text-sm font-medium text-slate-700">
        This assistant isn&apos;t enabled for this domain.
      </p>
      <p className="mt-2 max-w-xs text-xs text-slate-400">
        The store owner restricted it to: {allowed.join(", ")}.
      </p>
    </div>
  );
}
