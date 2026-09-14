"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface PageHeroProps {
  eyebrow: string;
  heading: string;
  subtext: string;
  image: string;
  imageAlt: string;
}

/** Shared, shorter banner for static content pages (About, Our Process,
 * Sustainability, Blog & Recipes) — same visual language as the homepage's
 * `Hero`, but sized for a page that has real content below it rather than
 * being the entire above-the-fold moment. */
export default function PageHero({ eyebrow, heading, subtext, image, imageAlt }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-brand-sand/20 py-20 sm:py-28">
      <div className="absolute inset-0">
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-brand-ink/75 via-brand-ink/55 to-brand-ink/45 backdrop-blur-[1px]"
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center sm:px-10"
      >
        <motion.p
          variants={staggerItem}
          className="mb-4 text-xs font-semibold tracking-[1.2px] text-brand-gold uppercase"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          variants={staggerItem}
          className="mb-5 font-serif text-4xl font-bold leading-tight tracking-tight text-brand-cream drop-shadow-[0_4px_1.5px_rgba(0,0,0,0.1)] sm:text-5xl"
        >
          {heading}
        </motion.h1>
        <motion.p
          variants={staggerItem}
          className="max-w-2xl text-base leading-relaxed text-brand-off-white drop-shadow-sm sm:text-lg"
        >
          {subtext}
        </motion.p>
      </motion.div>
    </section>
  );
}
