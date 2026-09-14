"use client";

import { motion } from "framer-motion";
import TopNavBar from "@/components/site/TopNavBar";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { scrollViewport, staggerContainer, staggerItem } from "@/lib/animations";

export default function ProcessPageContent() {
  const { locale } = useLocale();
  const t = ui[locale].processPage;

  return (
    <>
      <TopNavBar />
      <main className="flex flex-1 flex-col pt-[88px]">
        <PageHero
          eyebrow={t.eyebrow}
          heading={t.heading}
          subtext={t.subtext}
          image="/mukalim/articles/art-lab.jpg"
          imageAlt="Lab equipment used for testing spice samples"
        />

        <section className="bg-brand-cream px-4 py-24 sm:px-6 lg:px-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
            className="mx-auto flex max-w-4xl flex-col gap-10"
          >
            {t.steps.map((step) => (
              <motion.div
                key={step.number}
                variants={staggerItem}
                className="flex gap-6 border-b border-brand-line/30 pb-10 last:border-b-0 last:pb-0 sm:gap-10"
              >
                <span className="font-serif text-4xl font-bold text-brand-gold-deep/40 sm:text-5xl">
                  {step.number}
                </span>
                <div className="flex flex-col gap-2 pt-1">
                  <h2 className="font-serif text-2xl font-semibold text-brand-ink">{step.title}</h2>
                  <p className="max-w-2xl text-base leading-relaxed text-brand-muted">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
