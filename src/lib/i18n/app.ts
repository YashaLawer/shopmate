// App (dashboard) localization dictionary — follows the visitor's chosen locale.
import type { Locale } from "./site";

export interface AppDict {
  common: { dashboard: string; signOut: string; planSuffix: string; upgrade: string; save: string; back: string };
  nav: { chatbots: string; analytics: string; billing: string; settings: string };
  settings: {
    title: string; account: string; emailLabel: string; planLabel: string; managePlan: string; languageLabel: string;
    security: string; newPassword: string; updatePassword: string; updating: string; passwordUpdated: string; passwordTooShort: string; passwordPh: string;
  };
  ganalytics: { title: string; subtitle: string; perBot: string; noBots: string; totalMessages: string };
  auth: {
    loginTitle: string; loginSubtitle: string;
    signupTitle: string; signupSubtitle: string;
    email: string; password: string;
    signIn: string; signUp: string; pleaseWait: string;
    noAccount: string; haveAccount: string;
    checkEmail: string; linkExpired: string;
    emailPh: string;
  };
  dash: {
    title: string;
    usageTpl: string; // "{used} of {total} chatbots used on the {plan} plan"
    limitBanner: string; // "...{plan}..."
    namePh: string;
    newChatbot: string;
    creating: string;
    limitReached: string;
    upgradeToCreate: string;
    createdTpl: string; // "Created {date}"
    deleteChatbot: string;
  };
  bot: {
    allChatbots: string; analytics: string; subtitle: string; saved: string;
    assistantName: string; welcomeMessage: string; welcomeHint: string;
    systemInstr: string; optional: string; systemPh: string;
    widgetColor: string; saveSettings: string; saving: string;
  };
  chat: { title: string; addKnowledgeHint: string; placeholder: string; error: string };
  kb: {
    title: string; subtitle: string; sourcesTpl: string;
    tabText: string; tabUrl: string; tabFile: string; limitReached: string; fileHint: string; fileTooBig: string;
    titlePh: string; contentPh: string; urlPh: string;
    addBtn: string; processing: string;
    charsTpl: string; statusReady: string; statusProcessing: string; statusFailed: string;
    empty: string;
    viewHint: string; viewLoading: string; viewEmpty: string; viewClose: string;
  };
  install: {
    title: string; subtitle: string; preview: string; platform: string;
    copy: string; copied: string;
    checkTitle: string; checkSubtitle: string; checkPh: string; checkBtn: string; checking: string;
    security: string; allowedDomains: string; allowedHint: string; domainsPh: string;
    domainsSaveHint: string; saveDomains: string; saving: string;
    keyText: string; regenerate: string; regenConfirm: string;
  };
  billing: {
    title: string; onPlanTpl: string; manage: string; billedMonthly: string; billedYearly: string;
    success: string; canceled: string; topup: string;
    messagesThisMonth: string; usageTpl: string; includesTopupTpl: string;
    topupTitle: string; buyTpl: string; hitLimit: string; plans: string;
    current: string; yourPlan: string; downgradeVia: string; upgradeTo: string; switchTo: string;
    switchToAnnual: string; switchToMonthly: string;
    confirmTitle: string; confirmLine: string; confirmNote: string; confirmCta: string; cancelBtn: string;
    testCardNote: string;
  };
  analytics: {
    proFeature: string; proDesc: string; upgradePro: string;
    title: string; subtitleTpl: string;
    conversations: string; questionsMonth: string; planLimit: string;
    last7days: string; recentQuestions: string; noQuestions: string;
  };
}

