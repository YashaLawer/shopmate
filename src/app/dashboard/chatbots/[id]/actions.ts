"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plans";
import { countPages } from "@/lib/usage";
import { ingestDocument, fetchUrlText } from "@/lib/ingest";
import { parseDomains } from "@/lib/security";

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

export type VerifyState = { ok?: boolean; message?: string };

// Fetches the owner's site and checks whether the widget snippet (their bot's
// public key) is present in the page source.
export async function verifyInstallation(
  _prev: VerifyState,
  formData: FormData,
): Promise<VerifyState> {
  const { userId } = await requireUser();
  const chatbotId = String(formData.get("chatbot_id"));
  let url = String(formData.get("url") || "").trim();

  const supabase = await createClient();
  const { data: bot } = await supabase
    .from("chatbots")
    .select("public_key")
    .eq("id", chatbotId)
    .eq("user_id", userId)
    .single();
  if (!bot) return { ok: false, message: "Chatbot not found." };

  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return { ok: false, message: "Enter a valid website URL." };
    }
  } catch {
    return { ok: false, message: "Enter a valid website URL." };
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ShopmateInstallCheck/1.0)" },
      redirect: "follow",
    });
    if (!res.ok) {
      return { ok: false, message: `Couldn't open the page (HTTP ${res.status}).` };
    }
    const html = await res.text();

    if (html.includes(bot.public_key)) {
      return { ok: true, message: "Found your assistant on this page — you're live! 🎉" };
    }
    if (html.includes("widget.js")) {
      return {
        ok: false,
        message:
          "Found a Shopmate snippet, but not this bot's key. Double-check you copied the snippet above.",
      };
    }
    return {
      ok: false,
      message:
        "We couldn't find the widget on that page yet. Make sure you pasted the snippet and published your site. (If you added it via a tag manager, it may not appear in the page source.)",
    };
  } catch {
    return {
      ok: false,
      message: "Couldn't reach that URL. Check the address and that the site is public.",
    };
  }
}

// Rotate the widget's public key. The old embed snippet stops working.
export async function regenerateKey(formData: FormData) {
  const { userId } = await requireUser();
  const chatbotId = String(formData.get("chatbot_id"));
  const newKey = crypto.randomBytes(16).toString("hex");

  const supabase = await createClient();
  await supabase
    .from("chatbots")
    .update({ public_key: newKey })
    .eq("id", chatbotId)
    .eq("user_id", userId);

  revalidatePath(`/dashboard/chatbots/${chatbotId}`);
}

// Restrict the widget to specific domains (empty = any domain).
export async function updateDomains(formData: FormData) {
  const { userId } = await requireUser();
  const chatbotId = String(formData.get("chatbot_id"));
  const domains = parseDomains(String(formData.get("domains") || ""));

  const supabase = await createClient();
  await supabase
    .from("chatbots")
    .update({ allowed_domains: domains })
    .eq("id", chatbotId)
    .eq("user_id", userId);

  revalidatePath(`/dashboard/chatbots/${chatbotId}?saved_domains=1`);
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
