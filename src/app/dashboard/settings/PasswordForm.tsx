"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import type { AppDict } from "@/lib/i18n/app";
import { updatePassword, type PwState } from "./actions";

export function PasswordForm({ s }: { s: AppDict["settings"] }) {
  const [state, action] = useActionState<PwState, FormData>(updatePassword, {});

  return (
    <form action={action} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder={s.passwordPh}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        {state.error && (
          <p className="mt-1.5 text-sm text-red-600">
            {state.error === "short" ? s.passwordTooShort : state.error}
          </p>
        )}
        {state.ok && (
          <p className="mt-1.5 text-sm text-emerald-600">{s.passwordUpdated}</p>
        )}
      </div>
      <SubmitButton pendingText={s.updating}>{s.updatePassword}</SubmitButton>
    </form>
  );
}
