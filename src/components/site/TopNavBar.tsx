"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { usePublicCategories } from "@/lib/site/PublicCategoriesContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { locales, ui } from "@/lib/i18n/translations";
import { baseTransition, microTransition } from "@/lib/animations";

/** Matches the category page itself as well as its nested article pages
 * (e.g. `/cosmetics/aloe-vera-...`), so the parent tab stays highlighted. */
function isNavLinkActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function TopNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const t = ui[locale];
  const categories = usePublicCategories();

  const navLinks = categories.map((category) => ({
    label: category.navLabel,
    href: `/${category.slug}`,
  }));

  useEffect(() => {
    if (!isLangMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLangMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-brand-line/30 bg-brand-cream/90 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] backdrop-blur-md">
      <div className="mx-auto flex h-[88px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-16">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-md outline-offset-4"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* The logo image is a full wordmark lockup (icon + "MUKALIM"
              text), so it's rendered at its native aspect ratio instead of
              cropped into an icon-sized square — no separate text label
              needed alongside it. */}
          <Image
            src="/mukalim/logo.png"
            alt="Mukalim"
            width={178}
            height={100}
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>

        <ul className="hidden items-center gap-7 xl:flex">
          {navLinks.map((link) => {
            const isActive = isNavLinkActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative py-2 text-sm tracking-[0.7px] whitespace-nowrap transition-colors ${
                    isActive
                      ? "font-semibold text-brand-gold-deep"
                      : "font-medium text-brand-brown-deep hover:text-brand-rust"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left transition-transform duration-200 ease-out ${
                      isActive
                        ? "scale-x-100 bg-brand-gold-deep"
                        : "scale-x-0 bg-brand-rust group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <div ref={langMenuRef} className="relative hidden sm:block">
            <button
              type="button"
              aria-label={t.changeLanguage}
              aria-expanded={isLangMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsLangMenuOpen((open) => !open)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-2.5 text-xs font-medium tracking-[0.7px] text-brand-brown-deep transition-colors hover:bg-brand-sand ${
                isLangMenuOpen ? "bg-brand-sand" : ""
              }`}
            >
              <img src="/mukalim/icon-lang.svg" alt="" aria-hidden="true" className="size-4" />
              <span className="uppercase">{locale}</span>
            </button>

            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={microTransition}
                  className="absolute top-[calc(100%+8px)] right-0 z-10 w-40 overflow-hidden rounded-xl border border-brand-line/30 bg-white py-1.5 shadow-[0_8px_30px_0_rgba(107,58,31,0.15)]"
                >
                  {locales.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={locale === option.value}
                      onClick={() => {
                        setLocale(option.value);
                        setIsLangMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-brand-sand ${
                        locale === option.value
                          ? "font-semibold text-brand-gold-deep"
                          : "text-brand-brown-deep"
                      }`}
                    >
                      {option.label}
                      {locale === option.value && (
                        <span aria-hidden="true" className="text-brand-gold-deep">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/sign-in"
            aria-current={pathname === "/sign-in" ? "page" : undefined}
            className={`hidden rounded-full px-3 py-2.5 text-sm font-medium tracking-[0.7px] transition-colors xl:block ${
              pathname === "/sign-in"
                ? "bg-brand-sand text-brand-rust"
                : "text-brand-brown-deep hover:bg-brand-sand hover:text-brand-rust"
            }`}
          >
            {t.signIn}
          </Link>

          <button
            type="button"
            aria-label={isMenuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="ml-1 flex size-10 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full text-brand-brown-deep transition-colors hover:bg-brand-sand xl:hidden"
          >
            <motion.span
              className="h-[1.6px] w-5 rounded-full bg-current"
              animate={isMenuOpen ? { rotate: 45, y: 6.6 } : { rotate: 0, y: 0 }}
              transition={microTransition}
            />
            <motion.span
              className="h-[1.6px] w-5 rounded-full bg-current"
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={microTransition}
            />
            <motion.span
              className="h-[1.6px] w-5 rounded-full bg-current"
              animate={isMenuOpen ? { rotate: -45, y: -6.6 } : { rotate: 0, y: 0 }}
              transition={microTransition}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={baseTransition}
            className="overflow-hidden border-t border-brand-line/30 bg-brand-cream xl:hidden"
          >
            <ul className="flex flex-col px-4 py-2 sm:px-6">
              {navLinks.map((link) => {
                const isActive = isNavLinkActive(pathname, link.href);
                return (
                  <li key={link.href} className="border-b border-brand-line/20 last:border-b-0">
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-3.5 text-sm tracking-[0.7px] transition-colors ${
                        isActive
                          ? "font-semibold text-brand-gold-deep"
                          : "font-medium text-brand-brown-deep hover:text-brand-rust"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/sign-in"
                  aria-current={pathname === "/sign-in" ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-3.5 text-sm tracking-[0.7px] transition-colors ${
                    pathname === "/sign-in"
                      ? "font-semibold text-brand-gold-deep"
                      : "font-medium text-brand-brown-deep hover:text-brand-rust"
                  }`}
                >
                  {t.signIn}
                </Link>
              </li>
              <li className="border-t border-brand-line/20 pt-2">
                <p className="px-0 pt-2 pb-1 text-xs font-medium tracking-[0.7px] text-brand-brown-deep/70 uppercase">
                  {t.changeLanguage}
                </p>
                <div className="flex gap-2 pb-3">
                  {locales.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={locale === option.value}
                      onClick={() => setLocale(option.value)}
                      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                        locale === option.value
                          ? "bg-brand-gold-deep text-white"
                          : "bg-brand-sand text-brand-brown-deep"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
