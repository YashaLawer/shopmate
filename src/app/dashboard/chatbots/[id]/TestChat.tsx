"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles } from "lucide-react";
import type { AppDict } from "@/lib/i18n/app";
import type { ChatMessage } from "@/lib/types";

export function TestChat({
  chatbotId,
  welcomeMessage,
  accent,
  hasKnowledge,
  strings,
}: {
  chatbotId: string;
  welcomeMessage: string;
  accent: string;
  hasKnowledge: boolean;
  strings: AppDict["chat"];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbotId, messages: history }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Request failed (${res.status})`);
      }

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
          content: strings.error,
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
        <Sparkles size={16} style={{ color: accent }} />
        <h2 className="text-sm font-semibold text-slate-700">{strings.title}</h2>
        {!hasKnowledge && (
          <span className="ml-auto text-xs text-amber-600">
            {strings.addKnowledgeHint}
          </span>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex h-80 flex-col gap-3 overflow-y-auto px-5 py-4"
      >
        {/* Welcome bubble */}
        <Bubble role="assistant" accent={accent}>
          {welcomeMessage}
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
          placeholder={strings.placeholder}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <button
          onClick={send}
          disabled={streaming || !input.trim()}
          className="grid h-9 w-9 place-items-center rounded-lg text-white transition disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: accent }}
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </div>
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
          "max-w-[80%] rounded-2xl px-4 py-2 text-sm " +
          (isUser ? "text-white" : "bg-slate-100 text-slate-800")
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