const en: AppDict = {
  common: { dashboard: "Dashboard", signOut: "Sign out", planSuffix: "plan", upgrade: "Upgrade", save: "Save", back: "Back" },
  nav: { chatbots: "Chatbots", analytics: "Analytics", billing: "Billing", settings: "Settings" },
  settings: {
    title: "Settings", account: "Account", emailLabel: "Email", planLabel: "Plan", managePlan: "Manage plan", languageLabel: "Language",
    security: "Password", newPassword: "New password", updatePassword: "Update password", updating: "Updating…", passwordUpdated: "Password updated.", passwordTooShort: "Password must be at least 6 characters.", passwordPh: "At least 6 characters",
  },
  ganalytics: { title: "Analytics", subtitle: "An overview across all your chatbots.", perBot: "By chatbot", noBots: "Create a chatbot to see analytics.", totalMessages: "Questions this month" },
  auth: {
    loginTitle: "Welcome back", loginSubtitle: "Sign in to manage your store assistant.",
    signupTitle: "Create your account", signupSubtitle: "Start building your store's AI support agent.",
    email: "Email", password: "Password",
    signIn: "Sign in", signUp: "Sign up", pleaseWait: "Please wait…",
    noAccount: "No account yet?", haveAccount: "Already have an account?",
    checkEmail: "Check your email to confirm your account, then sign in.",
    linkExpired: "That confirmation link has expired. Please sign in, or sign up again.",
    emailPh: "you@store.com",
  },
  dash: {
    title: "Your chatbots",
    usageTpl: "{used} of {total} chatbots used on the {plan} plan",
    limitBanner: "You've reached the chatbot limit of your {plan} plan.",
    namePh: "Name your assistant (e.g. Acme Store Support)",
    newChatbot: "New chatbot",
    creating: "Creating…",
    limitReached: "Chatbot limit reached.",
    upgradeToCreate: "Upgrade your plan to create more.",
    createdTpl: "Created {date}",
    deleteChatbot: "Delete chatbot",
  },
  bot: {
    allChatbots: "All chatbots", analytics: "Analytics", subtitle: "Configure your store assistant.", saved: "Settings saved.",
    assistantName: "Assistant name", welcomeMessage: "Welcome message", welcomeHint: "First message shown to customers when they open the chat.",
    systemInstr: "System instructions", optional: "(optional)", systemPh: "e.g. You are the support agent for Acme Store. Be friendly and concise. Only answer using the store's knowledge; if unsure, suggest emailing support@acme.com.",
    widgetColor: "Widget color", saveSettings: "Save settings", saving: "Saving…",
  },
  chat: { title: "Test your assistant", addKnowledgeHint: "Add knowledge below for grounded answers", placeholder: "Ask something a customer would ask…", error: "Sorry — something went wrong. Please try again." },
  kb: {
    title: "Knowledge base", subtitle: "Everything your assistant is allowed to answer from — FAQs, shipping & return policies, product info.", sourcesTpl: "{used} / {total} sources",
    tabText: "Paste text", tabUrl: "From URL", tabFile: "Upload file", limitReached: "You've reached your plan's knowledge limit.",
    titlePh: "Title (e.g. Shipping & Returns policy)", contentPh: "Paste your FAQ, policies, or product details here…", urlPh: "https://yourstore.com/help/shipping",
    fileHint: "PDF, Word, image, TXT or MD — up to 4 MB.", fileTooBig: "That file is too big (max 4 MB). Try a smaller file or split it.", addBtn: "Add to knowledge", processing: "Processing…",
    charsTpl: "{n} chars", statusReady: "ready", statusProcessing: "processing", statusFailed: "failed",
    empty: "No knowledge yet. Add your store's FAQ or policies above to train your assistant.",
    viewHint: "Click to view what's stored", viewLoading: "Loading…", viewEmpty: "No text stored for this source.", viewClose: "Close",
  },
  install: {
    title: "Install on your site", subtitle: "One line of code adds the chat bubble to your store. Pick your platform for exact steps.", preview: "Preview on a site", platform: "Platform",
    copy: "Copy", copied: "Copied",
    checkTitle: "Check your installation", checkSubtitle: "Added the snippet? Enter your site URL and we'll confirm the widget is live.", checkPh: "yourstore.com", checkBtn: "Check", checking: "Checking…",
    security: "Security", allowedDomains: "Allowed domains", allowedHint: "(one per line — leave empty to allow any site)", domainsPh: "mystore.com",
    domainsSaveHint: "The widget will only load on these domains — a stolen key is useless elsewhere.", saveDomains: "Save domains", saving: "Saving…",
    keyText: "Compromised key? Rotate it and re-paste the snippet.", regenerate: "Regenerate key", regenConfirm: "Generate a new key? Your current embed snippet will stop working until you replace it on your site.",
  },
  billing: {
    title: "Billing & plans", onPlanTpl: "You're on the {plan} plan.", manage: "Manage subscription", billedMonthly: "billed monthly", billedYearly: "billed yearly",
    success: "🎉 Payment successful — your plan is now active.", canceled: "Checkout canceled. No charge was made.", topup: "🎉 Messages added — your assistant is back to full speed.",
    messagesThisMonth: "Messages this month", usageTpl: "{used} of {total} used", includesTopupTpl: " · includes {n} from top-ups",
    topupTitle: "Need more messages this month?", buyTpl: "Buy {n} messages · ${price}", hitLimit: "You've hit your limit — buy a top-up above or upgrade your plan to keep answering customers.", plans: "Plans",
    current: "Current", yourPlan: "Your current plan", downgradeVia: "Downgrade via “Manage subscription”", upgradeTo: "Upgrade to", switchTo: "Switch to",
    switchToAnnual: "Switch to annual billing", switchToMonthly: "Switch to monthly billing",
    confirmTitle: "Confirm your change", confirmLine: "You're switching to {plan}: {price}, {billed}.", confirmNote: "We'll charge your saved card and prorate the difference — you won't be charged twice. You can switch or cancel anytime.", confirmCta: "Confirm change", cancelBtn: "Cancel",
    testCardNote: "Test mode — use card 4242 4242 4242 4242, any future date, any CVC.",
  },
  analytics: {
    proFeature: "Analytics is a Pro feature", proDesc: "See every question your customers ask, spot gaps in your help content, and track how much support your assistant handles.", upgradePro: "Upgrade to Pro",
    title: "Analytics", subtitleTpl: "What customers are asking {name}.",
    conversations: "Conversations", questionsMonth: "Questions this month", planLimit: "Plan limit",
    last7days: "Questions · last 7 days", recentQuestions: "Recent questions", noQuestions: "No customer questions yet. Once people chat with your widget, their questions show up here.",
  },
};

