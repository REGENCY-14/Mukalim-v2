"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { listRecentArticles, type PublicArticleSummaryWithCategory } from "@/lib/publicApi";
import { scrollViewport, staggerContainer } from "@/lib/animations";
import ArticleCard from "./ArticleCard";

interface RecentArticlesGridProps {
  /** Server-fetched (English) — avoids a network round trip for the common
   * case; see the page component. Empty if that fetch failed or nothing is
   * published yet. */
  initialArticles: PublicArticleSummaryWithCategory[];
}

export default function RecentArticlesGrid({ initialArticles }: RecentArticlesGridProps) {
  const { locale } = useLocale();
  const t = ui[locale].blogPage;
  const [articles, setArticles] = useState(initialArticles);

  // Same pattern as CategoryArticles: reuse the server-fetched English data
  // for the very first render, only refetching when the visitor is actually
  // on French (or the initial fetch came back empty and might just have
  // failed transiently).
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      if (locale === "en") return;
    }
    let cancelled = false;
    listRecentArticles(locale)
      .then((data) => {
        if (!cancelled) setArticles(data);
      })
      .catch(() => {
        if (!cancelled) setArticles([]);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (articles.length === 0) {
    return <p className="text-center text-base text-brand-muted">{t.emptyState}</p>;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {articles.map((article, index) => (
        <ArticleCard key={`${article.categorySlug}-${article.slug}`} article={article} categorySlug={article.categorySlug} index={index} />
      ))}
    </motion.div>
  );
}
