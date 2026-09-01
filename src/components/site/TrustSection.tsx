"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import {
  duration,
  ease,
  scrollViewport,
  slideInRight,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

const FEATURE_ICONS = [
  { id: "organoleptic-testing", icon: "/mukalim/icon-taste.svg" },
  { id: "globally-sourced", icon: "/mukalim/icon-globe.svg" },
  { id: "panel-approved-quality", icon: "/mukalim/icon-panel.svg" },
];

export default function TrustSection() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useLocale();
  const t = ui[locale];
  const features = FEATURE_ICONS.map((feature, index) => ({
    ...feature,
    ...t.trust.features[index],
  }));

  return (
    <section className="relative overflow-hidden bg-brand-cream-alt px-4 py-24 sm:px-6 lg:px-16">
      {/* Decorative ambient shapes — static in the original design; given a slow,
          continuous drift here and frozen entirely for prefers-reduced-motion. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -right-48 -z-0 size-96 rounded-full bg-brand-gold/5 blur-3xl"
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, 24, -12, 0], y: [0, 16, -16, 0] }
        }
        transition={{
          duration: duration.ambient,
          repeat: Infinity,
          repeatType: "mirror",
          ease: ease.standard,
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-48 -z-0 size-96 rounded-full bg-[#fe8356]/5 blur-3xl"
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, -20, 14, 0], y: [0, -14, 18, 0] }
        }
        transition={{
          duration: duration.ambient * 1.3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: ease.standard,
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row lg:gap-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          className="flex flex-1 flex-col gap-4"
        >
          <motion.p
            variants={staggerItem}
            className="text-xs tracking-[1.2px] text-brand-gold-deep uppercase"
          >
            {t.trust.eyebrow}
          </motion.p>
          <motion.h2
            variants={staggerItem}
            className="font-serif text-[32px] leading-10 font-bold text-brand-brown"
          >
            {t.trust.heading}
          </motion.h2>

          <div className="flex flex-col gap-8 pt-8">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                variants={staggerItem}
                className="flex items-start gap-5"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-brand-line/30 bg-brand-sand">
                  <img
                    src={feature.icon}
                    alt=""
                    aria-hidden="true"
                    className="size-5"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold text-brand-ink">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-relaxed text-brand-muted">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          className="relative w-full max-w-md flex-1"
        >
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl border-8 border-white shadow-[0_20px_60px_0_rgba(107,58,31,0.15)]">
            <Image
              src="/mukalim/trust.jpg"
              alt="Weathered hands grinding spices by hand in a traditional stone mortar and pestle"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-xl border border-brand-line/20 bg-white p-5 shadow-[0_10px_20px_rgba(0,0,0,0.1)] sm:bottom-8 sm:-left-8">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-gold">
              <img
                src="/mukalim/icon-check.svg"
                alt=""
                aria-hidden="true"
                className="size-6"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-serif text-2xl leading-6 font-bold text-brand-brown">
                100%
              </p>
              <p className="text-xs tracking-[0.6px] text-brand-muted uppercase">
                {t.trust.certifiedPure}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