const ru: AppDict = {
  common: { dashboard: "Кабинет", signOut: "Выйти", planSuffix: "тариф", upgrade: "Повысить", save: "Сохранить", back: "Назад" },
  nav: { chatbots: "Боты", analytics: "Аналитика", billing: "Оплата", settings: "Настройки" },
  settings: {
    title: "Настройки", account: "Аккаунт", emailLabel: "Email", planLabel: "Тариф", managePlan: "Управлять тарифом", languageLabel: "Язык",
    security: "Пароль", newPassword: "Новый пароль", updatePassword: "Обновить пароль", updating: "Обновляем…", passwordUpdated: "Пароль обновлён.", passwordTooShort: "Пароль должен быть не короче 6 символов.", passwordPh: "Минимум 6 символов",
  },
  ganalytics: { title: "Аналитика", subtitle: "Сводка по всем вашим ботам.", perBot: "По ботам", noBots: "Создайте бота, чтобы увидеть аналитику.", totalMessages: "Вопросов за месяц" },
  auth: {
    loginTitle: "С возвращением", loginSubtitle: "Войдите, чтобы управлять ассистентом магазина.",
    signupTitle: "Создайте аккаунт", signupSubtitle: "Начните собирать ИИ-поддержку для своего магазина.",
    email: "Email", password: "Пароль",
    signIn: "Войти", signUp: "Зарегистрироваться", pleaseWait: "Подождите…",
    noAccount: "Ещё нет аккаунта?", haveAccount: "Уже есть аккаунт?",
    checkEmail: "Подтвердите аккаунт по письму на почте, затем войдите.",
    linkExpired: "Ссылка подтверждения истекла. Войдите или зарегистрируйтесь снова.",
    emailPh: "you@store.com",
  },
  dash: {
    title: "Ваши чат-боты",
    usageTpl: "{used} из {total} ботов на тарифе {plan}",
    limitBanner: "Вы достигли лимита ботов тарифа {plan}.",
    namePh: "Назовите ассистента (напр. Поддержка Acme Store)",
    newChatbot: "Новый бот",
    creating: "Создаём…",
    limitReached: "Достигнут лимит ботов.",
    upgradeToCreate: "Повысьте тариф, чтобы создать больше.",
    createdTpl: "Создан {date}",
    deleteChatbot: "Удалить бота",
  },
  bot: {
    allChatbots: "Все боты", analytics: "Аналитика", subtitle: "Настройте ассистента магазина.", saved: "Настройки сохранены.",
    assistantName: "Имя ассистента", welcomeMessage: "Приветствие", welcomeHint: "Первое сообщение, которое видит покупатель при открытии чата.",
    systemInstr: "Системные инструкции", optional: "(необязательно)", systemPh: "Напр.: Ты — агент поддержки магазина Acme. Отвечай дружелюбно и кратко. Используй только знания магазина; если не уверен — предложи написать на support@acme.com.",
    widgetColor: "Цвет виджета", saveSettings: "Сохранить настройки", saving: "Сохраняем…",
  },
  chat: { title: "Протестируйте ассистента", addKnowledgeHint: "Добавьте знания ниже, чтобы ответы были по делу", placeholder: "Спросите то, что спросил бы покупатель…", error: "Извините, что-то пошло не так. Попробуйте ещё раз." },
  kb: {
    title: "База знаний", subtitle: "Всё, из чего ассистент может отвечать — FAQ, правила доставки и возврата, описания товаров.", sourcesTpl: "{used} / {total} источников",
    tabText: "Вставить текст", tabUrl: "Из URL", tabFile: "Загрузить файл", limitReached: "Достигнут лимит знаний вашего тарифа.",
    titlePh: "Заголовок (напр. Доставка и возврат)", contentPh: "Вставьте сюда FAQ, правила или описания товаров…", urlPh: "https://вашмагазин.ru/help/dostavka",
    fileHint: "PDF, Word, изображение, TXT или MD — до 4 МБ.", fileTooBig: "Файл слишком большой (макс. 4 МБ). Возьмите поменьше или разделите.", addBtn: "Добавить в знания", processing: "Обрабатываем…",
    charsTpl: "{n} симв.", statusReady: "готово", statusProcessing: "обработка", statusFailed: "ошибка",
    empty: "Знаний пока нет. Добавьте выше FAQ или правила магазина, чтобы обучить ассистента.",
    viewHint: "Нажмите, чтобы посмотреть содержимое", viewLoading: "Загрузка…", viewEmpty: "Для этого источника нет сохранённого текста.", viewClose: "Закрыть",
  },
  install: {
    title: "Установка на сайт", subtitle: "Одна строка кода добавляет чат-пузырь на ваш магазин. Выберите платформу для точных шагов.", preview: "Превью на сайте", platform: "Платформа",
    copy: "Копировать", copied: "Скопировано",
    checkTitle: "Проверьте установку", checkSubtitle: "Вставили сниппет? Укажите адрес сайта — подтвердим, что виджет работает.", checkPh: "вашмагазин.ru", checkBtn: "Проверить", checking: "Проверяем…",
    security: "Безопасность", allowedDomains: "Разрешённые домены", allowedHint: "(по одному на строку — пусто = любой сайт)", domainsPh: "moymagazin.ru",
    domainsSaveHint: "Виджет загрузится только на этих доменах — украденный ключ бесполезен где-то ещё.", saveDomains: "Сохранить домены", saving: "Сохраняем…",
    keyText: "Ключ скомпрометирован? Смените его и вставьте сниппет заново.", regenerate: "Перегенерировать ключ", regenConfirm: "Сгенерировать новый ключ? Текущий сниппет перестанет работать, пока вы не замените его на сайте.",
  },
  billing: {
    title: "Оплата и тарифы", onPlanTpl: "Вы на тарифе {plan}.", manage: "Управление подпиской", billedMonthly: "оплата ежемесячно", billedYearly: "оплата ежегодно",
    success: "🎉 Оплата прошла — тариф активирован.", canceled: "Оплата отменена. Списаний не было.", topup: "🎉 Сообщения добавлены — ассистент снова в строю.",
    messagesThisMonth: "Сообщения в этом месяце", usageTpl: "{used} из {total} использовано", includesTopupTpl: " · включая {n} из докупки",
    topupTitle: "Нужно больше сообщений в этом месяце?", buyTpl: "Купить {n} сообщений · ${price}", hitLimit: "Лимит исчерпан — докупите пакет выше или повысьте тариф, чтобы продолжать отвечать покупателям.", plans: "Тарифы",
    current: "Текущий", yourPlan: "Ваш тариф", downgradeVia: "Понизить через «Управление подпиской»", upgradeTo: "Перейти на", switchTo: "Сменить на",
    switchToAnnual: "Перейти на годовую оплату", switchToMonthly: "Перейти на помесячную оплату",
    confirmTitle: "Подтвердите смену тарифа", confirmLine: "Вы переходите на {plan}: {price}, {billed}.", confirmNote: "Спишем с привязанной карты и учтём разницу пропорционально — дважды не спишется. Сменить или отменить можно в любой момент.", confirmCta: "Подтвердить", cancelBtn: "Отмена",
    testCardNote: "Тестовый режим — карта 4242 4242 4242 4242, любая будущая дата, любой CVC.",
  },
  analytics: {
    proFeature: "Аналитика — фича тарифа Pro", proDesc: "Смотрите каждый вопрос покупателей, находите пробелы в справке и отслеживайте нагрузку на ассистента.", upgradePro: "Перейти на Pro",
    title: "Аналитика", subtitleTpl: "О чём покупатели спрашивают {name}.",
    conversations: "Диалоги", questionsMonth: "Вопросов за месяц", planLimit: "Лимит тарифа",
    last7days: "Вопросы · за 7 дней", recentQuestions: "Недавние вопросы", noQuestions: "Вопросов покупателей пока нет. Как только начнут писать в виджет, вопросы появятся здесь.",
  },
};

