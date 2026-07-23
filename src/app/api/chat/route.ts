import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { retrieveContext, buildMessages, streamChat } from "@/lib/rag";
import type { Chatbot, ChatMessage } from "@/lib/types";

export const runtime = "nodejs";

// In-app "test chat" for the owner. Auth required. Does NOT persist messages or
// count against the monthly quota — owners test their bot freely. The public
// widget endpoint (separate) is the one that persists + gates.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  let body: { chatbotId?: string; messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const { chatbotId, messages } = body;
  if (!chatbotId || !Array.isArray(messages)) {
    return new Response("Bad request", { status: 400 });
  }

  const { data: bot } = await supabase
    .from("chatbots")
    .select("*")
    .eq("id", chatbotId)
    .eq("user_id", user.id)
    .single();
  if (!bot) return new Response("Not found", { status: 404 });

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const context = await retrieveContext(chatbotId, lastUser?.content ?? "");
  const chatMessages = buildMessages(bot as Chatbot, context, messages);

  const completion = await streamChat(chatMessages);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) controller.enqueue(encoder.encode(delta));
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n[Something went wrong.]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
