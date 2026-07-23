// Site (landing) localization dictionary.
export type Locale = "en" | "ru" | "fr" | "es" | "de";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export function isLocale(v: string | undefined | null): v is Locale {
  return !!v && LOCALES.some((l) => l.code === v);
}

interface PlanCopy {
  tagline: string;
  highlights: string[];
}

export interface Dict {
  nav: { how: string; features: string; pricing: string; signin: string; getStarted: string; dashboard: string };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    see: string;
    trustline: string;
    mockup: { title: string; welcome: string; q: string; a: string };
  };
  trust: string[];
  how: { eyebrow: string; title: string; steps: { title: string; text: string }[] };
  features: { eyebrow: string; title: string; items: { title: string; text: string }[] };
  showcase: { eyebrow: string; title: string; qa: { q: string; a: string }[] };
  pricing: {
    eyebrow: string; title: string; perMonth: string; current: string; popular: string;
    choose: string; getFree: string; upgrade: string; switchTo: string; downgrade: string;
    plans: { free: PlanCopy; starter: PlanCopy; pro: PlanCopy };
  };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
  cta: { title: string; text: string; button: string };
  footer: string;
}

const en: Dict = {
  nav: { how: "How it works", features: "Features", pricing: "Pricing", signin: "Sign in", getStarted: "Get started free", dashboard: "Go to dashboard" },
  hero: {
    badge: "AI support for online stores",
    title: "Turn your help docs into a support agent that never sleeps",
    subtitle: "Shopmate turns your store's FAQs, policies and product info into an AI assistant that answers customers instantly — in a chat widget right on your website.",
    cta: "Get started free",
    see: "See how it works",
    trustline: "Free plan • No credit card required • Set up in 5 minutes",
    mockup: { title: "Acme Store Support", welcome: "Hi! How can I help you with your order today?", q: "How long does shipping take?", a: "US orders arrive in 3–5 business days, and shipping is free over $50 🚚" },
  },
  trust: ["Answers only from your content", "No code required", "Works with PDF, URLs & text", "Live in minutes"],
  how: {
    eyebrow: "How it works",
    title: "From docs to live support in three steps",
    steps: [
      { title: "Add your knowledge", text: "Paste your FAQ, upload a policy doc, or point us at your help pages. Shopmate reads and indexes it in seconds." },
      { title: "Preview your assistant", text: "Test it right in your dashboard. It answers strictly from your content — no made-up policies or prices." },
      { title: "Embed on your store", text: "Copy one line of code into your site. A chat bubble appears, ready to answer customers 24/7." },
    ],
  },
  features: {
    eyebrow: "Features",
    title: "Everything you need to deflect support tickets",
    items: [
      { title: "Grounded, not guessing", text: "Answers come only from your knowledge base. If it doesn't know, it says so and points to support — never invents." },
      { title: "One-line embed", text: "A single script tag adds a polished chat widget to any store — Shopify, WooCommerce, custom, anything." },
      { title: "Feed it anything", text: "Pasted text, files, or a URL to your help pages. Update anytime and the assistant stays current." },
      { title: "Instant streaming replies", text: "Customers get fast, word-by-word answers — the same experience they expect from modern chat." },
      { title: "Match your brand", text: "Set the widget color and welcome message so it feels like a native part of your store." },
      { title: "See what customers ask", text: "Every conversation is saved, so you learn the real questions and the gaps in your help content." },
    ],
  },
  showcase: {
    eyebrow: "In action",
    title: "Real answers, straight from your store's own content",
    qa: [
      { q: "Can I return something after 3 weeks?", a: "Yes! You can return any unused item within 30 days for a full refund. Just email support@acme.com with your order number." },
      { q: "Do you ship to Canada?", a: "We ship worldwide 🌍 International orders usually arrive in 7–14 business days." },
      { q: "What payment methods do you take?", a: "Visa, Mastercard, Amex, Apple Pay and Google Pay — all processed securely via Stripe." },
    ],
  },
  pricing: {
    eyebrow: "Pricing", title: "Start free. Upgrade when your store grows.", perMonth: "/month",
    current: "Current plan", popular: "Most popular", choose: "Choose", getFree: "Get started free",
    upgrade: "Upgrade to", switchTo: "Switch to", downgrade: "Downgrade",
    plans: {
      free: { tagline: "Try it on one store", highlights: ["1 chatbot", "50 messages / month", "20 knowledge pages", "“Powered by Shopmate” badge"] },
      starter: { tagline: "For a growing store", highlights: ["1 chatbot", "2,000 messages / month", "200 knowledge pages", "Remove Shopmate badge", "Custom widget color"] },
      pro: { tagline: "For multiple stores & scale", highlights: ["3 chatbots", "10,000 messages / month", "1,000 knowledge pages", "Conversation analytics", "Everything in Starter"] },
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered",
    items: [
      { q: "How does Shopmate know the answers?", a: "You give it your store's own content — FAQs, shipping & return policies, product details. It only answers from that. If something isn't covered, it tells the customer to contact support instead of guessing." },
      { q: "Do I need to write any code?", a: "No. You add knowledge and customize the assistant in the dashboard, then paste one line of code into your site. If you use Shopify or WooCommerce, that's a single copy-paste." },
      { q: "Which website builders does it work with?", a: "Any website where you can add an HTML snippet — Shopify, WooCommerce, Wix, Squarespace, Webflow, or a fully custom site." },
      { q: "What happens if I hit my message limit?", a: "The assistant pauses new answers until the next month or until you top up / upgrade. Your knowledge and settings are always kept." },
    ],
  },
  cta: { title: "Stop answering the same questions over and over", text: "Give your customers instant answers and give yourself back your time. Set up your assistant in minutes — free.", button: "Get started free" },
  footer: "AI support for online stores.",
};

const ru: Dict = {
  nav: { how: "Как это работает", features: "Возможности", pricing: "Цены", signin: "Войти", getStarted: "Начать бесплатно", dashboard: "В личный кабинет" },
  hero: {
    badge: "ИИ-поддержка для интернет-магазинов",
    title: "Превратите справочные материалы в поддержку, которая не спит",
    subtitle: "Shopmate превращает FAQ, правила и описания товаров в ИИ-ассистента, который мгновенно отвечает покупателям — в чат-виджете прямо на вашем сайте.",
    cta: "Начать бесплатно",
    see: "Как это работает",
    trustline: "Бесплатный тариф • Без карты • Настройка за 5 минут",
    mockup: { title: "Поддержка Acme Store", welcome: "Здравствуйте! Чем помочь с вашим заказом?", q: "Сколько идёт доставка?", a: "Заказы по США приходят за 3–5 рабочих дней, доставка бесплатна от $50 🚚" },
  },
  trust: ["Отвечает только по вашим данным", "Без кода", "Текст, PDF и ссылки", "Запуск за минуты"],
  how: {
    eyebrow: "Как это работает",
    title: "От документов до живой поддержки за три шага",
    steps: [
      { title: "Добавьте знания", text: "Вставьте FAQ, загрузите документ или укажите ссылку на страницы помощи. Shopmate прочитает и проиндексирует за секунды." },
      { title: "Проверьте ассистента", text: "Протестируйте прямо в кабинете. Он отвечает строго по вашим данным — без выдуманных правил и цен." },
      { title: "Встройте на сайт", text: "Скопируйте одну строку кода. На сайте появится чат, готовый отвечать покупателям 24/7." },
    ],
  },
  features: {
    eyebrow: "Возможности",
    title: "Всё, чтобы разгрузить поддержку",
    items: [
      { title: "По делу, без выдумок", text: "Отвечает только из вашей базы знаний. Не знает — честно скажет и направит в поддержку, ничего не сочиняя." },
      { title: "Встраивание одной строкой", text: "Один тег script добавляет аккуратный чат на любой магазин — Shopify, WooCommerce, кастом, что угодно." },
      { title: "Загрузите что угодно", text: "Текст, файлы или ссылка на страницы помощи. Обновляйте когда хотите — ассистент всегда актуален." },
      { title: "Мгновенные ответы", text: "Покупатели видят быстрые ответы слово за словом — как в современных чатах." },
      { title: "Под ваш бренд", text: "Задайте цвет виджета и приветствие — он смотрится как родная часть магазина." },
      { title: "Видите, о чём спрашивают", text: "Все диалоги сохраняются — вы узнаёте реальные вопросы и пробелы в справке." },
    ],
  },
  showcase: {
    eyebrow: "В деле",
    title: "Реальные ответы прямо из данных вашего магазина",
    qa: [
      { q: "Можно вернуть товар через 3 недели?", a: "Да! Любой неиспользованный товар можно вернуть в течение 30 дней с полным возвратом. Напишите на support@acme.com с номером заказа." },
      { q: "Доставляете в Канаду?", a: "Мы доставляем по всему миру 🌍 Международные заказы обычно приходят за 7–14 рабочих дней." },
      { q: "Какие способы оплаты?", a: "Visa, Mastercard, Amex, Apple Pay и Google Pay — всё безопасно через Stripe." },
    ],
  },
  pricing: {
    eyebrow: "Цены", title: "Начните бесплатно. Растёте — переходите на платный.", perMonth: "/мес",
    current: "Ваш тариф", popular: "Популярный", choose: "Выбрать", getFree: "Начать бесплатно",
    upgrade: "Перейти на", switchTo: "Сменить на", downgrade: "Понизить",
    plans: {
      free: { tagline: "Попробуйте на одном магазине", highlights: ["1 бот", "50 сообщений / мес", "20 страниц знаний", "Бейдж «Powered by Shopmate»"] },
      starter: { tagline: "Для растущего магазина", highlights: ["1 бот", "2 000 сообщений / мес", "200 страниц знаний", "Убрать бейдж Shopmate", "Свой цвет виджета"] },
      pro: { tagline: "Для нескольких магазинов и масштаба", highlights: ["3 бота", "10 000 сообщений / мес", "1 000 страниц знаний", "Аналитика диалогов", "Всё из Starter"] },
    },
  },
  faq: {
    eyebrow: "Вопросы",
    title: "Отвечаем на вопросы",
    items: [
      { q: "Откуда бот знает ответы?", a: "Вы даёте ему данные магазина — FAQ, правила доставки и возврата, описания. Он отвечает только по ним. Если чего-то нет — предложит написать в поддержку, а не выдумает." },
      { q: "Нужно ли писать код?", a: "Нет. Вы добавляете знания и настраиваете ассистента в кабинете, затем вставляете одну строку кода на сайт. В Shopify или WooCommerce — одно копирование." },
      { q: "С какими конструкторами работает?", a: "С любым сайтом, куда можно вставить HTML — Shopify, WooCommerce, Wix, Squarespace, Webflow или полностью кастомный." },
      { q: "Что если кончатся сообщения?", a: "Ассистент приостановит новые ответы до следующего месяца или пока вы не докупите/повысите тариф. Знания и настройки всегда сохраняются." },
    ],
  },
  cta: { title: "Хватит отвечать на одни и те же вопросы", text: "Дайте покупателям мгновенные ответы, а себе — время. Настройка за минуты, бесплатно.", button: "Начать бесплатно" },
  footer: "ИИ-поддержка для интернет-магазинов.",
};

const fr: Dict = {
  nav: { how: "Fonctionnement", features: "Fonctionnalités", pricing: "Tarifs", signin: "Connexion", getStarted: "Commencer gratuitement", dashboard: "Tableau de bord" },
  hero: {
    badge: "Support IA pour boutiques en ligne",
    title: "Transformez votre aide en un support qui ne dort jamais",
    subtitle: "Shopmate transforme vos FAQ, politiques et fiches produits en un assistant IA qui répond instantanément à vos clients — dans un widget de chat sur votre site.",
    cta: "Commencer gratuitement",
    see: "Voir le fonctionnement",
    trustline: "Offre gratuite • Sans carte • Prêt en 5 minutes",
    mockup: { title: "Support Acme Store", welcome: "Bonjour ! Comment puis-je vous aider avec votre commande ?", q: "Quels sont les délais de livraison ?", a: "Les commandes aux États-Unis arrivent en 3–5 jours ouvrés, et la livraison est gratuite dès 50 $ 🚚" },
  },
  trust: ["Répond uniquement selon vos contenus", "Sans code", "Texte, PDF et URL", "En ligne en quelques minutes"],
  how: {
    eyebrow: "Fonctionnement",
    title: "De vos documents au support en trois étapes",
    steps: [
      { title: "Ajoutez vos connaissances", text: "Collez votre FAQ, importez un document ou indiquez vos pages d'aide. Shopmate les lit et les indexe en quelques secondes." },
      { title: "Testez votre assistant", text: "Essayez-le dans votre tableau de bord. Il répond strictement selon vos contenus — pas de politiques ni de prix inventés." },
      { title: "Intégrez-le à votre boutique", text: "Copiez une ligne de code sur votre site. Une bulle de chat apparaît, prête à répondre 24h/24." },
    ],
  },
  features: {
    eyebrow: "Fonctionnalités",
    title: "Tout pour réduire vos tickets de support",
    items: [
      { title: "Fondé, jamais inventé", text: "Les réponses viennent uniquement de votre base. S'il ne sait pas, il le dit et renvoie au support — sans rien inventer." },
      { title: "Intégration en une ligne", text: "Une seule balise script ajoute un joli chat à n'importe quelle boutique — Shopify, WooCommerce, sur-mesure." },
      { title: "Nourrissez-le de tout", text: "Texte, fichiers ou une URL vers vos pages d'aide. Mettez à jour quand vous voulez, l'assistant reste à jour." },
      { title: "Réponses instantanées", text: "Vos clients obtiennent des réponses rapides, mot à mot — comme sur un chat moderne." },
      { title: "À vos couleurs", text: "Réglez la couleur et le message d'accueil pour qu'il s'intègre parfaitement à votre boutique." },
      { title: "Voyez les questions", text: "Chaque conversation est enregistrée : découvrez les vraies questions et les manques de votre aide." },
    ],
  },
  showcase: {
    eyebrow: "En action",
    title: "De vraies réponses, tirées du contenu de votre boutique",
    qa: [
      { q: "Puis-je retourner un article après 3 semaines ?", a: "Oui ! Tout article non utilisé peut être retourné sous 30 jours pour un remboursement complet. Écrivez à support@acme.com avec votre numéro de commande." },
      { q: "Livrez-vous au Canada ?", a: "Nous livrons dans le monde entier 🌍 Les commandes internationales arrivent en 7 à 14 jours ouvrés." },
      { q: "Quels moyens de paiement ?", a: "Visa, Mastercard, Amex, Apple Pay et Google Pay — le tout sécurisé via Stripe." },
    ],
  },
  pricing: {
    eyebrow: "Tarifs", title: "Commencez gratuitement. Évoluez avec votre boutique.", perMonth: "/mois",
    current: "Votre offre", popular: "Le plus populaire", choose: "Choisir", getFree: "Commencer gratuitement",
    upgrade: "Passer à", switchTo: "Basculer vers", downgrade: "Rétrograder",
    plans: {
      free: { tagline: "Essayez sur une boutique", highlights: ["1 chatbot", "50 messages / mois", "20 pages de connaissances", "Badge « Powered by Shopmate »"] },
      starter: { tagline: "Pour une boutique en croissance", highlights: ["1 chatbot", "2 000 messages / mois", "200 pages de connaissances", "Retirer le badge Shopmate", "Couleur du widget personnalisée"] },
      pro: { tagline: "Pour plusieurs boutiques et l'échelle", highlights: ["3 chatbots", "10 000 messages / mois", "1 000 pages de connaissances", "Analyses des conversations", "Tout de Starter"] },
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Vos questions, nos réponses",
    items: [
      { q: "Comment Shopmate connaît-il les réponses ?", a: "Vous lui donnez le contenu de votre boutique — FAQ, politiques d'expédition et de retour, fiches produits. Il ne répond que d'après cela. Si ce n'est pas couvert, il invite à contacter le support au lieu d'inventer." },
      { q: "Dois-je écrire du code ?", a: "Non. Vous ajoutez les connaissances et configurez l'assistant dans le tableau de bord, puis collez une ligne de code sur votre site. Sur Shopify ou WooCommerce, un simple copier-coller." },
      { q: "Avec quels constructeurs ?", a: "Tout site où vous pouvez ajouter un extrait HTML — Shopify, WooCommerce, Wix, Squarespace, Webflow ou un site sur-mesure." },
      { q: "Que se passe-t-il si j'atteins ma limite ?", a: "L'assistant met en pause les nouvelles réponses jusqu'au mois suivant ou jusqu'à un rechargement / une mise à niveau. Vos connaissances et réglages sont toujours conservés." },
    ],
  },
  cta: { title: "Arrêtez de répondre sans cesse aux mêmes questions", text: "Offrez des réponses instantanées à vos clients et regagnez du temps. Configuration en quelques minutes — gratuit.", button: "Commencer gratuitement" },
  footer: "Support IA pour boutiques en ligne.",
};

const es: Dict = {
  nav: { how: "Cómo funciona", features: "Funciones", pricing: "Precios", signin: "Iniciar sesión", getStarted: "Empezar gratis", dashboard: "Ir al panel" },
  hero: {
    badge: "Soporte con IA para tiendas online",
    title: "Convierte tu ayuda en un soporte que nunca duerme",
    subtitle: "Shopmate convierte tus FAQ, políticas e información de productos en un asistente de IA que responde al instante — en un widget de chat en tu propia web.",
    cta: "Empezar gratis",
    see: "Ver cómo funciona",
    trustline: "Plan gratis • Sin tarjeta • Listo en 5 minutos",
    mockup: { title: "Soporte de Acme Store", welcome: "¡Hola! ¿Cómo puedo ayudarte con tu pedido?", q: "¿Cuánto tarda el envío?", a: "Los pedidos en EE. UU. llegan en 3–5 días hábiles, y el envío es gratis desde $50 🚚" },
  },
  trust: ["Responde solo con tu contenido", "Sin código", "Texto, PDF y URLs", "En marcha en minutos"],
  how: {
    eyebrow: "Cómo funciona",
    title: "De tus documentos al soporte en tres pasos",
    steps: [
      { title: "Añade tu conocimiento", text: "Pega tu FAQ, sube un documento o indica tus páginas de ayuda. Shopmate lo lee e indexa en segundos." },
      { title: "Prueba tu asistente", text: "Pruébalo en tu panel. Responde estrictamente con tu contenido — sin políticas ni precios inventados." },
      { title: "Insértalo en tu tienda", text: "Copia una línea de código en tu web. Aparece una burbuja de chat, lista para atender 24/7." },
    ],
  },
  features: {
    eyebrow: "Funciones",
    title: "Todo para reducir tus tickets de soporte",
    items: [
      { title: "Con base, sin inventar", text: "Las respuestas salen solo de tu base. Si no lo sabe, lo dice y remite al soporte — nunca inventa." },
      { title: "Integración en una línea", text: "Una sola etiqueta script añade un chat cuidado a cualquier tienda — Shopify, WooCommerce, a medida." },
      { title: "Aliméntalo con todo", text: "Texto, archivos o una URL a tus páginas de ayuda. Actualiza cuando quieras y el asistente se mantiene al día." },
      { title: "Respuestas al instante", text: "Tus clientes reciben respuestas rápidas, palabra a palabra — como en un chat moderno." },
      { title: "Con tu marca", text: "Elige el color y el mensaje de bienvenida para que se sienta parte de tu tienda." },
      { title: "Ve qué preguntan", text: "Cada conversación se guarda: descubre las preguntas reales y los huecos de tu ayuda." },
    ],
  },
  showcase: {
    eyebrow: "En acción",
    title: "Respuestas reales, directas del contenido de tu tienda",
    qa: [
      { q: "¿Puedo devolver algo tras 3 semanas?", a: "¡Sí! Cualquier artículo sin usar se puede devolver en 30 días con reembolso completo. Escribe a support@acme.com con tu número de pedido." },
      { q: "¿Envían a Canadá?", a: "Enviamos a todo el mundo 🌍 Los pedidos internacionales suelen llegar en 7–14 días hábiles." },
      { q: "¿Qué métodos de pago aceptan?", a: "Visa, Mastercard, Amex, Apple Pay y Google Pay — todo seguro con Stripe." },
    ],
  },
  pricing: {
    eyebrow: "Precios", title: "Empieza gratis. Sube de plan cuando crezcas.", perMonth: "/mes",
    current: "Tu plan", popular: "Más popular", choose: "Elegir", getFree: "Empezar gratis",
    upgrade: "Subir a", switchTo: "Cambiar a", downgrade: "Bajar",
    plans: {
      free: { tagline: "Pruébalo en una tienda", highlights: ["1 chatbot", "50 mensajes / mes", "20 páginas de conocimiento", "Insignia «Powered by Shopmate»"] },
      starter: { tagline: "Para una tienda en crecimiento", highlights: ["1 chatbot", "2.000 mensajes / mes", "200 páginas de conocimiento", "Quitar la insignia de Shopmate", "Color del widget personalizado"] },
      pro: { tagline: "Para varias tiendas y escala", highlights: ["3 chatbots", "10.000 mensajes / mes", "1.000 páginas de conocimiento", "Analíticas de conversaciones", "Todo lo de Starter"] },
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Preguntas, respondidas",
    items: [
      { q: "¿Cómo sabe Shopmate las respuestas?", a: "Le das el contenido de tu tienda — FAQ, políticas de envío y devolución, detalles de producto. Solo responde con eso. Si algo no está, invita a contactar con soporte en vez de inventar." },
      { q: "¿Necesito escribir código?", a: "No. Añades el conocimiento y configuras el asistente en el panel, y pegas una línea de código en tu web. En Shopify o WooCommerce, un solo copiar y pegar." },
      { q: "¿Con qué creadores funciona?", a: "Cualquier web donde puedas añadir un fragmento HTML — Shopify, WooCommerce, Wix, Squarespace, Webflow o una web a medida." },
      { q: "¿Qué pasa si llego a mi límite?", a: "El asistente pausa las nuevas respuestas hasta el mes siguiente o hasta que recargues / subas de plan. Tu conocimiento y ajustes siempre se conservan." },
    ],
  },
  cta: { title: "Deja de responder una y otra vez a lo mismo", text: "Da respuestas instantáneas a tus clientes y recupera tu tiempo. Configúralo en minutos — gratis.", button: "Empezar gratis" },
  footer: "Soporte con IA para tiendas online.",
};

const de: Dict = {
  nav: { how: "So funktioniert's", features: "Funktionen", pricing: "Preise", signin: "Anmelden", getStarted: "Kostenlos starten", dashboard: "Zum Dashboard" },
  hero: {
    badge: "KI-Support für Onlineshops",
    title: "Machen Sie aus Ihren Hilfe-Texten einen Support, der nie schläft",
    subtitle: "Shopmate verwandelt FAQs, Richtlinien und Produktinfos in einen KI-Assistenten, der Kunden sofort antwortet — in einem Chat-Widget direkt auf Ihrer Website.",
    cta: "Kostenlos starten",
    see: "So funktioniert's",
    trustline: "Kostenloser Plan • Keine Karte • In 5 Minuten startklar",
    mockup: { title: "Acme Store Support", welcome: "Hallo! Wie kann ich bei Ihrer Bestellung helfen?", q: "Wie lange dauert der Versand?", a: "US-Bestellungen kommen in 3–5 Werktagen, Versand ab 50 $ kostenlos 🚚" },
  },
  trust: ["Antwortet nur aus Ihren Inhalten", "Kein Code nötig", "Text, PDF & URLs", "In Minuten live"],
  how: {
    eyebrow: "So funktioniert's",
    title: "Von Dokumenten zum Live-Support in drei Schritten",
    steps: [
      { title: "Wissen hinzufügen", text: "FAQ einfügen, ein Dokument hochladen oder Ihre Hilfeseiten angeben. Shopmate liest und indexiert alles in Sekunden." },
      { title: "Assistenten testen", text: "Testen Sie ihn direkt im Dashboard. Er antwortet streng aus Ihren Inhalten — keine erfundenen Richtlinien oder Preise." },
      { title: "In den Shop einbetten", text: "Eine Zeile Code auf Ihrer Website einfügen. Eine Chat-Blase erscheint und beantwortet Fragen rund um die Uhr." },
    ],
  },
  features: {
    eyebrow: "Funktionen",
    title: "Alles, um Support-Tickets zu reduzieren",
    items: [
      { title: "Fundiert, nicht geraten", text: "Antworten kommen nur aus Ihrer Wissensbasis. Weiß er etwas nicht, sagt er es und verweist an den Support — erfindet nie." },
      { title: "Einbindung in einer Zeile", text: "Ein einziges Script-Tag fügt jedem Shop ein schönes Chat-Widget hinzu — Shopify, WooCommerce, individuell." },
      { title: "Füttern Sie ihn mit allem", text: "Text, Dateien oder eine URL zu Ihren Hilfeseiten. Jederzeit aktualisieren — der Assistent bleibt aktuell." },
      { title: "Sofortige Antworten", text: "Kunden erhalten schnelle Antworten, Wort für Wort — wie im modernen Chat." },
      { title: "In Ihrem Branding", text: "Farbe und Begrüßung festlegen, damit es sich wie ein nativer Teil Ihres Shops anfühlt." },
      { title: "Sehen, was gefragt wird", text: "Jede Unterhaltung wird gespeichert — Sie erkennen echte Fragen und Lücken in Ihrer Hilfe." },
    ],
  },
  showcase: {
    eyebrow: "In Aktion",
    title: "Echte Antworten, direkt aus den Inhalten Ihres Shops",
    qa: [
      { q: "Kann ich nach 3 Wochen zurückgeben?", a: "Ja! Jeder unbenutzte Artikel kann innerhalb von 30 Tagen mit voller Rückerstattung zurückgegeben werden. Schreiben Sie an support@acme.com mit Ihrer Bestellnummer." },
      { q: "Liefern Sie nach Kanada?", a: "Wir liefern weltweit 🌍 Internationale Bestellungen kommen meist in 7–14 Werktagen an." },
      { q: "Welche Zahlungsarten gibt es?", a: "Visa, Mastercard, Amex, Apple Pay und Google Pay — alles sicher über Stripe." },
    ],
  },
  pricing: {
    eyebrow: "Preise", title: "Kostenlos starten. Upgraden, wenn Ihr Shop wächst.", perMonth: "/Monat",
    current: "Ihr Plan", popular: "Beliebt", choose: "Wählen", getFree: "Kostenlos starten",
    upgrade: "Upgrade auf", switchTo: "Wechseln zu", downgrade: "Herabstufen",
    plans: {
      free: { tagline: "Auf einem Shop ausprobieren", highlights: ["1 Chatbot", "50 Nachrichten / Monat", "20 Wissensseiten", "„Powered by Shopmate“-Badge"] },
      starter: { tagline: "Für einen wachsenden Shop", highlights: ["1 Chatbot", "2.000 Nachrichten / Monat", "200 Wissensseiten", "Shopmate-Badge entfernen", "Eigene Widget-Farbe"] },
      pro: { tagline: "Für mehrere Shops und Skalierung", highlights: ["3 Chatbots", "10.000 Nachrichten / Monat", "1.000 Wissensseiten", "Gesprächsanalysen", "Alles aus Starter"] },
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Fragen, beantwortet",
    items: [
      { q: "Woher kennt Shopmate die Antworten?", a: "Sie geben ihm die Inhalte Ihres Shops — FAQs, Versand- und Rückgaberichtlinien, Produktdetails. Er antwortet nur daraus. Fehlt etwas, verweist er an den Support, statt zu raten." },
      { q: "Muss ich Code schreiben?", a: "Nein. Sie fügen Wissen hinzu und richten den Assistenten im Dashboard ein, dann fügen Sie eine Zeile Code auf Ihrer Website ein. Bei Shopify oder WooCommerce ein einziges Einfügen." },
      { q: "Mit welchen Baukästen funktioniert es?", a: "Jede Website, in die Sie ein HTML-Snippet einfügen können — Shopify, WooCommerce, Wix, Squarespace, Webflow oder eine individuelle Seite." },
      { q: "Was passiert beim Erreichen des Limits?", a: "Der Assistent pausiert neue Antworten bis zum nächsten Monat oder bis Sie aufladen / upgraden. Ihr Wissen und Ihre Einstellungen bleiben immer erhalten." },
    ],
  },
  cta: { title: "Beantworten Sie nicht immer wieder dieselben Fragen", text: "Geben Sie Kunden sofortige Antworten und sich selbst Zeit zurück. In Minuten eingerichtet — kostenlos.", button: "Kostenlos starten" },
  footer: "KI-Support für Onlineshops.",
};

const DICTS: Record<Locale, Dict> = { en, ru, fr, es, de };

export function getDict(locale: Locale): Dict {
  return DICTS[locale] ?? en;
}
