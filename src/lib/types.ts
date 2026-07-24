import type { PlanId } from "./plans";

export interface Profile {
  id: string;
  email: string | null;
  plan: PlanId;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  topup_messages?: number;
  topup_period?: string | null;
  created_at: string;
}

export interface Chatbot {
  id: string;
  user_id: string;
  name: string;
  public_key: string;
  system_prompt: string | null;
  welcome_message: string;
  widget_color: string;
  show_branding: boolean;
  allowed_domains?: string[];
  handoff_type?: string | null;
  handoff_value?: string | null;
  daily_ip_limit?: number | null;
  created_at: string;
}

export type DocumentStatus = "processing" | "ready" | "error";
export type DocumentSource = "text" | "file" | "url";

export interface KnowledgeDocument {
  id: string;
  chatbot_id: string;
  user_id: string;
  title: string;
  source_type: DocumentSource;
  source_url: string | null;
  char_count: number;
  status: DocumentStatus;
  created_at: string;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}
