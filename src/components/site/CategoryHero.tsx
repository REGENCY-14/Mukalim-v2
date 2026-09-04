"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { getPublicCategory, type PublicCategory } from "@/lib/publicApi";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface CategoryHeroProps {
  categorySlug: string;
  /** Server-fetched, always English — matches the "server/first-hydration
   * pass renders the default locale" pattern used everywhere else in this
   * app (LocaleContext, AdminAuthContext). Corrected client-side below when
   * the visitor's actual locale is French. */
  initialData: PublicCategory;
}

export default function CategoryHero({ categorySlug, initialData }: CategoryHeroProps) {
  const { locale } = useLocale();
  const [state, setState] = useState<{ locale: "en" | "fr"; data: PublicCategory }>({
    locale: "en",
    data: initialData,
  });

  // English is already known synchronously (server-fetched) — correct
  // during render rather than round-tripping through an effect (same
  // render-time-adjustment pattern as MediaDetailPanel.tsx's `lastMedia`).
  // Only French needs an actual effect, since only it needs a fetch.
  if (locale === "en" && state.locale !== "en") {
    setState({ locale: "en", data: initialData });
  }

  useEffect(() => {
    if (locale === "en") return;
    let cancelled = false;
    getPublicCategory(categorySlug, locale)
      .then((result) => {
        if (!cancelled) setState({ locale, data: result });
      })
      .catch(() => {
        // Leave the English version showing rather than blanking the hero.
      });
    return () => {
      cancelled = true;
    };
  }, [locale, categorySlug]);

  const data = state.data;

  return (
    <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden py-16 sm:min-h-[320px] sm:py-20 lg:min-h-[400px] lg:py-24">
      <div className="absolute inset-0">
        <Image src={data.heroImage} alt={data.heroImageAlt} fill sizes="100vw" className="object-cover" />
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
          {data.title}
        </motion.h1>
        <motion.p
          variants={staggerItem}
          className="max-w-2xl text-base leading-relaxed text-brand-off-white drop-shadow-sm sm:text-lg"
        >
          {data.description}
        </motion.p>
      </motion.div>
    </section>
  );
}
