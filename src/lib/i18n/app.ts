// App (dashboard) localization dictionary — follows the visitor's chosen locale.
import type { Locale } from "./site";

export interface AppDict {
  common: { dashboard: string; signOut: string; planSuffix: string; upgrade: string; save: string; back: string };
  auth: {
    loginTitle: string; loginSubtitle: string;
    signupTitle: string; signupSubtitle: string;
    email: string; password: string;
    signIn: string; signUp: string; pleaseWait: string;
    noAccount: string; haveAccount: string;
    checkEmail: string;
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
}

const en: AppDict = {
  common: { dashboard: "Dashboard", signOut: "Sign out", planSuffix: "plan", upgrade: "Upgrade", save: "Save", back: "Back" },
  auth: {
    loginTitle: "Welcome back", loginSubtitle: "Sign in to manage your store assistant.",
    signupTitle: "Create your account", signupSubtitle: "Start building your store's AI support agent.",
    email: "Email", password: "Password",
    signIn: "Sign in", signUp: "Sign up", pleaseWait: "Please wait…",
    noAccount: "No account yet?", haveAccount: "Already have an account?",
    checkEmail: "Check your email to confirm your account, then sign in.",
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
};

const ru: AppDict = {
  common: { dashboard: "Кабинет", signOut: "Выйти", planSuffix: "тариф", upgrade: "Повысить", save: "Сохранить", back: "Назад" },
  auth: {
    loginTitle: "С возвращением", loginSubtitle: "Войдите, чтобы управлять ассистентом магазина.",
    signupTitle: "Создайте аккаунт", signupSubtitle: "Начните собирать ИИ-поддержку для своего магазина.",
    email: "Email", password: "Пароль",
    signIn: "Войти", signUp: "Зарегистрироваться", pleaseWait: "Подождите…",
    noAccount: "Ещё нет аккаунта?", haveAccount: "Уже есть аккаунт?",
    checkEmail: "Подтвердите аккаунт по письму на почте, затем войдите.",
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
};

const fr: AppDict = {
  common: { dashboard: "Tableau de bord", signOut: "Déconnexion", planSuffix: "offre", upgrade: "Améliorer", save: "Enregistrer", back: "Retour" },
  auth: {
    loginTitle: "Bon retour", loginSubtitle: "Connectez-vous pour gérer votre assistant.",
    signupTitle: "Créez votre compte", signupSubtitle: "Commencez à créer le support IA de votre boutique.",
    email: "E-mail", password: "Mot de passe",
    signIn: "Se connecter", signUp: "S'inscrire", pleaseWait: "Un instant…",
    noAccount: "Pas encore de compte ?", haveAccount: "Vous avez déjà un compte ?",
    checkEmail: "Confirmez votre compte via l'e-mail reçu, puis connectez-vous.",
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
};

const es: AppDict = {
  common: { dashboard: "Panel", signOut: "Cerrar sesión", planSuffix: "plan", upgrade: "Mejorar", save: "Guardar", back: "Atrás" },
  auth: {
    loginTitle: "Bienvenido de nuevo", loginSubtitle: "Inicia sesión para gestionar tu asistente.",
    signupTitle: "Crea tu cuenta", signupSubtitle: "Empieza a crear el soporte con IA de tu tienda.",
    email: "Email", password: "Contraseña",
    signIn: "Iniciar sesión", signUp: "Registrarse", pleaseWait: "Un momento…",
    noAccount: "¿Aún no tienes cuenta?", haveAccount: "¿Ya tienes cuenta?",
    checkEmail: "Confirma tu cuenta con el email recibido y luego inicia sesión.",
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
};

const de: AppDict = {
  common: { dashboard: "Dashboard", signOut: "Abmelden", planSuffix: "Plan", upgrade: "Upgraden", save: "Speichern", back: "Zurück" },
  auth: {
    loginTitle: "Willkommen zurück", loginSubtitle: "Melden Sie sich an, um Ihren Assistenten zu verwalten.",
    signupTitle: "Konto erstellen", signupSubtitle: "Erstellen Sie den KI-Support für Ihren Shop.",
    email: "E-Mail", password: "Passwort",
    signIn: "Anmelden", signUp: "Registrieren", pleaseWait: "Bitte warten…",
    noAccount: "Noch kein Konto?", haveAccount: "Schon ein Konto?",
    checkEmail: "Bestätigen Sie Ihr Konto über die E-Mail und melden Sie sich an.",
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
};

const APP_DICTS: Record<Locale, AppDict> = { en, ru, fr, es, de };

export function getAppDict(locale: Locale): AppDict {
  return APP_DICTS[locale] ?? en;
}

// Simple {key} interpolation helper.
export function tpl(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
