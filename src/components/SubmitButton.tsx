"use client";

import { useFormStatus } from "react-dom";

// Submit button that shows a pending state while its parent <form> action runs.
export function SubmitButton({
  children,
  pendingText,
  className = "",
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        "inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 " +
        className
      }
    >
      {pending ? (pendingText ?? "Working…") : children}
    </button>
  );
}
