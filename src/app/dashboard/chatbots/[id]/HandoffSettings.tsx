"use client";

import { useState } from "react";
import type { AppDict } from "@/lib/i18n/app";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

// Explicit on/off control for the widget's "Contact support" button.
// When off, no handoff inputs are submitted, so updateChatbot clears the channel
// and the widget hides the button.
export function HandoffSettings({
  initialType,
  initialValue,
  strings,
}: {
  initialType?: string | null;
  initialValue?: string | null;
  strings: AppDict["bot"];
}) {
  const s = strings;
  const [enabled, setEnabled] = useState(Boolean(initialValue));

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{s.handoffTitle}</label>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled((v) => !v)}
          className={
            "relative h-6 w-11 shrink-0 rounded-full transition " +
            (enabled ? "bg-brand" : "bg-slate-300")
          }
        >
          <span
            className={
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all " +
              (enabled ? "left-[1.375rem]" : "left-0.5")
            }
          />
        </button>
      </div>
      <p className="mt-1 text-xs text-slate-400">{s.handoffHint}</p>

      {enabled && (
        <div className="mt-3 flex gap-2">
          <select
            name="handoff_type"
            defaultValue={initialType ?? "email"}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="phone">{s.handoffPhone}</option>
            <option value="link">{s.handoffLink}</option>
          </select>
          <input
            name="handoff_value"
            defaultValue={initialValue ?? ""}
            placeholder={s.handoffValuePh}
            className={inputClass + " flex-1"}
          />
        </div>
      )}

      <p className="mt-2 text-xs text-slate-400">🚧 {s.handoffRoadmap}</p>
    </div>
  );
}
