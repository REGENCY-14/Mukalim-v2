"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TopNavBar from "@/components/site/TopNavBar";
import Footer from "@/components/site/Footer";
import PageHero from "@/components/site/PageHero";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { scrollReveal, scrollViewport, slideInRight, staggerContainer, staggerItem } from "@/lib/animations";

export default function AboutPageContent() {
  const { locale } = useLocale();
  const t = ui[locale].aboutPage;

  return (
    <>
      <TopNavBar />
      <main className="flex flex-1 flex-col pt-[88px]">
        <PageHero
          eyebrow={t.eyebrow}
          heading={t.heading}
          subtext={t.subtext}
          image="/mukalim/articles/art-farmer.jpg"
          imageAlt="A farmer inspecting harvested botanicals by hand in the field"
        />

        <section className="bg-brand-cream px-4 py-24 sm:px-6 lg:px-16">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row lg:gap-24">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              className="flex flex-1 flex-col gap-4"
            >
              <motion.p variants={staggerItem} className="text-xs tracking-[1.2px] text-brand-gold-deep uppercase">
                {t.storyEyebrow}
              </motion.p>
              <motion.h2 variants={staggerItem} className="font-serif text-[32px] leading-10 font-bold text-brand-brown">
                {t.storyHeading}
              </motion.h2>
              <div className="flex flex-col gap-5 pt-4">
                {t.storyParagraphs.map((paragraph) => (
                  <motion.p key={paragraph} variants={staggerItem} className="text-base leading-relaxed text-brand-muted">
                    {paragraph}
                  </motion.p>
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
                  src="/mukalim/articles/art-jarshelf.jpg"
                  alt="Shelves of labeled spice jars ready for distribution"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-brand-cream-alt px-4 py-24 sm:px-6 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <motion.h2
              variants={scrollReveal}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              className="mb-12 text-center font-serif text-[32px] leading-10 font-bold text-brand-brown"
            >
              {t.valuesHeading}
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              {t.values.map((value) => (
                <motion.div
                  key={value.title}
                  variants={staggerItem}
                  className="flex flex-col gap-3 rounded-2xl border border-brand-line/30 bg-white p-8 shadow-[0_4px_20px_0_rgba(107,58,31,0.06)]"
                >
                  <h3 className="font-serif text-xl font-semibold text-brand-ink">{value.title}</h3>
                  <p className="text-base leading-relaxed text-brand-muted">{value.description}</p>
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
