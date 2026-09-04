"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { PublicArticleSummary } from "@/lib/publicApi";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { duration, ease, hoverLift, microTransition } from "@/lib/animations";

const MotionLink = motion.create(Link);

interface ArticleCardProps {
  article: PublicArticleSummary;
  categorySlug: string;
  /** Stagger index — mirrors staggerContainer's timing (0.04s + 0.08s per item)
   * so cards still stagger in on filter/sort changes, driven independently of
   * each other (required for AnimatePresence to animate individual add/remove). */
  index?: number;
}

export default function ArticleCard({ article, categorySlug, index = 0 }: ArticleCardProps) {
  const { locale } = useLocale();
  const t = ui[locale];

  return (
    <MotionLink
      href={`/${categorySlug}/${article.slug}`}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: duration.base, ease: ease.standard, delay: 0.04 + index * 0.08 },
      }}
      exit={{ opacity: 0, y: -12, transition: { duration: duration.fast, ease: ease.standard } }}
      whileHover={{ ...hoverLift, transition: microTransition }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-brand-line/30 bg-brand-cream shadow-[0_4px_24px_0_rgba(107,58,31,0.1)] outline-offset-4"
    >
      <div className="relative h-56 w-full shrink-0 overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 rounded-full bg-[#e7a380] px-3 py-0.5 text-xs text-[#69381d] shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          {article.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 p-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-2xl font-semibold text-brand-ink">
            {article.title}
          </h2>
          <p className="line-clamp-3 text-base leading-relaxed text-brand-brown-deep">
            {article.excerpt}
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 pt-2 text-sm font-medium tracking-[0.7px] text-brand-gold-deep transition-colors group-hover:text-brand-rust">
          {t.readArticle}
          <img
            src="/mukalim/learn-more-arrow.svg"
            alt=""
            aria-hidden="true"
            className="h-[9px] w-3 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </MotionLink>
  );
}
