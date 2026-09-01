"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { localizeCategoryHero } from "@/lib/i18n/translations";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface CategoryHeroProps {
  categorySlug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export default function CategoryHero({
  categorySlug,
  title,
  description,
  image,
  imageAlt,
}: CategoryHeroProps) {
  const { locale } = useLocale();
  const localized = localizeCategoryHero(categorySlug, title, description, locale);

  return (
    <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden py-16 sm:min-h-[320px] sm:py-20 lg:min-h-[400px] lg:py-24">
      <div className="absolute inset-0">
        <Image src={image} alt={imageAlt} fill sizes="100vw" className="object-cover" />
      </div>
      {/* A flat dark scrim + blur (not a low-opacity multiply over a light
          banner) so heading/description contrast holds regardless of how
          light, dark, or visually busy the underlying category photo is.
          The blur specifically matters here — several category photos are
          high-detail/high-local-contrast (dried herbs, textured spices),
          and darkening alone doesn't stop letterforms from getting lost in
          that texture the way it does over the homepage Hero's softer photo. */}
      <div aria-hidden="true" className="absolute inset-0 bg-brand-ink/60 backdrop-blur-[2px]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_65%_at_50%_45%,rgba(0,0,0,0.55),transparent_75%)]"
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 text-center sm:px-10 lg:px-16"
      >
        <motion.h1
          variants={staggerItem}
          className="font-serif text-4xl font-bold tracking-tight text-brand-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:text-5xl"
        >
          {localized.title}
        </motion.h1>
        <motion.p
          variants={staggerItem}
          className="max-w-2xl text-base leading-relaxed text-brand-off-white drop-shadow-sm sm:text-lg"
        >
          {localized.description}
        </motion.p>
      </motion.div>
    </section>
  );
}
