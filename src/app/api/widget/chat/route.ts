import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { retrieveContext, buildMessages, streamChat } from "@/lib/rag";
import { getPlan } from "@/lib/plans";
import { activeTopup } from "@/lib/limits";
import { corsHeaders, startOfMonthISO } from "@/lib/cors";
import type { Chatbot, ChatMessage } from "@/lib/types";

export const runtime = "nodejs";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// Public, unauthenticated chat endpoint used by the embeddable widget.
// Identified by the chatbot's public_key. Persists conversation + messages and
// enforces the owner's monthly message limit.
export async function POST(req: NextRequest) {
  const admin = createAdminClient();

  let body: { key?: string; messages?: ChatMessage[]; conversationId?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400, headers: corsHeaders });
  }

  const { key, messages, conversationId } = body;
  if (!key || !Array.isArray(messages)) {
    return new Response("Bad request", { status: 400, headers: corsHeaders });
  }

  const { data: botData } = await admin
    .from("chatbots")
    .select("*")
    .eq("public_key", key)
    .single();
  if (!botData) {
    return new Response("Unknown chatbot", { status: 404, headers: corsHeaders });
  }
  const bot = botData as Chatbot;

  // Monthly message gating (based on the owner's plan).
  const { data: profile } = await admin
    .from("profiles")
    .select("plan, topup_messages, topup_period")
    .eq("id", bot.user_id)
    .single();
  const plan = getPlan(profile?.plan);
  const effectiveLimit =
    plan.limits.messagesPerMonth + activeTopup(profile ?? {});

  const { count } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", bot.user_id)
    .eq("role", "user")
    .gte("created_at", startOfMonthISO());

  if ((count ?? 0) >= effectiveLimit) {
    return new Response(
      "Sorry, this assistant is temporarily unavailable. Please contact the store directly.",
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain; charset=utf-8",
          "X-Limit-Reached": "1",
        },
      },
    );
  }

  // Resolve / create the conversation.
  let convoId: string | null =
    typeof conversationId === "string" ? conversationId : null;
  if (convoId) {
    const { data: c } = await admin
      .from("conversations")
      .select("id")
      .eq("id", convoId)
      .eq("chatbot_id", bot.id)
      .single();
    if (!c) convoId = null;
  }
  if (!convoId) {
    const { data: c } = await admin
      .from("conversations")
      .insert({ chatbot_id: bot.id, source: "widget" })
      .select("id")
      .single();
    convoId = c?.id ?? null;
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");

  // Persist the incoming customer message (this is what counts toward usage).
  if (convoId && lastUser) {
    await admin.from("messages").insert({
      conversation_id: convoId,
      chatbot_id: bot.id,
      owner_id: bot.user_id,
      role: "user",
      content: lastUser.content.slice(0, 4000),
    });
  }

  const context = await retrieveContext(bot.id, lastUser?.content ?? "");
  const chatMessages = buildMessages(bot, context, messages);
  const completion = await streamChat(chatMessages);

  const encoder = new TextEncoder();
  let acc = "";
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) {
            acc += delta;
            controller.enqueue(encoder.encode(delta));
          }
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n[Something went wrong.]"));
      } finally {
        controller.close();
        if (convoId && acc) {
          await admin.from("messages").insert({
            conversation_id: convoId,
            chatbot_id: bot.id,
            owner_id: bot.user_id,
            role: "assistant",
            content: acc,
          });
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Conversation-Id": convoId ?? "",
    },
  });
}
