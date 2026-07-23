import { AuthForm } from "../AuthForm";
import { login } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ checkEmail?: string }>;
}) {
  const sp = await searchParams;
  const notice = sp.checkEmail
    ? "Check your email to confirm your account, then sign in."
    : undefined;

  return <AuthForm mode="login" action={login} notice={notice} />;
}
