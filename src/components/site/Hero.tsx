"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import {
  hoverScale,
  microTransition,
  staggerContainer,
  staggerItem,
  tapScale,
} from "@/lib/animations";

export default function Hero() {
  const { locale } = useLocale();
  const t = ui[locale];

  return (
    <section
      id="hero"
      className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-brand-sand/20 py-24 sm:py-32 lg:py-40"
    >
      <div className="absolute inset-0">
        <Image
          src="/mukalim/hero.jpg"
          alt="Overhead view of bowls filled with colorful spices, seeds, and botanicals"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-brand-ink/75 via-brand-ink/55 to-brand-ink/45 backdrop-blur-[1px]"
      />
      {/* Focused vignette behind the centered text block — keeps headline contrast
          readable no matter how bright the underlying photo is. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_45%,rgba(0,0,0,0.4),transparent_70%)]"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center sm:px-10 lg:px-16"
      >
        <motion.h1
          variants={staggerItem}
          className="mb-6 font-serif text-4xl font-bold leading-tight tracking-tight text-brand-cream drop-shadow-[0_4px_1.5px_rgba(0,0,0,0.1)] sm:text-5xl lg:text-6xl"
        >
          {t.hero.heading}
        </motion.h1>
        <motion.p
          variants={staggerItem}
          className="mb-10 max-w-2xl text-base leading-relaxed text-brand-off-white drop-shadow-sm sm:text-lg"
        >
          {t.hero.subtext}
        </motion.p>
        <motion.div variants={staggerItem}>
          <motion.a
            href="#categories"
            whileHover={hoverScale}
            whileTap={tapScale}
            transition={microTransition}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-8 py-4 text-sm font-medium tracking-[0.7px] text-[#5c4000] shadow-[0_8px_15px_rgba(225,169,60,0.3)]"
          >
            {t.hero.cta}
            <img
              src="/mukalim/arrow-right.svg"
              alt=""
              aria-hidden="true"
              className="size-4"
            />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
