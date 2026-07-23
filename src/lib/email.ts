import "server-only";

// Lightweight Resend wrapper. No SDK dependency — one fetch call.
// Degrades gracefully: if RESEND_API_KEY is missing or the call fails,
// it never throws, so signup / chat flows are never blocked by email.

const FROM = process.env.EMAIL_FROM || "Shopmate <onboarding@resend.dev>";

type SendResult = { ok: boolean; id?: string; error?: string };

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `${res.status} ${body.slice(0, 300)}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// --- shared branded shell -------------------------------------------------

function shell(inner: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f6f7f9;padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f2430;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eceef2;">
      <tr><td style="background:linear-gradient(135deg,#6d28d9,#4f46e5);padding:22px 28px;">
        <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:.3px;">Shopmate</span>
      </td></tr>
      <tr><td style="padding:28px;">${inner}</td></tr>
      <tr><td style="padding:18px 28px;border-top:1px solid #f0f1f4;color:#9aa0ab;font-size:12px;">
        Shopmate — AI support chat for online stores.
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function btn(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 20px;border-radius:10px;">${label}</a>`;
}

// --- localized templates --------------------------------------------------

type Loc = "en" | "ru" | "fr" | "es" | "de";

const norm = (l?: string): Loc => {
  const s = (l || "en").slice(0, 2).toLowerCase();
  return (["en", "ru", "fr", "es", "de"] as const).includes(s as Loc)
    ? (s as Loc)
    : "en";
};

const WELCOME: Record<Loc, { subject: string; h: string; p: string; cta: string }> = {
  en: {
    subject: "Welcome to Shopmate 🎉",
    h: "Your account is ready",
    p: "Thanks for signing up! Create your first chatbot, upload your store's docs, and paste one line of code on your site — your AI support agent goes live in minutes.",
    cta: "Open dashboard",
  },
  ru: {
    subject: "Добро пожаловать в Shopmate 🎉",
    h: "Аккаунт готов",
    p: "Спасибо за регистрацию! Создайте первого бота, загрузите документы магазина и вставьте одну строку кода на сайт — ИИ-поддержка заработает за пару минут.",
    cta: "Открыть кабинет",
  },
  fr: {
    subject: "Bienvenue sur Shopmate 🎉",
    h: "Votre compte est prêt",
    p: "Merci de votre inscription ! Créez votre premier chatbot, importez les documents de votre boutique et collez une ligne de code sur votre site — votre agent IA est en ligne en quelques minutes.",
    cta: "Ouvrir le tableau de bord",
  },
  es: {
    subject: "Bienvenido a Shopmate 🎉",
    h: "Tu cuenta está lista",
    p: "¡Gracias por registrarte! Crea tu primer chatbot, sube los documentos de tu tienda y pega una línea de código en tu web: tu agente de IA estará activo en minutos.",
    cta: "Abrir panel",
  },
  de: {
    subject: "Willkommen bei Shopmate 🎉",
    h: "Dein Konto ist bereit",
    p: "Danke für deine Anmeldung! Erstelle deinen ersten Chatbot, lade die Dokumente deines Shops hoch und füge eine Zeile Code auf deiner Website ein — dein KI-Support ist in Minuten live.",
    cta: "Dashboard öffnen",
  },
};

export async function sendWelcomeEmail(to: string, appUrl: string, locale?: string) {
  const t = WELCOME[norm(locale)];
  const html = shell(
    `<h1 style="margin:0 0 12px;font-size:20px;">${t.h}</h1>
     <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:#4a5060;">${t.p}</p>
     ${btn(`${appUrl}/dashboard`, t.cta)}`,
  );
  return sendEmail({ to, subject: t.subject, html });
}

const USAGE: Record<
  Loc,
  { subject: string; h: string; p: (used: number, limit: number) => string; cta: string }
> = {
  en: {
    subject: "You've used 80% of your Shopmate messages",
    h: "Running low on messages",
    p: (u, l) =>
      `Your chatbots have used <b>${u.toLocaleString()}</b> of <b>${l.toLocaleString()}</b> messages this month. When you hit the limit, the widget shows a friendly “try later” message. Top up or upgrade to keep it answering.`,
    cta: "Top up messages",
  },
  ru: {
    subject: "Израсходовано 80% сообщений Shopmate",
    h: "Сообщения заканчиваются",
    p: (u, l) =>
      `Ваши боты использовали <b>${u.toLocaleString()}</b> из <b>${l.toLocaleString()}</b> сообщений в этом месяце. При достижении лимита виджет покажет вежливое «попробуйте позже». Докупите сообщения или обновите тариф.`,
    cta: "Докупить сообщения",
  },
  fr: {
    subject: "Vous avez utilisé 80 % de vos messages Shopmate",
    h: "Messages bientôt épuisés",
    p: (u, l) =>
      `Vos chatbots ont utilisé <b>${u.toLocaleString()}</b> sur <b>${l.toLocaleString()}</b> messages ce mois-ci. À la limite, le widget affiche un message « réessayez plus tard ». Rechargez ou passez à un forfait supérieur.`,
    cta: "Recharger des messages",
  },
  es: {
    subject: "Has usado el 80 % de tus mensajes de Shopmate",
    h: "Te quedan pocos mensajes",
    p: (u, l) =>
      `Tus chatbots han usado <b>${u.toLocaleString()}</b> de <b>${l.toLocaleString()}</b> mensajes este mes. Al llegar al límite, el widget muestra un mensaje de “inténtalo más tarde”. Recarga o mejora tu plan.`,
    cta: "Recargar mensajes",
  },
  de: {
    subject: "Du hast 80 % deiner Shopmate-Nachrichten verbraucht",
    h: "Nachrichten gehen zur Neige",
    p: (u, l) =>
      `Deine Chatbots haben diesen Monat <b>${u.toLocaleString()}</b> von <b>${l.toLocaleString()}</b> Nachrichten genutzt. Beim Limit zeigt das Widget eine freundliche „später erneut versuchen“-Meldung. Lade auf oder wechsle den Tarif.`,
    cta: "Nachrichten aufladen",
  },
};

export async function sendUsageWarningEmail(
  to: string,
  appUrl: string,
  used: number,
  limit: number,
  locale?: string,
) {
  const t = USAGE[norm(locale)];
  const html = shell(
    `<h1 style="margin:0 0 12px;font-size:20px;">${t.h}</h1>
     <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:#4a5060;">${t.p(used, limit)}</p>
     ${btn(`${appUrl}/dashboard/billing`, t.cta)}`,
  );
  return sendEmail({ to, subject: t.subject, html });
}
