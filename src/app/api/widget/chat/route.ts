import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { retrieveContext, buildMessages, streamChat } from "@/lib/rag";
import { getPlan } from "@/lib/plans";
import { activeTopup, currentPeriod } from "@/lib/limits";
import { hashIp, getClientIp } from "@/lib/security";
import { sendUsageWarningEmail } from "@/lib/email";
import { corsHeaders, startOfMonthISO } from "@/lib/cors";

const RATE_LIMIT_PER_MINUTE = 15;
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

  // Per-IP rate limit: cap burst abuse before doing any expensive work.
  const ipHash = hashIp(getClientIp(req.headers));
  const { count: recentHits } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("chatbot_id", bot.id)
    .eq("ip", ipHash)
    .gte("created_at", new Date(Date.now() - 60_000).toISOString());
  if ((recentHits ?? 0) >= RATE_LIMIT_PER_MINUTE) {
    return new Response(
      "You're sending messages too quickly. Please wait a moment and try again.",
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain; charset=utf-8",
          "X-Rate-Limited": "1",
        },
      },
    );
  }

  // Monthly message gating (based on the owner's plan).
  const { data: profile } = await admin
    .from("profiles")
    .select("plan, topup_messages, topup_period, email, warned_period, locale")
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

  // Warn the owner by email once they cross 80% of their monthly allowance.
  // Gated by warned_period so it fires at most once per calendar month.
  const projectedUsage = (count ?? 0) + 1;
  const period = currentPeriod();
  if (
    effectiveLimit > 0 &&
    projectedUsage >= Math.ceil(effectiveLimit * 0.8) &&
    profile?.email &&
    profile?.warned_period !== period
  ) {
    // Claim the slot first, so concurrent requests don't double-send.
    await admin
      .from("profiles")
      .update({ warned_period: period })
      .eq("id", bot.user_id);
    await sendUsageWarningEmail(
      profile.email,
      req.nextUrl.origin,
      projectedUsage,
      effectiveLimit,
      profile.locale ?? undefined,
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
      ip: ipHash,
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
