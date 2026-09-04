"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { usePublicCategories } from "@/lib/site/PublicCategoriesContext";
import {
  hoverLift,
  microTransition,
  scrollViewport,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

/**
 * Purely decorative kicker text ("Pure Extracts", "Sanitation", ...) — there
 * is no backend field for this (categories have no "eyebrow"/tagline
 * column), so unlike everything else on this page it can't come from the
 * API. Kept as local, per-locale UI copy rather than reintroducing a
 * duplicate content array — this is presentation chrome, not entity data.
 */
const EYEBROWS: Record<"en" | "fr", Record<string, string>> = {
  en: {
    cosmetics: "Pure Extracts",
    "food-hygiene": "Sanitation",
    "food-safety": "Certified",
    "foods-and-benefits": "Nutritional Profiles",
    "impact-of-therapeutic-treatment": "Traditional Remedies",
  },
  fr: {
    cosmetics: "Extraits Purs",
    "food-hygiene": "Assainissement",
    "food-safety": "Certifié",
    "foods-and-benefits": "Profils Nutritionnels",
    "impact-of-therapeutic-treatment": "Remèdes Traditionnels",
  },
};

export default function CategoryGrid() {
  const { locale } = useLocale();
  const t = ui[locale];
  const categories = usePublicCategories();

  return (
    <section
      id="categories"
      className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-4 py-24 sm:px-6 lg:px-16"
    >
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-center font-serif text-[32px] leading-10 font-bold text-brand-brown">
          {t.categoryGridHeading}
        </h2>
        <div className="h-1 w-16 rounded-full bg-brand-gold" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {categories.map((category) => (
          <motion.article
            key={category.slug}
            variants={staggerItem}
            whileHover={hoverLift}
            transition={microTransition}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-brand-line/30 bg-white shadow-[0_8px_30px_0_rgba(107,58,31,0.05)]"
          >
            <div className="relative h-64 w-full shrink-0 overflow-hidden">
              <Image
                src={category.heroImage}
                alt={category.heroImageAlt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-6 p-8">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <img src={category.iconUrl} alt="" aria-hidden="true" className="size-4" />
                  <span className="text-xs tracking-[1.2px] text-brand-gold-deep uppercase">
                    {EYEBROWS[locale][category.slug] ?? category.navLabel}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-brand-brown">{category.title}</h3>
                <p className="text-base leading-relaxed text-brand-muted">{category.description}</p>
              </div>
              <a
                href={`/${category.slug}`}
                className="inline-flex w-fit items-center gap-2 border-b-2 border-transparent pb-1.5 text-sm font-medium tracking-[0.7px] text-brand-rust transition-colors hover:border-brand-rust"
              >
                {t.learnMore}
                <img src="/mukalim/learn-more-arrow.svg" alt="" aria-hidden="true" className="h-[9px] w-3" />
              </a>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
