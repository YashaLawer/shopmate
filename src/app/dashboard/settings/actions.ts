"use server";

import { createClient } from "@/lib/supabase/server";

export type PwState = { ok?: boolean; error?: string };

export async function updatePassword(
  _prev: PwState,
  formData: FormData,
): Promise<PwState> {
  const password = String(formData.get("password") || "");
  if (password.length < 6) return { error: "short" };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  return { ok: true };
}
