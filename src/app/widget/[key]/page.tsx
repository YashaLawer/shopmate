import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlan } from "@/lib/plans";
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
