"use client";

import { motion } from "framer-motion";
import { categories } from "@/lib/categories";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { localizeCategory, ui } from "@/lib/i18n/translations";
import { scrollReveal, scrollViewport, staggerContainer, staggerItem } from "@/lib/animations";

const SOCIALS = [
  { label: "Instagram", short: "IG" },
  { label: "Facebook", short: "FB" },
  { label: "LinkedIn", short: "IN" },
];

export default function Footer() {
  const { locale } = useLocale();
  const t = ui[locale];
  const categoryLinks = categories.map((category) => ({
    label: localizeCategory(category, locale).navLabel,
    href: `/${category.slug}`,
  }));

  return (
    <footer className="rounded-t-xl bg-brand-footer">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:px-16 lg:py-24"
      >
        <motion.div variants={staggerItem} className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
          <p className="font-serif text-2xl font-bold tracking-tight text-white">MUKALIM</p>
          <p className="max-w-sm text-base leading-relaxed text-brand-off-white/80">
            {t.footer.description}
          </p>
        </motion.div>

        <motion.div variants={staggerItem} className="flex flex-col gap-6">
          <h4 className="text-sm font-semibold tracking-[0.7px] text-brand-cream uppercase">
            {t.footer.quickLinksHeading}
          </h4>
          <ul className="flex flex-col gap-4">
            {t.footer.quickLinks.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-base text-brand-off-white/80 opacity-90 transition-opacity hover:opacity-100"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={staggerItem} className="flex flex-col gap-6">
          <h4 className="text-sm font-semibold tracking-[0.7px] text-brand-cream uppercase">
            {t.footer.categoriesHeading}
          </h4>
          <ul className="flex flex-col gap-4">
            {categoryLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-base text-brand-off-white/80 opacity-90 transition-opacity hover:opacity-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={staggerItem} className="flex flex-col gap-6">
          <h4 className="text-sm font-semibold tracking-[0.7px] text-brand-cream uppercase">
            {t.footer.contactHeading}
          </h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <img
                src="/mukalim/icon-pin.svg"
                alt=""
                aria-hidden="true"
                className="mt-1 h-[19px] w-[13px] shrink-0"
              />
              <span className="text-base text-brand-off-white/80">
                123 Spice Market Way,
                <br />
                Artisan District, NY 10001
              </span>
            </li>
            <li className="flex items-center gap-3">
              <img
                src="/mukalim/icon-mail.svg"
                alt=""
                aria-hidden="true"
                className="h-[13px] w-[17px] shrink-0"
              />
              <a
                href="mailto:hello@mukalim.com"
                className="text-base text-brand-off-white/80 transition-opacity hover:opacity-100"
              >
                hello@mukalim.com
              </a>
            </li>
          </ul>
          <div className="flex gap-4 pt-2">
            {SOCIALS.map((social) => (
              <a
                key={social.short}
                href="#"
                aria-label={social.label}
                className="flex size-10 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-brand-cream transition-colors hover:bg-white/20"
              >
                {social.short}
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={scrollReveal}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        className="border-t border-white/10"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between sm:px-6 lg:px-16">
          <p className="text-xs text-brand-off-white/60">{t.footer.copyright}</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-brand-off-white/60 transition-opacity hover:opacity-100">
              {t.footer.privacy}
            </a>
            <a href="#" className="text-xs text-brand-off-white/60 transition-opacity hover:opacity-100">
              {t.footer.terms}
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
