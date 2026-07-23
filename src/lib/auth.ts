import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plans";
import type { Profile } from "@/lib/types";

// Returns the signed-in user + their profile, or redirects to /login.
// Wrapped in cache() so layout + page share one auth + profile lookup per request.
export const requireUser = cache(async function requireUser(): Promise<{
  userId: string;
  email: string | null;
  profile: Profile;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fall back to a minimal free profile if the row isn't there yet.
  const resolved: Profile =
    (profile as Profile) ??
    ({
      id: user.id,
      email: user.email ?? null,
      plan: "free",
      stripe_customer_id: null,
      stripe_subscription_id: null,
      subscription_status: null,
      created_at: new Date().toISOString(),
    } as Profile);

  // Normalize plan to a known id.
  resolved.plan = getPlan(resolved.plan).id;

  return { userId: user.id, email: user.email ?? null, profile: resolved };
});
