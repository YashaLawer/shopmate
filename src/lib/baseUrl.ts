import { headers } from "next/headers";

// Resolve the app's public base URL from the incoming request. Works on any
// host (Vercel, local, custom domain) without depending on NEXT_PUBLIC_APP_URL
// being set correctly. Used for the embed snippet and Stripe redirect URLs.
export async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto =
      h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  const env = process.env.NEXT_PUBLIC_APP_URL;
  return env ? env.replace(/\/$/, "") : "http://localhost:3000";
}
