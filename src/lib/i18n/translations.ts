/**
 * Site translations (English / French).
 *
 * The language switcher (see `TopNavBar`) is client-side and doesn't change
 * the URL — it swaps a `locale` value held in `LocaleContext` and persisted
 * to localStorage. Components read strings through `useLocale()` +
 * `ui[locale]`, or through the `localize*` helpers below for content that's
 * normally sourced from `lib/categories.ts` (which only holds English).
 *
 * Scope: all persistent UI chrome, the homepage, every category page header,
 * and every article's title/tag/excerpt are translated. Full article body
 * copy (the long-form paragraphs) is not yet translated — the article page
 * shows an honest note rather than silently mixing languages.
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
      copyright: "© 2024 MUKALIM. All rights reserved.",
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
      welcomeBack: "Welcome Back",
      subtext: "Sign in to manage your account and support Mukalim's mission.",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      forgotPassword: "Forgot password?",
      rememberMe: "Remember me",
      submit: "Sign In",
      showPassword: "Show password",
      hidePassword: "Hide password",
      invalidCredentials: "Invalid email or password. Try the demo credentials below.",
      useDemoCredentials: "Use demo credentials",
      adminSubtext: "Sign in to access the Mukalim admin dashboard.",
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
      copyright: "© 2024 MUKALIM. Tous droits réservés.",
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
      welcomeBack: "Bon Retour",
      subtext: "Connectez-vous pour gérer votre compte et soutenir la mission de Mukalim.",
      emailLabel: "Adresse E-mail",
      passwordLabel: "Mot de Passe",
      forgotPassword: "Mot de passe oublié ?",
      rememberMe: "Se souvenir de moi",
      submit: "Se Connecter",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      invalidCredentials: "E-mail ou mot de passe invalide. Essayez les identifiants de démonstration ci-dessous.",
      useDemoCredentials: "Utiliser les identifiants de démonstration",
      adminSubtext: "Connectez-vous pour accéder au tableau de bord d'administration Mukalim.",
    },
  },
} as const;

// ---------------------------------------------------------------------------
// Content translations — override the English data in `lib/categories.ts`.
// Only French entries are stored; English simply falls through to the
// original data, so there's no risk of the two English copies drifting.
// ---------------------------------------------------------------------------

interface CategoryTranslation {
  navLabel: string;
  title: string;
  description: string;
}

export const categoryTranslationsFr: Record<string, CategoryTranslation> = {
  cosmetics: {
    navLabel: "Cosmétiques",
    title: "Cosmétiques",
    description:
      "Découvrez les extraits botaniques et les ingrédients purs qui sous-tendent notre philosophie de soin — la vitalité de la nature, formulée avec retenue et soin.",
  },
  "food-hygiene": {
    navLabel: "Hygiène Alimentaire",
    title: "Hygiène Alimentaire",
    description:
      "Des normes rigoureuses et des solutions naturelles garantissant des conditions irréprochables, de la récolte à la manipulation — les pratiques qui assurent la sécurité de chaque lot.",
  },
  "food-safety": {
    navLabel: "Sécurité Alimentaire",
    title: "Sécurité Alimentaire",
    description:
      "Des protocoles rigoureusement testés qui garantissent une qualité sans compromis et la protection des consommateurs, vérifiés à chaque étape du parcours.",
  },
  "foods-and-benefits": {
    navLabel: "Aliments et Bienfaits",
    title: "Aliments et Bienfaits",
    description:
      "Découvrez les riches profils nutritionnels, les usages historiques et les bienfaits holistiques des meilleurs ingrédients de la nature, sélectionnés pour la cuisine artisanale moderne.",
  },
  "impact-of-therapeutic-treatment": {
    navLabel: "Impact du Traitement Thérapeutique",
    title: "Impact du Traitement Thérapeutique",
    description:
      "Découvrez les remèdes traditionnels et la recherche moderne derrière les plantes médicinales les plus respectées de la nature.",
  },
};

interface HomeCardTranslation {
  eyebrow: string;
  title: string;
  description: string;
}

export const homeCardTranslationsFr: Record<string, HomeCardTranslation> = {
  cosmetics: {
    eyebrow: "Extraits Purs",
    title: "Cosmétiques",
    description:
      "Des ingrédients botaniques conçus pour leur pureté, apportant une vitalité naturelle à des formulations de soin haut de gamme.",
  },
  "food-hygiene": {
    eyebrow: "Assainissement",
    title: "Hygiène Alimentaire",
    description:
      "Des normes rigoureuses et des solutions naturelles garantissant des conditions irréprochables, de la récolte à la manipulation.",
  },
  "food-safety": {
    eyebrow: "Certifié",
    title: "Sécurité Alimentaire",
    description:
      "Des protocoles rigoureusement testés qui garantissent une qualité sans compromis et la protection des consommateurs.",
  },
  "foods-and-benefits": {
    eyebrow: "Profils Nutritionnels",
    title: "Aliments et Bienfaits",
    description:
      "L'histoire riche et les bienfaits holistiques des meilleurs ingrédients de la nature, sélectionnés pour la cuisine moderne.",
  },
  "impact-of-therapeutic-treatment": {
    eyebrow: "Remèdes Traditionnels",
    title: "Impact du Traitement Thérapeutique",
    description:
      "Les remèdes traditionnels et la recherche moderne derrière les plantes médicinales les plus respectées de la nature.",
  },
};

interface ArticleTranslation {
  title: string;
  tag: string;
  excerpt: string;
}

/** Keyed as `${categorySlug}:${articleSlug}`. */
export const articleTranslationsFr: Record<string, ArticleTranslation> = {
  "cosmetics:aloe-vera-the-soothing-botanical": {
    title: "Aloe Vera : La Plante Apaisante",
    tag: "Botanique",
    excerpt:
      "Découvrez pourquoi le gel de cette plante succulente est prisé depuis des siècles comme base rafraîchissante et réparatrice pour les peaux sensibles.",
  },
  "cosmetics:eucalyptus-the-purifying-leaf": {
    title: "Eucalyptus : La Feuille Purifiante",
    tag: "Feuille",
    excerpt:
      "Découvrez les propriétés vives et clarifiantes de l'huile d'eucalyptus et son rôle dans des rituels de soin revigorants et purifiants.",
  },
  "cosmetics:lavender-the-calming-classic": {
    title: "Lavande : Le Classique Apaisant",
    tag: "Herbe",
    excerpt:
      "Explorez l'usage séculaire de la lavande séchée dans les baumes apaisants, et pourquoi son parfum reste un incontournable des soins réparateurs.",
  },
  "food-hygiene:cross-contamination-the-silent-risk": {
    title: "Contamination Croisée : Le Risque Silencieux",
    tag: "Sécurité",
    excerpt:
      "Comprenez comment les surfaces et outils partagés peuvent compromettre la pureté, et les protocoles que nous suivons pour garder chaque ingrédient isolé et propre.",
  },
  "food-hygiene:cold-chain-integrity": {
    title: "Intégrité de la Chaîne du Froid : Pourquoi la Température Compte",
    tag: "Stockage",
    excerpt:
      "Découvrez comment un stockage constant et contrôlé préserve la puissance des ingrédients et prévient leur détérioration, de la récolte jusqu'à votre cuisine.",
  },
  "food-hygiene:sanitizing-naturally": {
    title: "Assainir Naturellement : Antimicrobiens Botaniques",
    tag: "Hygiène",
    excerpt:
      "Découvrez les huiles et extraits d'origine végétale que nous utilisons pour assainir les surfaces sans produits chimiques synthétiques agressifs.",
  },
  "food-safety:haccp-explained": {
    title: "HACCP Expliqué : Notre Cadre Qualité",
    tag: "Norme",
    excerpt:
      "Un aperçu du système d'analyse des risques et de maîtrise des points critiques qui régit chaque lot que nous testons et libérons.",
  },
  "food-safety:traceability-from-farm-to-jar": {
    title: "Traçabilité : Du Champ au Bocal",
    tag: "Approvisionnement",
    excerpt:
      "Suivez le parcours d'un seul ingrédient, du champ du producteur jusqu'à l'étagère de votre cuisine, et les registres qui rendent cela possible.",
  },
  "food-safety:allergen-control": {
    title: "Contrôle des Allergènes : Protéger Chaque Lot",
    tag: "Sécurité",
    excerpt:
      "Comprenez les protocoles d'étiquetage et de contact croisé qui protègent les consommateurs sensibles sans compromettre la saveur.",
  },
  "foods-and-benefits:turmeric-the-golden-healer": {
    title: "Curcuma : Le Guérisseur Doré",
    tag: "Racine",
    excerpt:
      "Découvrez les puissantes propriétés anti-inflammatoires de la curcumine et comment intégrer cette racine ancestrale à votre rituel de bien-être quotidien.",
  },
  "foods-and-benefits:cardamom-queen-of-spices": {
    title: "Cardamome : La Reine des Épices",
    tag: "Épice",
    excerpt:
      "Explorez le profil aromatique complexe de la cardamome, ses bienfaits digestifs, et pourquoi elle occupe une place vénérée dans les traditions sucrées comme salées.",
  },
  "foods-and-benefits:matcha-antioxidant-powerhouse": {
    title: "Matcha : Concentré d'Antioxydants",
    tag: "Thé",
    excerpt:
      "Explorez la science derrière la L-théanine et les catéchines présentes dans le matcha de qualité cérémoniale, et son effet apaisant sur la concentration et l'énergie.",
  },
  "impact-of-therapeutic-treatment:ginger-ancient-remedy": {
    title: "Gingembre : Remède Ancestral pour un Bien-être Moderne",
    tag: "Racine",
    excerpt:
      "Découvrez pourquoi cette racine chauffante ancre la médecine traditionnelle depuis des millénaires, et ce que la recherche moderne révèle sur ses bienfaits.",
  },
  "impact-of-therapeutic-treatment:star-anise-the-digestive-aid": {
    title: "Anis Étoilé : L'Aide Digestive",
    tag: "Épice",
    excerpt:
      "Explorez l'usage traditionnel de l'anis étoilé pour apaiser la digestion, et les composés aromatiques à l'origine de sa réputation thérapeutique.",
  },
  "impact-of-therapeutic-treatment:ashwagandha-the-adaptogen-herb": {
    title: "Ashwagandha : La Plante Adaptogène",
    tag: "Herbe",
    excerpt:
      "Explorez la science derrière cet adaptogène vénéré et son rôle traditionnel dans le soutien de la réponse du corps au stress.",
  },
};

