/**
 * Category listing pages (Cosmetics, Food Hygiene, Food Safety, Foods and
 * Benefits, Impact of Therapeutic Treatment) all share one template —
 * `src/app/[category]/page.tsx` — driven by this data.
 *
 * Only "Foods and Benefits" content (title, description, articles) came from
 * the Figma design. The other four categories are populated with clearly
 * illustrative placeholder articles so every nav tab resolves to a complete
 * page; swap in real content/images per category when it's ready.
 *
 * `publishedAt` (ISO date) backs the "Newest"/"Oldest" sort in the filter bar
 * — see `src/components/site/CategoryArticles.tsx`.
 */

export interface CategoryArticle {
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  publishedAt: string;
  /** Paragraphs shown on the article detail page (`/[category]/[article]`). */
  body: string[];
}

export interface CategoryPageData {
  slug: string;
  navLabel: string;
  title: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  articles: CategoryArticle[];
}

export const categories: CategoryPageData[] = [
  {
    slug: "cosmetics",
    navLabel: "Cosmetics",
    title: "Cosmetics",
    description:
      "Discover the botanical extracts and pure ingredients behind our skincare philosophy — nature's vitality, formulated with restraint and care.",
    heroImage: "/mukalim/articles/cosmetics-hero.jpg",
    heroImageAlt: "Bundles of dried botanicals and herbs hanging at a market stall",
    articles: [
      {
        slug: "aloe-vera-the-soothing-botanical",
        title: "Aloe Vera: The Soothing Botanical",
        tag: "Botanical",
        excerpt:
          "Discover why this succulent's gel has been prized for centuries as a cooling, restorative base for sensitive skin formulations.",
        image: "/mukalim/articles/art-aloe.jpg",
        imageAlt: "Close-up of aloe vera plant leaves",
        publishedAt: "2026-08-25",
        body: [
          "Aloe vera has been cultivated for its skin-soothing properties since antiquity, prized across Egyptian, Greek, and Indian traditions alike as a first response to sun-exposed or irritated skin.",
          "The gel drawn from its thick, fleshy leaves is rich in polysaccharides and vitamins that help skin retain moisture without leaving a heavy residue — a quality that makes it an unusually versatile base for both leave-on treatments and rinse-off masks.",
          "In our formulations, we source aloe from growers who harvest by hand at peak maturity, when the gel's cooling compounds are most concentrated, then cold-process it to preserve its natural enzymes.",
          "The result is a botanical base that calms as effectively as it hydrates — the reason it remains, centuries on, one of skincare's most trusted ingredients.",
        ],
      },
      {
        slug: "eucalyptus-the-purifying-leaf",
        title: "Eucalyptus: The Purifying Leaf",
        tag: "Leaf",
        excerpt:
          "Explore the crisp, clarifying properties of eucalyptus oil and its role in invigorating, purifying skincare rituals.",
        image: "/mukalim/articles/art-eucalyptus.jpg",
        imageAlt: "Eucalyptus branch against a neutral backdrop",
        publishedAt: "2026-08-10",
        body: [
          "Native to Australia and now grown across temperate climates worldwide, eucalyptus has long been valued for the crisp, camphoraceous oil held within its silvery leaves.",
          "That oil carries natural clarifying properties, making it a favorite in formulations designed to invigorate tired skin and cut through congestion without stripping the skin's natural barrier.",
          "We steam-distill our eucalyptus leaf in small batches to capture its essential oil at full potency, then blend it at concentrations gentle enough for daily use.",
          "A few drops go a long way — the reason a single branch of eucalyptus can scent an entire formulation with its unmistakable, purifying freshness.",
        ],
      },
      {
        slug: "lavender-the-calming-classic",
        title: "Lavender: The Calming Classic",
        tag: "Herb",
        excerpt:
          "Unpack the centuries-old use of dried lavender in soothing balms, and why its aroma remains a staple of restorative skincare.",
        image: "/mukalim/articles/art-lavender.jpg",
        imageAlt: "A bundle of dried lavender flowers",
        publishedAt: "2026-07-22",
        body: [
          "Dried lavender has anchored calming rituals for centuries, from Roman bathhouses to modern apothecaries, prized as much for its fragrance as for its gentle effect on stressed, reactive skin.",
          "The flower's essential oil contains linalool and linalyl acetate, compounds studied for their soothing properties — part of why lavender remains a staple in formulations meant to unwind the skin as much as the mind.",
          "We harvest our lavender at the height of bloom, when its oil content peaks, then dry the bundles slowly to preserve both color and scent.",
          "The result is a botanical that does double duty: a calming active for the skin, and a ritual in itself each time the jar is opened.",
        ],
      },
    ],
  },
  {
    slug: "food-hygiene",
    navLabel: "Food Hygiene",
    title: "Food Hygiene",
    description:
      "Rigorous standards and natural solutions ensuring pristine conditions from harvest to handling — the practices that keep every batch safe.",
    heroImage: "/mukalim/card-hygiene.jpg",
    heroImageAlt: "A clean, sunlit kitchen counter",
    articles: [
      {
        slug: "cross-contamination-the-silent-risk",
        title: "Cross-Contamination: The Silent Risk",
        tag: "Safety",
        excerpt:
          "Understand how shared surfaces and tools can compromise purity, and the protocols we follow to keep every ingredient isolated and clean.",
        image: "/mukalim/articles/art-kitchen.jpg",
        imageAlt: "A clean, modern kitchen counter and cabinetry",
        publishedAt: "2026-08-27",
        body: [
          "Cross-contamination rarely announces itself — a shared cutting board, an unwashed scoop, a storage bin reused between batches — yet it's one of the most common ways purity is compromised before a product ever reaches the shelf.",
          "Our facilities separate ingredient families at every stage of handling, from intake through packaging, with dedicated tools and surfaces for each category we process.",
          "Staff follow color-coded protocols that make cross-use immediately visible to anyone on the floor, turning a risk that's usually invisible into one that's easy to catch.",
          "It's unglamorous work, but it's the foundation every other quality claim we make depends on.",
        ],
      },
      {
        slug: "cold-chain-integrity",
        title: "Cold Chain Integrity: Why Temperature Matters",
        tag: "Storage",
        excerpt:
          "Explore how consistent, controlled storage preserves potency and prevents spoilage from harvest all the way to your kitchen.",
        image: "/mukalim/articles/art-jarshelf.jpg",
        imageAlt: "Rows of glass apothecary jars on a shelf",
        publishedAt: "2026-08-12",
        body: [
          "Many of the compounds that give spices and botanicals their potency — volatile oils, delicate pigments, active constituents — begin to degrade the moment they're exposed to heat, light, or fluctuating humidity.",
          "Maintaining a consistent cold chain from harvest through storage slows that degradation dramatically, which is why we track temperature and humidity at every handoff, not just at the warehouse door.",
          "Ingredients that require it are stored in climate-controlled rooms set to the specific range each botanical needs, rather than a single one-size-fits-all setting.",
          "The difference shows up in the final product: brighter color, fuller aroma, and a shelf life that holds up to what the label promises.",
        ],
      },
      {
        slug: "sanitizing-naturally",
        title: "Sanitizing Naturally: Botanical Antimicrobials",
        tag: "Hygiene",
        excerpt:
          "Discover the plant-derived oils and extracts we use to sanitize surfaces without harsh synthetic chemicals.",
        image: "/mukalim/articles/art-essentialoil.jpg",
        imageAlt: "A hand holding a small bottle of essential oil",
        publishedAt: "2026-07-28",
        body: [
          "Harsh synthetic sanitizers can leave residues that linger on porous surfaces — a particular concern in a facility handling ingredients meant to be consumed or applied to skin.",
          "We rely instead on plant-derived antimicrobials, including thyme and tea tree oil concentrates, which offer meaningful antimicrobial activity without the residue risk of conventional chemical cleaners.",
          "These botanicals are rotated and combined based on current food-safety guidance, always validated against the same efficacy standards we'd expect of any sanitizing agent.",
          "It's a slower, more deliberate approach to hygiene — one that treats the products we're protecting as carefully as the surfaces we're cleaning.",
        ],
      },
    ],
  },
  {
    slug: "food-safety",
    navLabel: "Food Safety",
    title: "Food Safety",
    description:
      "Expertly tested protocols that guarantee uncompromising quality and consumer protection, verified at every stage of the journey.",
    heroImage: "/mukalim/card-safety.jpg",
    heroImageAlt: "Cinnamon sticks and dried spices",
    articles: [
      {
        slug: "haccp-explained",
        title: "HACCP Explained: Our Quality Framework",
        tag: "Standard",
        excerpt:
          "A look inside the Hazard Analysis and Critical Control Points system that governs every batch we test and release.",
        image: "/mukalim/articles/art-lab.jpg",
        imageAlt: "A lab technician testing samples with a pipette",
        publishedAt: "2026-08-29",
        body: [
          "Hazard Analysis and Critical Control Points, or HACCP, is a systematic framework for identifying where contamination risk is highest in a process, then building controls specifically around those points rather than inspecting only at the end.",
          "For us, that means mapping every step from raw ingredient intake to final packaging, flagging critical control points — like moisture thresholds or metal detection — and setting measurable limits at each one.",
          "Every batch is logged against this framework, with records kept well beyond what regulation requires, so any question about a specific lot can be answered with data, not guesswork.",
          "It's less a certificate on the wall than a discipline built into how every batch moves through the facility.",
        ],
      },
      {
        slug: "traceability-from-farm-to-jar",
        title: "Traceability: From Farm to Jar",
        tag: "Sourcing",
        excerpt:
          "Follow the journey of a single ingredient from the grower's field to your kitchen shelf, and the records that make it possible.",
        image: "/mukalim/articles/art-farmer.jpg",
        imageAlt: "A farmer working in a green field",
        publishedAt: "2026-08-18",
        body: [
          "A single jar on our shelf can be traced back to the specific farm, harvest date, and processing batch it came from — a chain of custody we maintain from the moment an ingredient leaves the ground.",
          "That traceability isn't just a safety net for recalls; it's how we verify the sourcing claims on our labels are actually true, lot by lot.",
          "We work directly with growers wherever possible, which shortens the chain considerably compared to sourcing through intermediaries where records can get thin.",
          "When you can name the field an ingredient came from, quality stops being a marketing claim and becomes something you can actually stand behind.",
        ],
      },
      {
        slug: "allergen-control",
        title: "Allergen Control: Protecting Every Batch",
        tag: "Safety",
        excerpt:
          "Understand the labeling and cross-contact protocols that protect sensitive consumers without compromising flavor.",
        image: "/mukalim/articles/art-pantryjars.jpg",
        imageAlt: "Rows of labeled jars of preserved foods",
        publishedAt: "2026-08-02",
        body: [
          "Allergen management starts long before a product reaches packaging — with how ingredients are received, stored, and moved through a facility that handles a wide range of botanicals.",
          "We maintain strict segregation for known allergens, dedicated equipment where cross-contact risk is highest, and validated cleaning protocols between runs that share equipment.",
          "Labeling reflects not just what's intentionally included, but a rigorous assessment of what could plausibly cross-contact during processing — because a label is only as trustworthy as the process behind it.",
          "For the people relying on us to get this right, there's no acceptable margin for shortcuts.",
        ],
      },
    ],
  },
  {
    slug: "foods-and-benefits",
    navLabel: "Foods and Benefits",
    title: "Foods and Benefits",
    description:
      "Explore the rich nutritional profiles, historical uses, and holistic benefits of nature's finest ingredients, curated for the modern artisanal kitchen.",
    heroImage: "/mukalim/articles/fb-hero.jpg",
    heroImageAlt: "A covered alley in a spice market lined with stalls",
    articles: [
      {
        slug: "turmeric-the-golden-healer",
        title: "Turmeric: The Golden Healer",
        tag: "Root",
        excerpt:
          "Discover the powerful anti-inflammatory properties of curcumin and how to integrate this ancient root into your daily wellness ritual.",
        image: "/mukalim/articles/art-turmeric.jpg",
        imageAlt: "Piles of colorful ground spices at a spice market",
        publishedAt: "2026-08-28",
        body: [
          "Turmeric's golden hue comes from curcumin, the compound responsible for both its color and much of the scientific interest surrounding this ancient root.",
          "Used for millennia across South Asian cooking and traditional medicine alike, turmeric has earned renewed attention for curcumin's anti-inflammatory properties, though the compound is notoriously difficult for the body to absorb on its own.",
          "Pairing turmeric with black pepper's piperine, or a source of healthy fat, meaningfully improves absorption — a detail traditional preparations often got right long before the biochemistry was understood.",
          "Whether stirred into a warm milk ritual or blended into a savory spice mix, turmeric remains one of the most quietly powerful roots in the pantry.",
        ],
      },
      {
        slug: "cardamom-queen-of-spices",
        title: "Cardamom: Queen of Spices",
        tag: "Spice",
        excerpt:
          "Explore the complex flavor profile of cardamom, its digestive benefits, and why it holds a revered place in both sweet and savory traditions.",
        image: "/mukalim/articles/art-cardamom.jpg",
        imageAlt: "A pile of dried cardamom pods",
        publishedAt: "2026-08-15",
        body: [
          "Cardamom's complex, slightly citrusy warmth has earned it a place in cuisines as varied as Scandinavian baking and Middle Eastern coffee — a versatility few spices can claim.",
          "Beyond flavor, cardamom has a long history in traditional digestive remedies, valued for its carminative properties that ease bloating and support digestion after a rich meal.",
          "Its essential oils are concentrated in the small black seeds housed within each pod, which is why whole pods retain their potency far longer than pre-ground cardamom.",
          "For the freshest flavor, we recommend cracking pods just before use — a small ritual that unlocks the aromatic intensity this spice is prized for.",
        ],
      },
      {
        slug: "matcha-antioxidant-powerhouse",
        title: "Matcha: Antioxidant Powerhouse",
        tag: "Tea",
        excerpt:
          "Unpack the science behind L-theanine and catechins found in ceremonial grade matcha, and its calming effect on focus and energy.",
        image: "/mukalim/articles/art-matcha.jpg",
        imageAlt: "Matcha powder with a bamboo whisk and chopsticks",
        publishedAt: "2026-07-30",
        body: [
          "Unlike steeped green tea, matcha is made from whole, shade-grown tea leaves ground into a fine powder — meaning you consume the entire leaf, not just what dissolves into the water.",
          "That distinction matters: matcha delivers significantly higher concentrations of catechins, particularly EGCG, along with L-theanine, an amino acid known for promoting calm, focused alertness rather than the jittery edge of coffee.",
          "Ceremonial grade matcha, reserved for whisking rather than baking, comes from the youngest, most tender leaves — the reason its color and flavor are noticeably more vibrant than culinary-grade powder.",
          "A traditionally whisked bowl of matcha isn't just a beverage; it's a slow ritual built around a plant with genuinely exceptional nutritional density.",
        ],
      },
    ],
  },
  {
    slug: "impact-of-therapeutic-treatment",
    navLabel: "Impact of Therapeutic Treatment",
    title: "Impact of Therapeutic Treatment",
    description:
      "Explore the traditional remedies and modern research behind nature's most respected healing botanicals.",
    heroImage: "/mukalim/trust.jpg",
    heroImageAlt: "Hands grinding spices with a mortar and pestle",
    articles: [
      {
        slug: "ginger-ancient-remedy",
        title: "Ginger: Ancient Remedy for Modern Wellness",
        tag: "Root",
        excerpt:
          "Discover why this warming root has anchored traditional medicine for millennia, and what modern research reveals about its benefits.",
        image: "/mukalim/articles/art-ginger.jpg",
        imageAlt: "A pile of fresh ginger root",
        publishedAt: "2026-08-26",
        body: [
          "Ginger's warming, slightly peppery bite has made it a fixture of traditional medicine across Asia, Africa, and beyond for thousands of years, most notably as a remedy for nausea and digestive discomfort.",
          "Modern research has largely validated that traditional use, with gingerol — the compound responsible for ginger's characteristic heat — shown to support digestion and ease inflammation.",
          "Fresh ginger and dried ginger aren't interchangeable in effect: drying concentrates certain compounds while diminishing others, which is why traditional preparations often specify one or the other for a given use.",
          "Whether steeped as tea or grated into a meal, ginger remains one of the most well-studied roots in traditional medicine.",
        ],
      },
      {
        slug: "star-anise-the-digestive-aid",
        title: "Star Anise: The Digestive Aid",
        tag: "Spice",
        excerpt:
          "Explore the traditional use of star anise in soothing digestion, and the aromatic compounds behind its therapeutic reputation.",
        image: "/mukalim/articles/art-staranise.jpg",
        imageAlt: "Close-up of whole star anise pods",
        publishedAt: "2026-08-14",
        body: [
          "This star-shaped pod, native to southern China, carries an anise-like sweetness driven by anethole, the same aromatic compound found in fennel and licorice root.",
          "Traditionally brewed as a tea after meals, star anise has long been used to ease digestive discomfort and bloating, a use consistent with anethole's documented carminative effects.",
          "It's also the source of shikimic acid, a compound with broader pharmaceutical significance, underscoring how much modern medicine still draws from traditional botanical knowledge.",
          "A single pod steeped in hot water is often all it takes to experience the aromatic warmth this spice has offered for centuries.",
        ],
      },
      {
        slug: "ashwagandha-the-adaptogen-herb",
        title: "Ashwagandha: The Adaptogen Herb",
        tag: "Herb",
        excerpt:
          "Unpack the science behind this revered adaptogen and its traditional role in supporting the body's response to stress.",
        image: "/mukalim/articles/art-ashwagandha.jpg",
        imageAlt: "Green ashwagandha plant leaves",
        publishedAt: "2026-07-31",
        body: [
          "Ashwagandha has anchored Ayurvedic medicine for over 3,000 years, classified as a rasayana — a category of herbs traditionally used to promote vitality and resilience over time.",
          "In contemporary terms, it's best known as an adaptogen: a class of botanicals studied for their potential to help the body maintain balance under stress, rather than targeting a single symptom.",
          "The root, rather than the leaf, carries the withanolides most associated with ashwagandha's traditional use — which is why quality preparations specify root-only sourcing.",
          "It's a slow-acting herb by design, traditionally taken consistently over weeks rather than as a one-time remedy — patience being very much part of its use.",
        ],
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): CategoryPageData | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getAllCategorySlugs(): string[] {
  return categories.map((category) => category.slug);
}

export function getArticleBySlug(
  categorySlug: string,
  articleSlug: string,
): { category: CategoryPageData; article: CategoryArticle } | undefined {
  const category = getCategoryBySlug(categorySlug);
  const article = category?.articles.find((item) => item.slug === articleSlug);
  if (!category || !article) return undefined;
  return { category, article };
}

export function getAllArticleParams(): { category: string; article: string }[] {
  return categories.flatMap((category) =>
    category.articles.map((article) => ({ category: category.slug, article: article.slug })),
  );
}

/** Other articles in the same category, for a "More in {category}" section. */
export function getRelatedArticles(
  categorySlug: string,
  excludeArticleSlug: string,
): CategoryArticle[] {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  return category.articles.filter((article) => article.slug !== excludeArticleSlug);
}
