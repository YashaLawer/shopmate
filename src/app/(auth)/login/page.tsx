import { AuthForm } from "../AuthForm";
import { login } from "../actions";
import { getLocale } from "@/lib/i18n/getLocale";
import { getAppDict } from "@/lib/i18n/app";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ checkEmail?: string }>;
}) {
  const sp = await searchParams;
  const a = getAppDict(await getLocale()).auth;
  const notice =
    sp.checkEmail === "expired"
      ? a.linkExpired
      : sp.checkEmail
        ? a.checkEmail
        : undefined;

  return <AuthForm mode="login" action={login} a={a} notice={notice} />;
}