export function localizeCategory<
  T extends { slug: string; navLabel: string; title: string; description: string },
>(category: T, locale: Locale): T {
  if (locale !== "fr") return category;
  const fr = categoryTranslationsFr[category.slug];
  return fr ? { ...category, ...fr } : category;
}

export function localizeHomeCard<T extends { id: string; eyebrow: string; title: string; description: string }>(
  card: T,
  locale: Locale,
): T {
  if (locale !== "fr") return card;
  const fr = homeCardTranslationsFr[card.id];
  return fr ? { ...card, ...fr } : card;
}

/** Used by `CategoryHero` and `ArticleDetail`, which only need the title/description pair. */
export function localizeCategoryHero(
  categorySlug: string,
  title: string,
  description: string,
  locale: Locale,
): { title: string; description: string } {
  if (locale !== "fr") return { title, description };
  const fr = categoryTranslationsFr[categorySlug];
  return fr ? { title: fr.title, description: fr.description } : { title, description };
}

export function localizeArticle<T extends { slug: string; title: string; tag: string; excerpt: string }>(
  article: T,
  categorySlug: string,
  locale: Locale,
): T {
  if (locale !== "fr") return article;
  const fr = articleTranslationsFr[`${categorySlug}:${article.slug}`];
  return fr ? { ...article, ...fr } : article;
}
