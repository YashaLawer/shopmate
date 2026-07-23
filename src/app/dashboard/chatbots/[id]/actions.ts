"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plans";
import { countPages } from "@/lib/usage";
import { ingestDocument, fetchUrlText } from "@/lib/ingest";

export type KnowledgeState = { error?: string; ok?: string };

export async function addKnowledge(
  _prev: KnowledgeState,
  formData: FormData,
): Promise<KnowledgeState> {
  const { userId, profile } = await requireUser();
  const chatbotId = String(formData.get("chatbot_id"));
  const mode = String(formData.get("mode") || "text");

  const supabase = await createClient();
  const { data: bot } = await supabase
    .from("chatbots")
    .select("id")
    .eq("id", chatbotId)
    .eq("user_id", userId)
    .single();
  if (!bot) return { error: "Chatbot not found." };

  const plan = getPlan(profile.plan);
  const pages = await countPages(chatbotId);
  if (pages >= plan.limits.pages) {
    return {
      error: `You've reached the ${plan.limits.pages}-page limit of your ${plan.name} plan. Upgrade to add more knowledge.`,
    };
  }

  try {
    if (mode === "url") {
      const url = String(formData.get("url") || "").trim();
      if (!/^https?:\/\//i.test(url)) {
        return { error: "Enter a valid URL starting with http:// or https://" };
      }
      const { title, text } = await fetchUrlText(url);
      if (text.length < 20) {
        return { error: "Couldn't extract readable text from that page." };
      }
      const { chunks } = await ingestDocument({
        chatbotId,
        ownerId: userId,
        title,
        content: text,
        sourceType: "url",
        sourceUrl: url,
      });
      revalidatePath(`/dashboard/chatbots/${chatbotId}`);
      return { ok: `Added “${title}” — ${chunks} chunk(s).` };
    }

    if (mode === "file") {
      const file = formData.get("file") as File | null;
      if (!file || file.size === 0) return { error: "Choose a .txt or .md file." };
      const content = await file.text();
      if (content.length < 20) return { error: "That file looks empty." };
      const { chunks } = await ingestDocument({
        chatbotId,
        ownerId: userId,
        title: file.name,
        content,
        sourceType: "file",
      });
      revalidatePath(`/dashboard/chatbots/${chatbotId}`);
      return { ok: `Added “${file.name}” — ${chunks} chunk(s).` };
    }

    // Default: pasted text
    const title = String(formData.get("title") || "").trim() || "Pasted text";
    const content = String(formData.get("content") || "").trim();
    if (content.length < 20) {
      return { error: "Add at least a couple of sentences of content." };
    }
    const { chunks } = await ingestDocument({
      chatbotId,
      ownerId: userId,
      title,
      content,
      sourceType: "text",
    });
    revalidatePath(`/dashboard/chatbots/${chatbotId}`);
    return { ok: `Added “${title}” — ${chunks} chunk(s).` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteDocument(formData: FormData) {
  const { userId } = await requireUser();
  const chatbotId = String(formData.get("chatbot_id"));
  const documentId = String(formData.get("document_id"));

  const supabase = await createClient();
  await supabase
    .from("documents")
    .delete()
    .eq("id", documentId)
    .eq("user_id", userId);

  revalidatePath(`/dashboard/chatbots/${chatbotId}`);
}