const fr: AppDict = {
  common: { dashboard: "Tableau de bord", signOut: "Déconnexion", planSuffix: "offre", upgrade: "Améliorer", save: "Enregistrer", back: "Retour" },
  nav: { chatbots: "Chatbots", analytics: "Statistiques", billing: "Facturation", settings: "Paramètres" },
  settings: {
    title: "Paramètres", account: "Compte", emailLabel: "E-mail", planLabel: "Offre", managePlan: "Gérer l'offre", languageLabel: "Langue",
    security: "Mot de passe", newPassword: "Nouveau mot de passe", updatePassword: "Mettre à jour", updating: "Mise à jour…", passwordUpdated: "Mot de passe mis à jour.", passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères.", passwordPh: "Au moins 6 caractères",
  },
  ganalytics: { title: "Statistiques", subtitle: "Vue d'ensemble de tous vos chatbots.", perBot: "Par chatbot", noBots: "Créez un chatbot pour voir les statistiques.", totalMessages: "Questions ce mois-ci" },
  auth: {
    loginTitle: "Bon retour", loginSubtitle: "Connectez-vous pour gérer votre assistant.",
    signupTitle: "Créez votre compte", signupSubtitle: "Commencez à créer le support IA de votre boutique.",
    email: "E-mail", password: "Mot de passe",
    signIn: "Se connecter", signUp: "S'inscrire", pleaseWait: "Un instant…",
    noAccount: "Pas encore de compte ?", haveAccount: "Vous avez déjà un compte ?",
    checkEmail: "Confirmez votre compte via l'e-mail reçu, puis connectez-vous.",
    linkExpired: "Ce lien de confirmation a expiré. Connectez-vous ou réinscrivez-vous.",
    emailPh: "vous@boutique.com",
  },
  dash: {
    title: "Vos chatbots",
    usageTpl: "{used} sur {total} chatbots utilisés sur l'offre {plan}",
    limitBanner: "Vous avez atteint la limite de chatbots de l'offre {plan}.",
    namePh: "Nommez votre assistant (ex. Support Acme Store)",
    newChatbot: "Nouveau chatbot",
    creating: "Création…",
    limitReached: "Limite de chatbots atteinte.",
    upgradeToCreate: "Améliorez votre offre pour en créer plus.",
    createdTpl: "Créé le {date}",
    deleteChatbot: "Supprimer le chatbot",
  },
  bot: {
    allChatbots: "Tous les chatbots", analytics: "Statistiques", subtitle: "Configurez l'assistant de votre boutique.", saved: "Réglages enregistrés.",
    assistantName: "Nom de l'assistant", welcomeMessage: "Message d'accueil", welcomeHint: "Premier message affiché aux clients à l'ouverture du chat.",
    systemInstr: "Instructions système", optional: "(facultatif)", systemPh: "Ex. : Vous êtes l'agent de support d'Acme Store. Soyez amical et concis. Répondez uniquement à partir des connaissances de la boutique ; en cas de doute, proposez d'écrire à support@acme.com.",
    widgetColor: "Couleur du widget", saveSettings: "Enregistrer", saving: "Enregistrement…",
  },
  chat: { title: "Testez votre assistant", addKnowledgeHint: "Ajoutez des connaissances ci-dessous pour des réponses fondées", placeholder: "Posez une question que poserait un client…", error: "Désolé, une erreur s'est produite. Veuillez réessayer." },
  kb: {
    title: "Base de connaissances", subtitle: "Tout ce à partir de quoi l'assistant peut répondre — FAQ, politiques d'expédition et de retour, infos produits.", sourcesTpl: "{used} / {total} sources",
    tabText: "Coller du texte", tabUrl: "Depuis une URL", tabFile: "Importer un fichier", limitReached: "Vous avez atteint la limite de connaissances de votre offre.",
    titlePh: "Titre (ex. Livraison et retours)", contentPh: "Collez ici votre FAQ, vos politiques ou vos fiches produits…", urlPh: "https://votreboutique.com/aide/livraison",
    fileHint: "PDF, Word, image, TXT ou MD — jusqu'à 4 Mo.", fileTooBig: "Ce fichier est trop volumineux (max 4 Mo). Essayez plus petit.", addBtn: "Ajouter aux connaissances", processing: "Traitement…",
    charsTpl: "{n} caractères", statusReady: "prêt", statusProcessing: "traitement", statusFailed: "échec",
    empty: "Aucune connaissance pour l'instant. Ajoutez la FAQ ou les politiques de votre boutique ci-dessus pour entraîner l'assistant.",
    viewHint: "Cliquez pour voir le contenu", viewLoading: "Chargement…", viewEmpty: "Aucun texte enregistré pour cette source.", viewClose: "Fermer",
  },
  install: {
    title: "Installer sur votre site", subtitle: "Une ligne de code ajoute la bulle de chat à votre boutique. Choisissez votre plateforme pour les étapes exactes.", preview: "Aperçu sur un site", platform: "Plateforme",
    copy: "Copier", copied: "Copié",
    checkTitle: "Vérifier l'installation", checkSubtitle: "Snippet ajouté ? Saisissez l'URL de votre site et nous confirmerons que le widget est actif.", checkPh: "votreboutique.com", checkBtn: "Vérifier", checking: "Vérification…",
    security: "Sécurité", allowedDomains: "Domaines autorisés", allowedHint: "(un par ligne — vide = tout site)", domainsPh: "maboutique.com",
    domainsSaveHint: "Le widget ne se chargera que sur ces domaines — une clé volée est inutile ailleurs.", saveDomains: "Enregistrer les domaines", saving: "Enregistrement…",
    keyText: "Clé compromise ? Régénérez-la et recollez le snippet.", regenerate: "Régénérer la clé", regenConfirm: "Générer une nouvelle clé ? Votre snippet actuel cessera de fonctionner jusqu'à ce que vous le remplaciez sur votre site.",
  },
  billing: {
    title: "Facturation et offres", onPlanTpl: "Vous êtes sur l'offre {plan}.", manage: "Gérer l'abonnement", billedMonthly: "facturé mensuellement", billedYearly: "facturé annuellement",
    success: "🎉 Paiement réussi — votre offre est active.", canceled: "Paiement annulé. Aucun débit.", topup: "🎉 Messages ajoutés — votre assistant est de nouveau à pleine vitesse.",
    messagesThisMonth: "Messages ce mois-ci", usageTpl: "{used} sur {total} utilisés", includesTopupTpl: " · dont {n} en recharge",
    topupTitle: "Besoin de plus de messages ce mois-ci ?", buyTpl: "Acheter {n} messages · ${price}", hitLimit: "Limite atteinte — achetez une recharge ci-dessus ou améliorez votre offre pour continuer à répondre.", plans: "Offres",
    current: "Actuel", yourPlan: "Votre offre actuelle", downgradeVia: "Rétrograder via « Gérer l'abonnement »", upgradeTo: "Passer à", switchTo: "Basculer vers",
    switchToAnnual: "Passer à la facturation annuelle", switchToMonthly: "Passer à la facturation mensuelle",
    confirmTitle: "Confirmez le changement", confirmLine: "Vous passez à {plan} : {price}, {billed}.", confirmNote: "Nous débiterons votre carte enregistrée et calculerons la différence au prorata — pas de double débit. Vous pouvez changer ou annuler à tout moment.", confirmCta: "Confirmer", cancelBtn: "Annuler",
    testCardNote: "Mode test — carte 4242 4242 4242 4242, date future, CVC au choix.",
  },
  analytics: {
    proFeature: "Les statistiques sont une fonction Pro", proDesc: "Voyez chaque question de vos clients, repérez les lacunes de votre aide et suivez la charge gérée par l'assistant.", upgradePro: "Passer à Pro",
    title: "Statistiques", subtitleTpl: "Ce que les clients demandent à {name}.",
    conversations: "Conversations", questionsMonth: "Questions ce mois-ci", planLimit: "Limite de l'offre",
    last7days: "Questions · 7 derniers jours", recentQuestions: "Questions récentes", noQuestions: "Pas encore de questions. Dès que des visiteurs utilisent votre widget, leurs questions apparaîtront ici.",
  },
};

