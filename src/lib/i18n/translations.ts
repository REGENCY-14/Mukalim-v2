/**
 * Static UI chrome translations (English / French) — nav/footer labels,
 * form copy, empty states, etc. This file used to also carry a second,
 * hand-maintained layer of content translations (`categoryTranslationsFr`,
 * `homeCardTranslationsFr`, `articleTranslationsFr` + matching `localize*`
 * helpers) that patched French text onto the hardcoded English data in the
 * now-deleted `lib/categories.ts`. That's gone — category/article content
 * now comes from the real backend via `lib/publicApi.ts`, which resolves
 * `?locale=fr` server-side from actual `category_translations`/
 * `content_translations` rows, so there's nothing left for this file to
 * patch. Only genuinely backend-less UI copy remains here (see
 * `CategoryGrid.tsx`'s `EYEBROWS` for the one exception — a decorative
 * tagline with no backend field at all).
 *
 * The language switcher (see `TopNavBar`) is still client-side and doesn't
 * change the URL — it swaps a `locale` value held in `LocaleContext` and
 * persisted to localStorage. Components read UI strings through
 * `useLocale()` + `ui[locale]`; content components fetch their own
 * locale-specific data from `lib/publicApi.ts` (server-fetched English by
 * default for the initial paint, client-refetched when the visitor's
 * locale is French — see `CategoryHero`/`CategoryArticles`/`ArticleDetail`).
 */

export type Locale = "en" | "fr";

export const locales: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
];

