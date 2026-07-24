"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBaseUrl } from "@/lib/baseUrl";
import { getLocale } from "@/lib/i18n/getLocale";
import { sendWelcomeEmail } from "@/lib/email";

export type AuthState = { error?: string };

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Email and password are required." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect("/dashboard");
}

export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 6)
    return { error: "Password must be at least 6 characters." };

  const supabase = await createClient();
  const base = await getBaseUrl();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${base}/auth/callback` },
  });
  if (error) return { error: error.message };

  const locale = await getLocale();
  // Remember the owner's language so their notification emails are localized.
  if (data.user) {
    const admin = createAdminClient();
    await admin.from("profiles").update({ locale }).eq("id", data.user.id);
  }
  // Welcome email (best-effort — never blocks signup if Resend is down).
  await sendWelcomeEmail(email, base, locale);

  // If email confirmation is enabled in Supabase, there is no session yet.
  if (!data.session) redirect("/login?checkEmail=1");

  redirect("/dashboard");
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { error: "Email is required." };

  const supabase = await createClient();
  const base = await getBaseUrl();
  // Recovery link lands on /auth/callback (verifies the OTP) → settings, where
  // the user sets a new password. Errors are swallowed so we never reveal
  // whether an email is registered.
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${base}/auth/callback?next=/dashboard/settings`,
  });
  redirect("/forgot-password?sent=1");
}

export async function signout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
