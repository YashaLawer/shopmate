"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { getPlan } from "@/lib/plans";
import { countChatbots } from "@/lib/usage";

export async function createChatbot(formData: FormData) {
  const { userId, profile } = await requireUser();
  const name =
    String(formData.get("name") || "").trim() || "My store assistant";

  const plan = getPlan(profile.plan);
  const count = await countChatbots(userId);
  if (count >= plan.limits.chatbots) {
    redirect("/dashboard?limit=chatbots");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chatbots")
    .insert({ user_id: userId, name })
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
  const name = String(formData.get("name") || "").trim() || "My store assistant";
  const welcome_message =
    String(formData.get("welcome_message") || "").trim() ||
    "Hi! How can I help you with your order today?";
  const widget_color = String(formData.get("widget_color") || "#4f46e5");
  const system_prompt =
    String(formData.get("system_prompt") || "").trim() || null;

  const supabase = await createClient();
  await supabase
    .from("chatbots")
    .update({ name, welcome_message, widget_color, system_prompt })
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
