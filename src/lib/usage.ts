import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// First day of the current UTC month, ISO string. Used for monthly usage windows.
export function startOfMonthISO(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export async function countChatbots(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("chatbots")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  return count ?? 0;
}

export async function countPages(chatbotId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("chatbot_id", chatbotId);
  return count ?? 0;
}

// Count of customer (user-role) messages this month for a given owner.
// Uses the admin client so it works from both dashboard and widget contexts.
export async function countMessagesThisMonth(ownerId: string): Promise<number> {
  const admin = createAdminClient();
  const { count } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", ownerId)
    .eq("role", "user")
    .gte("created_at", startOfMonthISO());
  return count ?? 0;
}
