"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { localizeHomeCard, ui } from "@/lib/i18n/translations";
import {
  hoverLift,
  microTransition,
  scrollViewport,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

const CATEGORIES = [
  {
    id: "cosmetics",
    eyebrow: "Pure Extracts",
    title: "Cosmetics",
    description:
      "Botanical ingredients crafted for purity, bringing natural vitality to premium skincare formulations.",
    icon: "/mukalim/icon-cosmetics.svg",
    image: "/mukalim/card-cosmetics.jpg",
    href: "/cosmetics",
  },
  {
    id: "food-hygiene",
    eyebrow: "Sanitation",
    title: "Food Hygiene",
    description:
      "Rigorous standards and natural solutions ensuring pristine conditions from harvest to handling.",
    icon: "/mukalim/icon-hygiene.svg",
    image: "/mukalim/card-hygiene.jpg",
    href: "/food-hygiene",
  },
  {
    id: "food-safety",
    eyebrow: "Certified",
    title: "Food Safety",
    description:
      "Expertly tested protocols that guarantee uncompromising quality and consumer protection.",
    icon: "/mukalim/icon-safety.svg",
    image: "/mukalim/card-safety.jpg",
    href: "/food-safety",
  },
  {
    id: "foods-and-benefits",
    eyebrow: "Nutritional Profiles",
    title: "Foods and Benefits",
    description:
      "The rich histories and holistic benefits of nature's finest ingredients, curated for the modern kitchen.",
    icon: "/mukalim/icon-foods-benefits.svg",
    image: "/mukalim/articles/fb-hero.jpg",
    href: "/foods-and-benefits",
  },
  {
    id: "impact-of-therapeutic-treatment",
    eyebrow: "Traditional Remedies",
    title: "Impact of Therapeutic Treatment",
    description:
      "Traditional remedies and modern research behind nature's most respected healing botanicals.",
    icon: "/mukalim/icon-therapeutic.svg",
    image: "/mukalim/trust.jpg",
    href: "/impact-of-therapeutic-treatment",
  },
];

export default function CategoryGrid() {
  const { locale } = useLocale();
  const t = ui[locale];
  const localizedCategories = CATEGORIES.map((category) => localizeHomeCard(category, locale));

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
        {localizedCategories.map((category) => (
          <motion.article
            key={category.id}
            variants={staggerItem}
            whileHover={hoverLift}
            transition={microTransition}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-brand-line/30 bg-white shadow-[0_8px_30px_0_rgba(107,58,31,0.05)]"
          >
            <div className="relative h-64 w-full shrink-0 overflow-hidden">
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-6 p-8">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <img
                    src={category.icon}
                    alt=""
                    aria-hidden="true"
                    className="size-4"
                  />
                  <span className="text-xs tracking-[1.2px] text-brand-gold-deep uppercase">
                    {category.eyebrow}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-brand-brown">
                  {category.title}
                </h3>
                <p className="text-base leading-relaxed text-brand-muted">
                  {category.description}
                </p>
              </div>
              <a
                href={category.href}
                className="inline-flex w-fit items-center gap-2 border-b-2 border-transparent pb-1.5 text-sm font-medium tracking-[0.7px] text-brand-rust transition-colors hover:border-brand-rust"
              >
                {t.learnMore}
                <img
                  src="/mukalim/learn-more-arrow.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-[9px] w-3"
                />
              </a>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
