"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, UserRound } from "lucide-react";
import { WIDGET_STRINGS, type Lang } from "@/lib/i18n/widget";
import type { ChatMessage } from "@/lib/types";

export function WidgetChat({
  publicKey,
  name,
  welcome,
  accent,
  showBranding,
  handoffUrl,
  lang,
}: {
  publicKey: string;
  name: string;
  welcome: string;
  accent: string;
  showBranding: boolean;
  handoffUrl?: string | null;
  lang: Lang;
}) {
  const t = WIDGET_STRINGS[lang] ?? WIDGET_STRINGS.en;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const convoId = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;

    const history: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/widget/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: publicKey,
          messages: history,
          conversationId: convoId.current,
        }),
      });
      if (!res.ok || !res.body) throw new Error(`Request failed (${res.status})`);

      const cid = res.headers.get("X-Conversation-Id");
      if (cid) convoId.current = cid;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: t.error,
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 text-white"
        style={{ backgroundColor: accent }}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-sm font-bold">
          {name.charAt(0).toUpperCase()}
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-white/80">{t.replyInstantly}</p>
        </div>
        {handoffUrl && (
          <a
            href={handoffUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-auto flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-white/30"
          >
            <UserRound size={13} />
            {t.contactSupport}
          </a>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto bg-slate-50 px-4 py-4"
      >
        <Bubble role="assistant" accent={accent}>
          {welcome}
        </Bubble>
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} accent={accent}>
            {m.role === "assistant" ? (
              m.content === "" ? (
                <TypingDots />
              ) : (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              )
            ) : (
              m.content
            )}
          </Bubble>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-slate-100 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={t.placeholder}
          className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400"
        />
        <button
          onClick={send}
          disabled={streaming || !input.trim()}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition disabled:opacity-40"
          style={{ backgroundColor: accent }}
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </div>

      {showBranding && (
        <a
          href="https://shopmate.app"
          target="_blank"
          rel="noreferrer"
          className="block bg-white pb-2 text-center text-[11px] text-slate-400 hover:text-slate-600"
        >
          Powered by Shopmate
        </a>
      )}
    </div>
  );
}

function Bubble({
  role,
  accent,
  children,
}: {
  role: "user" | "assistant";
  accent: string;
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          "max-w-[85%] rounded-2xl px-4 py-2 text-sm " +
          (isUser ? "text-white" : "bg-white text-slate-800 shadow-sm")
        }
        style={isUser ? { backgroundColor: accent } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
    </span>
  );
}