const es: AppDict = {
  common: { dashboard: "Panel", signOut: "Cerrar sesión", planSuffix: "plan", upgrade: "Mejorar", save: "Guardar", back: "Atrás" },
  nav: { chatbots: "Chatbots", analytics: "Analíticas", billing: "Facturación", settings: "Ajustes" },
  settings: {
    title: "Ajustes", account: "Cuenta", emailLabel: "Email", planLabel: "Plan", managePlan: "Gestionar plan", languageLabel: "Idioma",
    security: "Contraseña", newPassword: "Nueva contraseña", updatePassword: "Actualizar contraseña", updating: "Actualizando…", passwordUpdated: "Contraseña actualizada.", passwordTooShort: "La contraseña debe tener al menos 6 caracteres.", passwordPh: "Al menos 6 caracteres",
  },
  ganalytics: { title: "Analíticas", subtitle: "Un resumen de todos tus chatbots.", perBot: "Por chatbot", noBots: "Crea un chatbot para ver analíticas.", totalMessages: "Preguntas este mes" },
  auth: {
    loginTitle: "Bienvenido de nuevo", loginSubtitle: "Inicia sesión para gestionar tu asistente.",
    signupTitle: "Crea tu cuenta", signupSubtitle: "Empieza a crear el soporte con IA de tu tienda.",
    email: "Email", password: "Contraseña",
    signIn: "Iniciar sesión", signUp: "Registrarse", pleaseWait: "Un momento…",
    noAccount: "¿Aún no tienes cuenta?", haveAccount: "¿Ya tienes cuenta?",
    checkEmail: "Confirma tu cuenta con el email recibido y luego inicia sesión.",
    linkExpired: "Ese enlace de confirmación ha caducado. Inicia sesión o regístrate de nuevo.",
    emailPh: "tu@tienda.com",
  },
  dash: {
    title: "Tus chatbots",
    usageTpl: "{used} de {total} chatbots usados en el plan {plan}",
    limitBanner: "Has alcanzado el límite de chatbots de tu plan {plan}.",
    namePh: "Nombra tu asistente (ej. Soporte de Acme Store)",
    newChatbot: "Nuevo chatbot",
    creating: "Creando…",
    limitReached: "Límite de chatbots alcanzado.",
    upgradeToCreate: "Mejora tu plan para crear más.",
    createdTpl: "Creado el {date}",
    deleteChatbot: "Eliminar chatbot",
  },
  bot: {
    allChatbots: "Todos los chatbots", analytics: "Analíticas", subtitle: "Configura el asistente de tu tienda.", saved: "Ajustes guardados.",
    assistantName: "Nombre del asistente", welcomeMessage: "Mensaje de bienvenida", welcomeHint: "Primer mensaje que ven los clientes al abrir el chat.",
    systemInstr: "Instrucciones del sistema", optional: "(opcional)", systemPh: "Ej.: Eres el agente de soporte de Acme Store. Sé amable y conciso. Responde solo con el conocimiento de la tienda; si no estás seguro, sugiere escribir a support@acme.com.",
    widgetColor: "Color del widget", saveSettings: "Guardar ajustes", saving: "Guardando…",
  },
  chat: { title: "Prueba tu asistente", addKnowledgeHint: "Añade conocimiento abajo para respuestas fundamentadas", placeholder: "Pregunta lo que preguntaría un cliente…", error: "Lo sentimos, algo salió mal. Inténtalo de nuevo." },
  kb: {
    title: "Base de conocimiento", subtitle: "Todo aquello con lo que tu asistente puede responder — FAQ, políticas de envío y devolución, info de productos.", sourcesTpl: "{used} / {total} fuentes",
    tabText: "Pegar texto", tabUrl: "Desde URL", tabFile: "Subir archivo", limitReached: "Has alcanzado el límite de conocimiento de tu plan.",
    titlePh: "Título (ej. Envíos y devoluciones)", contentPh: "Pega aquí tu FAQ, políticas o detalles de productos…", urlPh: "https://tutienda.com/ayuda/envios",
    fileHint: "PDF, Word, imagen, TXT o MD — hasta 4 MB.", fileTooBig: "Ese archivo es demasiado grande (máx. 4 MB). Prueba con uno más pequeño.", addBtn: "Añadir al conocimiento", processing: "Procesando…",
    charsTpl: "{n} caracteres", statusReady: "listo", statusProcessing: "procesando", statusFailed: "error",
    empty: "Aún no hay conocimiento. Añade arriba la FAQ o políticas de tu tienda para entrenar al asistente.",
    viewHint: "Haz clic para ver el contenido", viewLoading: "Cargando…", viewEmpty: "No hay texto guardado para esta fuente.", viewClose: "Cerrar",
  },
  install: {
    title: "Instalar en tu sitio", subtitle: "Una línea de código añade la burbuja de chat a tu tienda. Elige tu plataforma para los pasos exactos.", preview: "Vista previa en un sitio", platform: "Plataforma",
    copy: "Copiar", copied: "Copiado",
    checkTitle: "Comprueba tu instalación", checkSubtitle: "¿Añadiste el snippet? Introduce la URL de tu sitio y confirmaremos que el widget está activo.", checkPh: "tutienda.com", checkBtn: "Comprobar", checking: "Comprobando…",
    security: "Seguridad", allowedDomains: "Dominios permitidos", allowedHint: "(uno por línea — vacío = cualquier sitio)", domainsPh: "mitienda.com",
    domainsSaveHint: "El widget solo se cargará en estos dominios — una clave robada es inútil en otro sitio.", saveDomains: "Guardar dominios", saving: "Guardando…",
    keyText: "¿Clave comprometida? Rótala y vuelve a pegar el snippet.", regenerate: "Regenerar clave", regenConfirm: "¿Generar una clave nueva? Tu snippet actual dejará de funcionar hasta que lo reemplaces en tu sitio.",
  },
  billing: {
    title: "Facturación y planes", onPlanTpl: "Estás en el plan {plan}.", manage: "Gestionar suscripción", billedMonthly: "facturación mensual", billedYearly: "facturación anual",
    success: "🎉 Pago correcto — tu plan está activo.", canceled: "Pago cancelado. No se hizo ningún cargo.", topup: "🎉 Mensajes añadidos — tu asistente vuelve a plena marcha.",
    messagesThisMonth: "Mensajes este mes", usageTpl: "{used} de {total} usados", includesTopupTpl: " · incluye {n} de recargas",
    topupTitle: "¿Necesitas más mensajes este mes?", buyTpl: "Comprar {n} mensajes · ${price}", hitLimit: "Has llegado a tu límite — compra una recarga arriba o mejora tu plan para seguir atendiendo.", plans: "Planes",
    current: "Actual", yourPlan: "Tu plan actual", downgradeVia: "Bajar vía «Gestionar suscripción»", upgradeTo: "Subir a", switchTo: "Cambiar a",
    switchToAnnual: "Cambiar a facturación anual", switchToMonthly: "Cambiar a facturación mensual",
    confirmTitle: "Confirma el cambio", confirmLine: "Vas a cambiar a {plan}: {price}, {billed}.", confirmNote: "Cobraremos tu tarjeta guardada y prorratearemos la diferencia — sin cobro doble. Puedes cambiar o cancelar cuando quieras.", confirmCta: "Confirmar cambio", cancelBtn: "Cancelar",
    testCardNote: "Modo de prueba — tarjeta 4242 4242 4242 4242, cualquier fecha futura, cualquier CVC.",
  },
  analytics: {
    proFeature: "Las analíticas son una función Pro", proDesc: "Ve cada pregunta de tus clientes, detecta huecos en tu ayuda y controla cuánto soporte gestiona tu asistente.", upgradePro: "Subir a Pro",
    title: "Analíticas", subtitleTpl: "Qué preguntan los clientes a {name}.",
    conversations: "Conversaciones", questionsMonth: "Preguntas este mes", planLimit: "Límite del plan",
    last7days: "Preguntas · últimos 7 días", recentQuestions: "Preguntas recientes", noQuestions: "Aún no hay preguntas de clientes. Cuando usen tu widget, sus preguntas aparecerán aquí.",
  },
};

