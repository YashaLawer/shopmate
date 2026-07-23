import { AuthForm } from "../AuthForm";
import { signup } from "../actions";
import { getLocale } from "@/lib/i18n/getLocale";
import { getAppDict } from "@/lib/i18n/app";

export default async function SignupPage() {
  const a = getAppDict(await getLocale()).auth;
  return <AuthForm mode="signup" action={signup} a={a} />;
}
