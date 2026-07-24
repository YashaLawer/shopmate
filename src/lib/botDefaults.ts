// Default assistant name + welcome message for a NEW chatbot, in the owner's
// dashboard language. These are just starting values — the owner can edit them.

export const BOT_DEFAULTS: Record<string, { name: string; welcome: string }> = {
  en: {
    name: "My store assistant",
    welcome: "Hi! How can I help you with your order today?",
  },
  ru: {
    name: "Ассистент магазина",
    welcome: "Здравствуйте! Чем могу помочь с вашим заказом?",
  },
  fr: {
    name: "Assistant de la boutique",
    welcome: "Bonjour ! Comment puis-je vous aider avec votre commande ?",
  },
  es: {
    name: "Asistente de la tienda",
    welcome: "¡Hola! ¿En qué puedo ayudarte con tu pedido?",
  },
  de: {
    name: "Shop-Assistent",
    welcome: "Hallo! Wie kann ich Ihnen bei Ihrer Bestellung helfen?",
  },
};

export function botDefaults(locale: string): { name: string; welcome: string } {
  return BOT_DEFAULTS[locale] ?? BOT_DEFAULTS.en;
}
