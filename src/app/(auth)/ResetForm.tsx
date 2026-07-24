"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";
import type { AppDict } from "@/lib/i18n/app";
import type { AuthState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function ResetForm({
  a,
  action,
  sent,
}: {
  a: AppDict["auth"];
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  sent: boolean;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">{a.resetTitle}</h1>
      <p className="mt-1 text-sm text-slate-500">{a.resetSubtitle}</p>

      {sent && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {a.resetSent}
        </p>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {a.email}
          </label>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={a.emailPh}
            className={inputClass}
          />
        </div>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {state.error}
          </p>
        )}

        <SubmitButton className="w-full" pendingText={a.pleaseWait}>
          {a.resetBtn}
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/login" className="font-semibold text-brand">
          {a.signIn}
        </Link>
      </p>
    </div>
  );
}
