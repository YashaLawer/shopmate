import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { retrieveContext, buildMessages, streamChat } from "@/lib/rag";
import { getPlan } from "@/lib/plans";
import { activeTopup, currentPeriod } from "@/lib/limits";
import { hashIp, getClientIp, normalizeHost, hostAllowed } from "@/lib/security";
import { sendUsageWarningEmail } from "@/lib/email";
import { corsHeaders, startOfMonthISO } from "@/lib/cors";

const RATE_LIMIT_PER_MINUTE = 15;
// Per-visitor daily cap: stops one person from slowly draining the owner's
// monthly quota over hours. Generous for a real customer, low for a spammer.
const RATE_LIMIT_PER_DAY = 40;
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

  // Never trust client-supplied roles/history: keep only user/assistant turns,
  // cap length and count. Stops a caller injecting a fake "system" prompt or an
  // oversized payload into the model.
  const safeMessages: ChatMessage[] = (
    messages as { role?: unknown; content?: unknown }[]
  )
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    )
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: (m.content as string).slice(0, 4000),
    }))
    .slice(-10);

  const { data: botData } = await admin
    .from("chatbots")
    .select("*")
    .eq("public_key", key)
    .single();
  if (!botData) {
    return new Response("Unknown chatbot", { status: 404, headers: corsHeaders });
  }
  const bot = botData as Chatbot;

  // Domain allow-list: if the owner restricted the widget to specific domains,
  // enforce it on the money-spending endpoint too (not just the iframe render),
  // so a stolen public_key can't be embedded on another site to drain quota.
  const allowed = bot.allowed_domains ?? [];
  if (allowed.length > 0) {
    const originHeader = req.headers.get("origin") ?? req.headers.get("referer");
    const appHost = normalizeHost(
      req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "",
    );
    let reqHost: string | null = null;
    try {
      if (originHeader) reqHost = normalizeHost(new URL(originHeader).host);
    } catch {
      /* malformed origin */
    }
    if (reqHost && reqHost !== appHost && !hostAllowed(reqHost, allowed)) {
      return new Response("This assistant isn't enabled for this domain.", {
        status: 403,
        headers: corsHeaders,
      });
    }
  }

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

  // Per-IP daily cap: one visitor can't monopolize the bot or slowly eat the
  // owner's monthly allowance. Uses the (chatbot_id, ip, created_at) index.
  const { count: dayHits } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("chatbot_id", bot.id)
    .eq("ip", ipHash)
    .gte("created_at", new Date(Date.now() - 86_400_000).toISOString());
  if ((dayHits ?? 0) >= RATE_LIMIT_PER_DAY) {
    return new Response(
      "You've reached today's message limit for this assistant. Please try again tomorrow or contact the store directly.",
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

  // Monthly message gating (based on the owner's plan). Only core columns here
  // so the chat never breaks — email-notification columns are fetched separately
  // and are optional (see below).
  const { data: profile } = await admin
    .from("profiles")
    .select("plan, topup_messages, topup_period, email")
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
  // Best-effort: warned_period/locale are optional columns (added by the email
  // migration). If they aren't present yet, we simply skip the warning — the
  // chat itself must never be affected.
  const projectedUsage = (count ?? 0) + 1;
  const period = currentPeriod();
  if (
    profile?.email &&
    effectiveLimit > 0 &&
    projectedUsage >= Math.ceil(effectiveLimit * 0.8)
  ) {
    const { data: prefs, error: prefsErr } = await admin
      .from("profiles")
      .select("warned_period, locale")
      .eq("id", bot.user_id)
      .single();
    if (!prefsErr && prefs && prefs.warned_period !== period) {
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
        prefs.locale ?? undefined,
      );
    }
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

  const lastUser = [...safeMessages].reverse().find((m) => m.role === "user");

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
  const chatMessages = buildMessages(bot, context, safeMessages);
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
