"use client";

import { useActionState, useState } from "react";
import { Copy, Check, ExternalLink, Search, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { verifyInstallation, type VerifyState } from "./actions";

type Platform = {
  id: string;
  name: string;
  steps: string[];
  link?: { url: string; label: string };
};

const PLATFORMS: Platform[] = [
  {
    id: "html",
    name: "Website / custom HTML",
    steps: [
      "Open your site's HTML (the page template).",
      "Paste the snippet just before the closing </body> tag.",
      "Save and publish.",
    ],
  },
  {
    id: "shopify",
    name: "Shopify",
    steps: [
      "Online Store → Themes → ⋯ → Edit code.",
      "Open Layout → theme.liquid.",
      "Paste the snippet right before </body>, then Save.",
    ],
    link: { url: "https://admin.shopify.com/", label: "Open Shopify admin" },
  },
  {
    id: "wordpress",
    name: "WordPress",
    steps: [
      "Install the free “WPCode” or “Insert Headers and Footers” plugin.",
      "Open its settings and find the Footer / Body section.",
      "Paste the snippet and save.",
    ],
    link: {
      url: "https://wordpress.org/plugins/insert-headers-and-footers/",
      label: "Get the plugin",
    },
  },
  {
    id: "wix",
    name: "Wix",
    steps: [
      "Settings → Custom Code → + Add Custom Code.",
      "Paste the snippet.",
      "Set “Place code in” to Body – end, apply to All pages, then Apply.",
    ],
    link: { url: "https://manage.wix.com/", label: "Open Wix dashboard" },
  },
  {
    id: "squarespace",
    name: "Squarespace",
    steps: [
      "Settings → Advanced → Code Injection.",
      "Paste the snippet into the Footer box.",
      "Save.",
    ],
    link: { url: "https://account.squarespace.com/", label: "Open Squarespace" },
  },
  {
    id: "webflow",
    name: "Webflow",
    steps: [
      "Project Settings → Custom Code.",
      "Paste the snippet into Footer Code.",
      "Save, then Publish your site.",
    ],
    link: { url: "https://webflow.com/dashboard", label: "Open Webflow" },
  },
  {
    id: "tilda",
    name: "Tilda",
    steps: [
      "Add a T123 (HTML) block, or Site Settings → More → Insert code before </body>.",
      "Paste the snippet.",
      "Publish the page.",
    ],
    link: { url: "https://tilda.cc/projects/", label: "Open Tilda projects" },
  },
  {
    id: "gtm",
    name: "Google Tag Manager",
    steps: [
      "New Tag → Tag Configuration → Custom HTML.",
      "Paste the snippet.",
      "Set trigger to All Pages, then Save and Submit.",
    ],
    link: { url: "https://tagmanager.google.com/", label: "Open Tag Manager" },
  },
];

export function InstallWidget({
  chatbotId,
  appUrl,
  publicKey,
  color,
}: {
  chatbotId: string;
  appUrl: string;
  publicKey: string;
  color: string;
}) {
  const snippet = `<script src="${appUrl}/widget.js" data-key="${publicKey}" data-color="${color}" async></script>`;
  const [platformId, setPlatformId] = useState("html");
  const [copied, setCopied] = useState(false);
  const [verify, verifyAction] = useActionState<VerifyState, FormData>(
    verifyInstallation,
    {},
  );

  const platform = PLATFORMS.find((p) => p.id === platformId) ?? PLATFORMS[0];

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
          href={`${appUrl}/preview/${publicKey}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
        >
          Preview on a site <ExternalLink size={12} />
        </a>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        One line of code adds the chat bubble to your store. Pick your platform for
        exact steps.
      </p>

      {/* Platform picker */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="text-sm font-medium text-slate-600">Platform</label>
        <select
          value={platformId}
          onChange={(e) => setPlatformId(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          {PLATFORMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Steps */}
      <ol className="mt-4 space-y-2">
        {platform.steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm text-slate-600">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-50 text-xs font-semibold text-brand">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>

      {platform.link && (
        <a
          href={platform.link.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          {platform.link.label} <ExternalLink size={12} />
        </a>
      )}

      {/* Snippet */}
      <div className="mt-4 flex items-start gap-2">
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

      {/* Installation checker */}
      <div className="mt-5 border-t border-slate-100 pt-5">
        <h3 className="text-sm font-medium text-slate-700">Check your installation</h3>
        <p className="mt-1 text-xs text-slate-400">
          Added the snippet? Enter your site URL and we&apos;ll confirm the widget
          is live.
        </p>
        <form action={verifyAction} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input type="hidden" name="chatbot_id" value={chatbotId} />
          <input
            name="url"
            placeholder="yourstore.com"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <VerifyButton />
        </form>
        {verify.message && (
          <p
            className={
              "mt-3 rounded-lg px-3 py-2 text-sm " +
              (verify.ok
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700")
            }
          >
            {verify.message}
          </p>
        )}
      </div>
    </div>
  );
}

function VerifyButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 size={15} className="animate-spin" /> Checking…
        </>
      ) : (
        <>
          <Search size={15} /> Check
        </>
      )}
    </button>
  );
}
