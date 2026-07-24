import { getLocale } from "@/lib/i18n/getLocale";
import { getAppDict } from "@/lib/i18n/app";
import { requestPasswordReset } from "../actions";
import { ResetForm } from "../ResetForm";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const sp = await searchParams;
  const a = getAppDict(await getLocale()).auth;
  return <ResetForm a={a} action={requestPasswordReset} sent={!!sp.sent} />;
}
