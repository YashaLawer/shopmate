import { cookies } from "next/headers";
import { isLocale, type Locale } from "./site";

// Read the visitor's chosen site locale from the cookie (default English).
export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const v = c.get("locale")?.value;
  return isLocale(v) ? v : "en";
}
