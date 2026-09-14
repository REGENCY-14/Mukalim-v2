"use client";

import { motion } from "framer-motion";
import TopNavBar from "@/components/site/TopNavBar";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { scrollReveal, scrollViewport, staggerContainer, staggerItem } from "@/lib/animations";

export default function SustainabilityPageContent() {
  const { locale } = useLocale();
  const t = ui[locale].sustainabilityPage;

  return (
    <>
      <TopNavBar />
      <main className="flex flex-1 flex-col pt-[88px]">
        <PageHero
          eyebrow={t.eyebrow}
          heading={t.heading}
          subtext={t.subtext}
          image="/mukalim/articles/cosmetics-hero.jpg"
          imageAlt="Botanicals and natural ingredients laid out on a wooden surface"
        />

        <section className="bg-brand-cream-alt px-4 py-24 sm:px-6 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <motion.h2
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              className="mb-12 text-center font-serif text-[32px] leading-10 font-bold text-brand-brown"
            >
              {t.commitmentsHeading}
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2"
            >
              {t.commitments.map((commitment) => (
                <motion.div
                  key={commitment.title}
                  variants={staggerItem}
                  className="flex items-start gap-5 rounded-2xl border border-brand-line/30 bg-white p-8 shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-brand-line/30 bg-brand-sand">
                    <img src="/mukalim/icon-check.svg" alt="" aria-hidden="true" className="size-5" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-serif text-xl font-semibold text-brand-ink">{commitment.title}</h3>
                    <p className="text-base leading-relaxed text-brand-muted">{commitment.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