export const ui = {
  en: {
    signIn: "Sign In",
    changeLanguage: "Change language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    hero: {
      heading: "Discover the World Through Spice",
      subtext:
        "Globally sourced, expertly tested ingredients that bring the warmth of traditional markets and the authority of culinary excellence to your creations.",
      cta: "Explore Our Categories",
    },
    categoryGridHeading: "Explore Our Categories",
    learnMore: "Learn More",
    trust: {
      eyebrow: "Our Commitment",
      heading: "Tested by Experts, Trusted Worldwide.",
      certifiedPure: "Certified Pure",
      features: [
        {
          title: "Organoleptic Testing",
          description:
            "Every batch undergoes rigorous sensory evaluation by master tasters to ensure authentic flavor profile and aroma intensity.",
        },
        {
          title: "Globally Sourced",
          description:
            "We travel to the specific terroir where each botanical thrives best, building sustainable relationships with traditional growers.",
        },
        {
          title: "Panel-Approved Quality",
          description:
            "Certified by international culinary and safety panels, guaranteeing our spices meet the highest industry standards.",
        },
      ],
    },
    footer: {
      description:
        "Discover the world through globally sourced, expertly tested artisanal spices. Bringing warmth and culinary authority to your kitchen.",
      quickLinksHeading: "Quick Links",
      quickLinks: ["About Us", "Our Process", "Sustainability", "Blog & Recipes"],
      categoriesHeading: "Categories",
      contactHeading: "Contact Info",
      // No hardcoded year — Footer.tsx prepends the current year at render
      // time so this never needs a manual bump.
      copyright: "MUKALIM. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
    filterBar: {
      filterBy: "Filter by:",
      allIngredients: "All Ingredients",
      sortBy: "Sort by:",
      newest: "Newest",
      oldest: "Oldest",
      aToZ: "A to Z",
      zToA: "Z to A",
    },
    alphabetAll: "All",
    alphabetFilterLabel: "Filter articles alphabetically",
    categoryArticles: {
      noMatch: "No articles match your filters.",
      clearFilters: "Clear filters",
      loadMore: "Load More Articles",
    },
    readArticle: "Read Article",
    articleDetail: {
      backTo: "Back to",
      published: "Published",
      moreIn: "More in",
      englishOnlyNote:
        "This article is currently available in English only — we're translating our full library into French.",
    },
    signInPage: {
      eyebrow: "Account Access",
      welcomeBack: "Welcome back",
      subtext: "Sign in to manage your account and support Mukalim's mission.",
      adminSubtext: "Sign in to access the Mukalim admin dashboard.",
      quote:
        "Every jar carries a hand that ground it, a season that grew it, and a story worth trusting.",
      quoteAttribution: "The Mukalim Method",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      forgotPassword: "Forgot password?",
      rememberMe: "Remember me",
      submit: "Sign In",
      submitting: "Signing In…",
      showPassword: "Show password",
      hidePassword: "Hide password",
      invalidCredentials: "Invalid email or password. Try the demo credentials below.",
      demoNote: "Exploring the admin dashboard?",
      demoAutofill: "Autofill the demo login",
      newHere: "New to Mukalim?",
      createAccount: "Create an account",
    },
    acceptInvitePage: {
      eyebrow: "Account Setup",
      heading: "Set Your Password",
      subtext: "Choose a password to activate your account and get started.",
      passwordLabel: "New Password",
      confirmPasswordLabel: "Confirm Password",
      passwordHint: "At least 8 characters.",
      passwordTooShort: "Password must be at least 8 characters.",
      passwordMismatch: "Passwords don't match.",
      showPassword: "Show password",
      hidePassword: "Hide password",
      submit: "Set Password & Sign In",
      submitting: "Setting up your account…",
      missingToken: "This invite link is missing its token — please use the exact link from your invite email.",
      invalidTokenTitle: "Invite link invalid",
      backToSignIn: "Back to sign in",
      contactAdmin: "If this link has expired, ask your admin to send you a new invite.",
    },
    forgotPasswordPage: {
      eyebrow: "Account Access",
      heading: "Reset Your Password",
      subtext: "Enter your email and we'll send you a link to reset your password.",
      emailLabel: "Email Address",
      submit: "Send Reset Link",
      submitting: "Sending…",
      backToSignIn: "Back to sign in",
    },
    resetPasswordPage: {
      eyebrow: "Account Access",
      heading: "Set a New Password",
      subtext: "Choose a new password for your account.",
      passwordLabel: "New Password",
      confirmPasswordLabel: "Confirm Password",
      passwordHint: "At least 8 characters.",
      passwordTooShort: "Password must be at least 8 characters.",
      passwordMismatch: "Passwords don't match.",
      showPassword: "Show password",
      hidePassword: "Hide password",
      submit: "Set New Password",
      submitting: "Setting new password…",
      missingToken: "This reset link is missing its token — please use the exact link from your email.",
      invalidTokenTitle: "Reset link invalid",
      backToSignIn: "Back to sign in",
      requestNewLink: "Request a new reset link",
    },
  },
  fr: {
    signIn: "Connexion",
    changeLanguage: "Changer de langue",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    hero: {
      heading: "Découvrez le Monde à Travers les Épices",
      subtext:
        "Des ingrédients sourcés dans le monde entier et rigoureusement testés, qui apportent la chaleur des marchés traditionnels et l'excellence culinaire à vos créations.",
      cta: "Explorer Nos Catégories",
    },
    categoryGridHeading: "Explorer Nos Catégories",
    learnMore: "En Savoir Plus",
    trust: {
      eyebrow: "Notre Engagement",
      heading: "Testé par des Experts, Reconnu dans le Monde Entier.",
      certifiedPure: "Pureté Certifiée",
      features: [
        {
          title: "Tests Organoleptiques",
          description:
            "Chaque lot fait l'objet d'une évaluation sensorielle rigoureuse par des maîtres goûteurs afin de garantir un profil aromatique authentique et une intensité olfactive optimale.",
        },
        {
          title: "Sourcé Mondialement",
          description:
            "Nous nous rendons dans le terroir spécifique où chaque plante s'épanouit le mieux, en établissant des relations durables avec les producteurs traditionnels.",
        },
        {
          title: "Qualité Approuvée par un Panel",
          description:
            "Certifiées par des panels culinaires et de sécurité internationaux, garantissant que nos épices répondent aux normes les plus élevées de l'industrie.",
        },
      ],
    },
    footer: {
      description:
        "Découvrez le monde à travers des épices artisanales sourcées mondialement et rigoureusement testées. Apportant chaleur et autorité culinaire à votre cuisine.",
      quickLinksHeading: "Liens Rapides",
      quickLinks: ["À Propos", "Notre Processus", "Durabilité", "Blog et Recettes"],
      categoriesHeading: "Catégories",
      contactHeading: "Coordonnées",
      copyright: "MUKALIM. Tous droits réservés.",
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation",
    },
    filterBar: {
      filterBy: "Filtrer par :",
      allIngredients: "Tous les Ingrédients",
      sortBy: "Trier par :",
      newest: "Plus récents",
      oldest: "Plus anciens",
      aToZ: "A à Z",
      zToA: "Z à A",
    },
    alphabetAll: "Tout",
    alphabetFilterLabel: "Filtrer les articles par ordre alphabétique",
    categoryArticles: {
      noMatch: "Aucun article ne correspond à vos filtres.",
      clearFilters: "Réinitialiser les filtres",
      loadMore: "Charger Plus d'Articles",
    },
    readArticle: "Lire l'Article",
    articleDetail: {
      backTo: "Retour à",
      published: "Publié le",
      moreIn: "Plus dans",
      englishOnlyNote:
        "Cet article est actuellement disponible uniquement en anglais — nous traduisons progressivement notre bibliothèque en français.",
    },
    signInPage: {
      eyebrow: "Accès au compte",
      welcomeBack: "Bon retour",
      subtext: "Connectez-vous pour gérer votre compte et soutenir la mission de Mukalim.",
      adminSubtext: "Connectez-vous pour accéder au tableau de bord d'administration Mukalim.",
      quote:
        "Chaque pot porte une main qui l'a broyé, une saison qui l'a cultivé, une histoire digne de confiance.",
      quoteAttribution: "La méthode Mukalim",
      emailLabel: "Adresse E-mail",
      passwordLabel: "Mot de Passe",
      forgotPassword: "Mot de passe oublié ?",
      rememberMe: "Se souvenir de moi",
      submit: "Se Connecter",
      submitting: "Connexion…",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      invalidCredentials: "E-mail ou mot de passe invalide. Essayez les identifiants de démonstration ci-dessous.",
      demoNote: "Vous découvrez le tableau de bord ?",
      demoAutofill: "Remplir avec les identifiants de démo",
      newHere: "Nouveau chez Mukalim ?",
      createAccount: "Créer un compte",
    },
    acceptInvitePage: {
      eyebrow: "Configuration du compte",
      heading: "Définissez votre mot de passe",
      subtext: "Choisissez un mot de passe pour activer votre compte et commencer.",
      passwordLabel: "Nouveau mot de passe",
      confirmPasswordLabel: "Confirmer le mot de passe",
      passwordHint: "Au moins 8 caractères.",
      passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères.",
      passwordMismatch: "Les mots de passe ne correspondent pas.",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      submit: "Définir le mot de passe et se connecter",
      submitting: "Configuration de votre compte…",
      missingToken: "Ce lien d'invitation n'a pas de jeton — veuillez utiliser le lien exact reçu par e-mail.",
      invalidTokenTitle: "Lien d'invitation invalide",
      backToSignIn: "Retour à la connexion",
      contactAdmin: "Si ce lien a expiré, demandez à votre administrateur de vous envoyer une nouvelle invitation.",
    },
    forgotPasswordPage: {
      eyebrow: "Accès au compte",
      heading: "Réinitialisez votre mot de passe",
      subtext: "Entrez votre e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
      emailLabel: "Adresse E-mail",
      submit: "Envoyer le lien de réinitialisation",
      submitting: "Envoi…",
      backToSignIn: "Retour à la connexion",
    },
    resetPasswordPage: {
      eyebrow: "Accès au compte",
      heading: "Définir un nouveau mot de passe",
      subtext: "Choisissez un nouveau mot de passe pour votre compte.",
      passwordLabel: "Nouveau mot de passe",
      confirmPasswordLabel: "Confirmer le mot de passe",
      passwordHint: "Au moins 8 caractères.",
      passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères.",
      passwordMismatch: "Les mots de passe ne correspondent pas.",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      submit: "Définir le nouveau mot de passe",
      submitting: "Définition du nouveau mot de passe…",
      missingToken: "Ce lien de réinitialisation n'a pas de jeton — veuillez utiliser le lien exact reçu par e-mail.",
      invalidTokenTitle: "Lien de réinitialisation invalide",
      backToSignIn: "Retour à la connexion",
      requestNewLink: "Demander un nouveau lien de réinitialisation",
    },
  },
} as const;

