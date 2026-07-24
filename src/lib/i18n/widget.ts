// Widget UI strings, localized to the visitor's browser language.
// The bot's answers are already in the customer's language (handled by the LLM);
// this covers the widget chrome (placeholder, subtitle, error).

export type Lang = "en" | "ru" | "fr" | "es" | "de";

export const WIDGET_STRINGS: Record<
  Lang,
  {
    replyInstantly: string;
    placeholder: string;
    error: string;
    contactSupport: string;
    notAllowed: string;
  }
> = {
  en: {
    replyInstantly: "We usually reply instantly",
    placeholder: "Type your message…",
    error: "Sorry — something went wrong. Please try again.",
    contactSupport: "Contact support",
    notAllowed: "This assistant isn't enabled for this website.",
  },
  ru: {
    replyInstantly: "Обычно отвечаем сразу",
    placeholder: "Напишите сообщение…",
    error: "Извините, что-то пошло не так. Попробуйте ещё раз.",
    contactSupport: "Связаться с поддержкой",
    notAllowed: "Этот ассистент не подключён для этого сайта.",
  },
  fr: {
    replyInstantly: "Nous répondons généralement tout de suite",
    placeholder: "Écrivez votre message…",
    error: "Désolé, une erreur s'est produite. Veuillez réessayer.",
    contactSupport: "Contacter le support",
    notAllowed: "Cet assistant n'est pas activé pour ce site.",
  },
  es: {
    replyInstantly: "Solemos responder al instante",
    placeholder: "Escribe tu mensaje…",
    error: "Lo sentimos, algo salió mal. Inténtalo de nuevo.",
    contactSupport: "Contactar con soporte",
    notAllowed: "Este asistente no está habilitado para este sitio.",
  },
  de: {
    replyInstantly: "Wir antworten meist sofort",
    placeholder: "Ihre Nachricht…",
    error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    contactSupport: "Support kontaktieren",
    notAllowed: "Dieser Assistent ist für diese Website nicht aktiviert.",
  },
};

// Pick a supported language from an Accept-Language header (or any tag string).
export function pickLang(acceptLanguage: string | null | undefined): Lang {
  if (!acceptLanguage) return "en";
  const primary = acceptLanguage.toLowerCase().split(",")[0].trim().slice(0, 2);
  const supported: Lang[] = ["en", "ru", "fr", "es", "de"];
  return (supported as string[]).includes(primary) ? (primary as Lang) : "en";
}
