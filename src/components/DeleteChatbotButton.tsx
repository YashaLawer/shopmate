"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

// Trash button that asks for confirmation before running the delete action.
export function DeleteChatbotButton({
  botId,
  botName,
  deleteChatbot,
  labels,
}: {
  botId: string;
  botName: string;
  deleteChatbot: (formData: FormData) => Promise<void>;
  labels: {
    deleteChatbot: string;
    delTitle: string;
    delBody: string; // contains "{name}"
    delYes: string;
    delNo: string;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg p-1.5 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
        title={labels.deleteChatbot}
        aria-label={labels.deleteChatbot}
      >
        <Trash2 size={16} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900">{labels.delTitle}</h3>
            <p className="mt-3 text-sm text-slate-600">
              {labels.delBody.replace("{name}", botName)}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {labels.delNo}
              </button>
              <form action={deleteChatbot}>
                <input type="hidden" name="id" value={botId} />
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  {labels.delYes}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
