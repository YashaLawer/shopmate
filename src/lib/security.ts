import crypto from "node:crypto";

// Hash an IP so we can rate-limit without storing raw IPs.
export function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

// Best-effort client IP from proxy headers (Vercel sets x-forwarded-for).
export function getClientIp(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

// Normalize a host: drop protocol, path, port, and a leading www.
export function normalizeHost(input: string): string {
  let s = input.trim().toLowerCase();
  s = s.replace(/^https?:\/\//, "");
  s = s.replace(/\/.*$/, "");
  s = s.replace(/:\d+$/, "");
  s = s.replace(/^www\./, "");
  return s;
}

// Parse a textarea of domains into a clean, de-duped list.
export function parseDomains(text: string): string[] {
  return Array.from(
    new Set(
      text
        .split(/[\n,]/)
        .map(normalizeHost)
        .filter((d) => d && d.includes(".")),
    ),
  ).slice(0, 20);
}

// Does `host` match any allowed domain (exact or subdomain)?
// Empty allow-list = no restriction. Missing host = can't verify, allow.
export function hostAllowed(
  host: string | null | undefined,
  allowed: string[] | null | undefined,
): boolean {
  if (!allowed || allowed.length === 0) return true;
  if (!host) return true;
  const h = normalizeHost(host);
  return allowed.some((a) => h === a || h.endsWith("." + a));
}
