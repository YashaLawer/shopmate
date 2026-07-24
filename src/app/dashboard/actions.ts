"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { getPlan } from "@/lib/plans";
import { countChatbots } from "@/lib/usage";
import { getLocale } from "@/lib/i18n/getLocale";
import { botDefaults } from "@/lib/botDefaults";

export async function createChatbot(formData: FormData) {
  const { userId, profile } = await requireUser();
  const defaults = botDefaults(await getLocale());
  const name = String(formData.get("name") || "").trim() || defaults.name;

  const plan = getPlan(profile.plan);
  const count = await countChatbots(userId);
  if (count >= plan.limits.chatbots) {
    redirect("/dashboard?limit=chatbots");
  }

  const supabase = await createClient();
  // Leave welcome_message empty = "use the localized default", so the greeting
  // follows the dashboard/visitor language until the owner writes their own.
  const { data, error } = await supabase
    .from("chatbots")
    .insert({ user_id: userId, name, welcome_message: "" })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/dashboard?error=" + encodeURIComponent(error?.message ?? "Failed to create"));
  }

  redirect(`/dashboard/chatbots/${data.id}`);
}

export async function updateChatbot(formData: FormData) {
  const { userId } = await requireUser();
  const id = String(formData.get("id"));
  const defaults = botDefaults(await getLocale());
  const name = String(formData.get("name") || "").trim() || defaults.name;
  // Empty = "use the localized default" (greeting follows the language).
  // A non-empty value is the owner's custom greeting and is kept as-is.
  const welcome_message = String(formData.get("welcome_message") || "").trim();
  const widget_color = String(formData.get("widget_color") || "#4f46e5");
  const system_prompt =
    String(formData.get("system_prompt") || "").trim() || null;
  const handoffValue = String(formData.get("handoff_value") || "").trim();
  const handoffType = String(formData.get("handoff_type") || "email");

  const supabase = await createClient();
  await supabase
    .from("chatbots")
    .update({ name, welcome_message, widget_color, system_prompt })
    .eq("id", id)
    .eq("user_id", userId);

  // Handoff columns are optional (added by a migration). Save them separately so
  // core settings still persist even if that migration hasn't been run yet.
  await supabase
    .from("chatbots")
    .update({
      handoff_type: handoffValue ? handoffType : null,
      handoff_value: handoffValue || null,
    })
    .eq("id", id)
    .eq("user_id", userId);

  revalidatePath(`/dashboard/chatbots/${id}`);
  redirect(`/dashboard/chatbots/${id}?saved=1`);
}

export async function deleteChatbot(formData: FormData) {
  const { userId } = await requireUser();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  await supabase.from("chatbots").delete().eq("id", id).eq("user_id", userId);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