const de: AppDict = {
  common: { dashboard: "Dashboard", signOut: "Abmelden", planSuffix: "Plan", upgrade: "Upgraden", save: "Speichern", back: "Zurück" },
  nav: { chatbots: "Chatbots", analytics: "Statistiken", billing: "Abrechnung", settings: "Einstellungen" },
  settings: {
    title: "Einstellungen", account: "Konto", emailLabel: "E-Mail", planLabel: "Plan", managePlan: "Plan verwalten", languageLabel: "Sprache",
    security: "Passwort", newPassword: "Neues Passwort", updatePassword: "Passwort aktualisieren", updating: "Wird aktualisiert…", passwordUpdated: "Passwort aktualisiert.", passwordTooShort: "Das Passwort muss mindestens 6 Zeichen haben.", passwordPh: "Mindestens 6 Zeichen",
  },
  ganalytics: { title: "Statistiken", subtitle: "Ein Überblick über alle Ihre Chatbots.", perBot: "Nach Chatbot", noBots: "Erstellen Sie einen Chatbot, um Statistiken zu sehen.", totalMessages: "Fragen diesen Monat" },
  auth: {
    loginTitle: "Willkommen zurück", loginSubtitle: "Melden Sie sich an, um Ihren Assistenten zu verwalten.",
    signupTitle: "Konto erstellen", signupSubtitle: "Erstellen Sie den KI-Support für Ihren Shop.",
    email: "E-Mail", password: "Passwort",
    signIn: "Anmelden", signUp: "Registrieren", pleaseWait: "Bitte warten…",
    noAccount: "Noch kein Konto?", haveAccount: "Schon ein Konto?",
    checkEmail: "Bestätigen Sie Ihr Konto über die E-Mail und melden Sie sich an.",
    linkExpired: "Dieser Bestätigungslink ist abgelaufen. Melden Sie sich an oder registrieren Sie sich erneut.",
    emailPh: "sie@shop.com",
  },
  dash: {
    title: "Ihre Chatbots",
    usageTpl: "{used} von {total} Chatbots im {plan}-Plan genutzt",
    limitBanner: "Sie haben das Chatbot-Limit Ihres {plan}-Plans erreicht.",
    namePh: "Assistenten benennen (z. B. Acme Store Support)",
    newChatbot: "Neuer Chatbot",
    creating: "Wird erstellt…",
    limitReached: "Chatbot-Limit erreicht.",
    upgradeToCreate: "Upgraden Sie, um mehr zu erstellen.",
    createdTpl: "Erstellt am {date}",
    deleteChatbot: "Chatbot löschen",
  },
  bot: {
    allChatbots: "Alle Chatbots", analytics: "Statistiken", subtitle: "Konfigurieren Sie Ihren Shop-Assistenten.", saved: "Einstellungen gespeichert.",
    assistantName: "Name des Assistenten", welcomeMessage: "Begrüßung", welcomeHint: "Erste Nachricht, die Kunden beim Öffnen des Chats sehen.",
    systemInstr: "System-Anweisungen", optional: "(optional)", systemPh: "z. B.: Sie sind der Support-Agent von Acme Store. Seien Sie freundlich und knapp. Antworten Sie nur aus dem Wissen des Shops; im Zweifel bitten Sie um eine E-Mail an support@acme.com.",
    widgetColor: "Widget-Farbe", saveSettings: "Speichern", saving: "Wird gespeichert…",
  },
  chat: { title: "Assistenten testen", addKnowledgeHint: "Fügen Sie unten Wissen hinzu für fundierte Antworten", placeholder: "Fragen Sie etwas, das ein Kunde fragen würde…", error: "Entschuldigung, etwas ist schiefgelaufen. Bitte versuchen Sie es erneut." },
  kb: {
    title: "Wissensbasis", subtitle: "Alles, woraus Ihr Assistent antworten darf — FAQs, Versand- und Rückgaberichtlinien, Produktinfos.", sourcesTpl: "{used} / {total} Quellen",
    tabText: "Text einfügen", tabUrl: "Von URL", tabFile: "Datei hochladen", limitReached: "Sie haben das Wissenslimit Ihres Plans erreicht.",
    titlePh: "Titel (z. B. Versand & Rückgabe)", contentPh: "Fügen Sie hier Ihre FAQ, Richtlinien oder Produktdetails ein…", urlPh: "https://ihrshop.de/hilfe/versand",
    fileHint: "PDF, Word, Bild, TXT oder MD — bis 4 MB.", fileTooBig: "Diese Datei ist zu groß (max. 4 MB). Versuchen Sie eine kleinere.", addBtn: "Zum Wissen hinzufügen", processing: "Wird verarbeitet…",
    charsTpl: "{n} Zeichen", statusReady: "bereit", statusProcessing: "Verarbeitung", statusFailed: "Fehler",
    empty: "Noch kein Wissen. Fügen Sie oben die FAQ oder Richtlinien Ihres Shops hinzu, um den Assistenten zu trainieren.",
    viewHint: "Zum Anzeigen des Inhalts klicken", viewLoading: "Wird geladen…", viewEmpty: "Für diese Quelle ist kein Text gespeichert.", viewClose: "Schließen",
  },
  install: {
    title: "Auf Ihrer Website installieren", subtitle: "Eine Zeile Code fügt die Chat-Blase zu Ihrem Shop hinzu. Wählen Sie Ihre Plattform für genaue Schritte.", preview: "Vorschau auf einer Website", platform: "Plattform",
    copy: "Kopieren", copied: "Kopiert",
    checkTitle: "Installation prüfen", checkSubtitle: "Snippet eingefügt? Geben Sie Ihre Website-URL ein und wir bestätigen, dass das Widget aktiv ist.", checkPh: "ihrshop.de", checkBtn: "Prüfen", checking: "Wird geprüft…",
    security: "Sicherheit", allowedDomains: "Erlaubte Domains", allowedHint: "(eine pro Zeile — leer = jede Website)", domainsPh: "meinshop.de",
    domainsSaveHint: "Das Widget lädt nur auf diesen Domains — ein gestohlener Schlüssel ist anderswo nutzlos.", saveDomains: "Domains speichern", saving: "Wird gespeichert…",
    keyText: "Schlüssel kompromittiert? Erneuern Sie ihn und fügen Sie das Snippet neu ein.", regenerate: "Schlüssel neu erzeugen", regenConfirm: "Neuen Schlüssel erzeugen? Ihr aktuelles Snippet funktioniert nicht mehr, bis Sie es auf Ihrer Website ersetzen.",
  },
  billing: {
    title: "Abrechnung & Pläne", onPlanTpl: "Sie nutzen den {plan}-Plan.", manage: "Abo verwalten", billedMonthly: "monatliche Abrechnung", billedYearly: "jährliche Abrechnung",
    success: "🎉 Zahlung erfolgreich — Ihr Plan ist aktiv.", canceled: "Bezahlung abgebrochen. Es wurde nichts berechnet.", topup: "🎉 Nachrichten hinzugefügt — Ihr Assistent ist wieder voll einsatzbereit.",
    messagesThisMonth: "Nachrichten diesen Monat", usageTpl: "{used} von {total} genutzt", includesTopupTpl: " · inkl. {n} aus Aufladungen",
    topupTitle: "Diesen Monat mehr Nachrichten nötig?", buyTpl: "{n} Nachrichten kaufen · ${price}", hitLimit: "Limit erreicht — kaufen Sie oben eine Aufladung oder upgraden Sie, um weiter zu antworten.", plans: "Pläne",
    current: "Aktuell", yourPlan: "Ihr aktueller Plan", downgradeVia: "Herabstufen über „Abo verwalten“", upgradeTo: "Upgrade auf", switchTo: "Wechseln zu",
    switchToAnnual: "Auf jährliche Abrechnung wechseln", switchToMonthly: "Auf monatliche Abrechnung wechseln",
    confirmTitle: "Änderung bestätigen", confirmLine: "Sie wechseln zu {plan}: {price}, {billed}.", confirmNote: "Wir belasten Ihre hinterlegte Karte und rechnen die Differenz anteilig ab — keine Doppelbelastung. Sie können jederzeit wechseln oder kündigen.", confirmCta: "Bestätigen", cancelBtn: "Abbrechen",
    testCardNote: "Testmodus — Karte 4242 4242 4242 4242, beliebiges künftiges Datum, beliebiger CVC.",
  },
  analytics: {
    proFeature: "Statistiken sind eine Pro-Funktion", proDesc: "Sehen Sie jede Kundenfrage, erkennen Sie Lücken in Ihrer Hilfe und verfolgen Sie, wie viel Support Ihr Assistent übernimmt.", upgradePro: "Auf Pro upgraden",
    title: "Statistiken", subtitleTpl: "Was Kunden {name} fragen.",
    conversations: "Unterhaltungen", questionsMonth: "Fragen diesen Monat", planLimit: "Plan-Limit",
    last7days: "Fragen · letzte 7 Tage", recentQuestions: "Neueste Fragen", noQuestions: "Noch keine Kundenfragen. Sobald Besucher Ihr Widget nutzen, erscheinen ihre Fragen hier.",
  },
};

const APP_DICTS: Record<Locale, AppDict> = { en, ru, fr, es, de };

export function getAppDict(locale: Locale): AppDict {
  return APP_DICTS[locale] ?? en;
}

// Simple {key} interpolation helper.
export function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
