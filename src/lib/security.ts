import crypto from "node:crypto";
import net from "node:net";
import { lookup } from "node:dns/promises";

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

// Is an IP address private / loopback / link-local (SSRF targets)?
function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) || // link-local (cloud metadata)
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }
  const low = ip.toLowerCase();
  return (
    low === "::1" ||
    low === "::" ||
    low.startsWith("fe80") || // link-local
    low.startsWith("fc") || // unique-local
    low.startsWith("fd")
  );
}

// Validate a user-supplied URL before the server fetches it, to block SSRF to
// localhost / cloud metadata / private networks. Resolves the host and rejects
// private IPs. Returns the parsed URL or throws.
export async function assertPublicUrl(urlStr: string): Promise<URL> {
  let u: URL;
  try {
    u = new URL(urlStr);
  } catch {
    throw new Error("Enter a valid URL.");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Only http and https URLs are supported.");
  }
  const host = u.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    (net.isIP(host) && isPrivateIp(host))
  ) {
    throw new Error("That address isn't allowed.");
  }
  if (!net.isIP(host)) {
    try {
      const records = await lookup(host, { all: true });
      if (records.some((r) => isPrivateIp(r.address))) {
        throw new Error("That address isn't allowed.");
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes("isn't allowed")) throw e;
      throw new Error("Couldn't resolve that address.");
    }
  }
  return u;
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
