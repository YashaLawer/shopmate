"use client";

import { useActionState, useState } from "react";
import { FileText, Globe, Type, Trash2, Loader2, X } from "lucide-react";
import { SubmitButton } from "@/components/SubmitButton";
import { tpl, type AppDict } from "@/lib/i18n/app";
import {
  addKnowledge,
  deleteDocument,
  getDocumentText,
  type KnowledgeState,
} from "./actions";
import type { KnowledgeDocument } from "@/lib/types";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

type Mode = "text" | "url" | "file";

const TAB_ICONS: Record<Mode, React.ElementType> = {
  text: Type,
  url: Globe,
  file: FileText,
};

const sourceIcon: Record<string, React.ElementType> = {
  text: Type,
  url: Globe,
  file: FileText,
};

export function KnowledgeManager({
  chatbotId,
  documents,
  pagesUsed,
  pagesLimit,
  strings,
}: {
  chatbotId: string;
  documents: KnowledgeDocument[];
  pagesUsed: number;
  pagesLimit: number;
  strings: AppDict["kb"];
}) {
  const s = strings;
  const tabLabel: Record<Mode, string> = { text: s.tabText, url: s.tabUrl, file: s.tabFile };
  const statusLabel = (st: string) =>
    st === "error" ? s.statusFailed : st === "processing" ? s.statusProcessing : s.statusReady;
  const [mode, setMode] = useState<Mode>("text");
  const [fileError, setFileError] = useState("");
  const [state, formAction] = useActionState<KnowledgeState, FormData>(
    addKnowledge,
    {},
  );
  const atLimit = pagesUsed >= pagesLimit;

  const [viewing, setViewing] = useState<{ title: string; content: string } | null>(
    null,
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function openDoc(id: string) {
    setLoadingId(id);
    const res = await getDocumentText(id);
    setLoadingId(null);
    if (!res.error) {
      setViewing({ title: res.title ?? "", content: res.content ?? "" });
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">{s.title}</h2>
        <span className="text-xs text-slate-400">
          {tpl(s.sourcesTpl, { used: pagesUsed, total: pagesLimit })}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">{s.subtitle}</p>

      {/* Add form */}
      {atLimit ? (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          {s.limitReached}
        </p>
      ) : (
        <>
          <div className="mt-4 flex gap-1 rounded-lg bg-slate-100 p-1">
            {(["text", "url", "file"] as Mode[]).map((id) => {
              const Icon = TAB_ICONS[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className={
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition " +
                    (mode === id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700")
                  }
                >
                  <Icon size={15} />
                  {tabLabel[id]}
                </button>
              );
            })}
          </div>

          <form action={formAction} className="mt-4 space-y-3">
            <input type="hidden" name="chatbot_id" value={chatbotId} />
            <input type="hidden" name="mode" value={mode} />

            {mode === "text" && (
              <>
                <input name="title" placeholder={s.titlePh} className={inputClass} />
                <textarea
                  name="content"
                  rows={6}
                  placeholder={s.contentPh}
                  className={inputClass}
                />
              </>
            )}

            {mode === "url" && (
              <input
                name="url"
                type="url"
                placeholder={s.urlPh}
                className={inputClass}
              />
            )}

            {mode === "file" && (
              <div>
                <input
                  name="file"
                  type="file"
                  accept=".pdf,.docx,.txt,.md,.markdown,.png,.jpg,.jpeg,.webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f && f.size > 4 * 1024 * 1024) {
                      setFileError(s.fileTooBig);
                      e.target.value = "";
                    } else {
                      setFileError("");
                    }
                  }}
                  className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                />
                {fileError ? (
                  <p className="mt-1.5 text-xs text-red-600">{fileError}</p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-400">{s.fileHint}</p>
                )}
              </div>
            )}

            {state.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {state.error}
              </p>
            )}
            {state.ok && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {state.ok}
              </p>
            )}

            <div className="flex justify-end">
              <SubmitButton pendingText={s.processing}>{s.addBtn}</SubmitButton>
            </div>
          </form>
        </>
      )}

      {/* Documents list */}
      <div className="mt-6 space-y-2">
        {documents.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
            {s.empty}
          </p>
        ) : (
          documents.map((doc) => {
            const Icon = sourceIcon[doc.source_type] ?? FileText;
            const busy = doc.status === "processing" || loadingId === doc.id;
            return (
              <div
                key={doc.id}
                className="flex items-center gap-1 rounded-lg border border-slate-200 pr-2 transition hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => openDoc(doc.id)}
                  title={s.viewHint}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-l-lg px-3 py-2.5 text-left hover:bg-slate-50"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-500">
                    {busy ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Icon size={15} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {doc.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {tpl(s.charsTpl, { n: doc.char_count.toLocaleString() })} ·{" "}
                      {doc.status === "error" ? (
                        <span className="text-red-500">{s.statusFailed}</span>
                      ) : (
                        statusLabel(doc.status)
                      )}
                    </p>
                  </div>
                </button>
                <form action={deleteDocument}>
                  <input type="hidden" name="chatbot_id" value={chatbotId} />
                  <input type="hidden" name="document_id" value={doc.id} />
                  <button
                    className="rounded-lg p-1.5 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
                    title="Remove"
                    aria-label="Remove document"
                  >
                    <Trash2 size={15} />
                  </button>
                </form>
              </div>
            );
          })
        )}
      </div>

      {viewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setViewing(null)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <h3 className="min-w-0 truncate pr-3 text-sm font-semibold text-slate-800">
                {viewing.title}
              </h3>
              <button
                type="button"
                onClick={() => setViewing(null)}
                aria-label={s.viewClose}
                className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4">
              {viewing.content ? (
                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-slate-700">
                  {viewing.content}
                </pre>
              ) : (
                <p className="text-sm text-slate-400">{s.viewEmpty}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
