"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

export function EmbedSnippet({
  appUrl,
  publicKey,
  color,
}: {
  appUrl: string;
  publicKey: string;
  color: string;
}) {
  const snippet = `<script src="${appUrl}/widget.js" data-key="${publicKey}" data-color="${color}" async></script>`;
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Install on your site</h2>
        <a
          href={`${appUrl}/widget/${publicKey}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
        >
          Preview widget <ExternalLink size={12} />
        </a>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Paste this snippet just before the closing{" "}
        <code className="rounded bg-slate-100 px-1">&lt;/body&gt;</code> tag on
        your store. The chat bubble appears in the bottom-right corner.
      </p>

      <div className="mt-3 flex items-start gap-2">
        <code className="flex-1 overflow-x-auto whitespace-pre rounded-lg bg-slate-900 px-3 py-3 text-xs text-slate-100">
          {snippet}
        </code>
        <button
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-500" /> Copied
            </>
          ) : (
            <>
              <Copy size={14} /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
