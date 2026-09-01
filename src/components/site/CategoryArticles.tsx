"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CategoryArticle } from "@/lib/categories";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { localizeArticle, ui } from "@/lib/i18n/translations";
import FilterBar, { ALL_TAGS_VALUE, type SortOption } from "./FilterBar";
import AlphabetFilter from "./AlphabetFilter";
import ArticleCard from "./ArticleCard";

function firstLetter(title: string): string {
  return title.charAt(0).toUpperCase();
}

interface CategoryArticlesProps {
  articles: CategoryArticle[];
  categorySlug: string;
}

export default function CategoryArticles({ articles, categorySlug }: CategoryArticlesProps) {
  const { locale } = useLocale();
  const t = ui[locale];
  const [selectedTag, setSelectedTag] = useState(ALL_TAGS_VALUE);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");

  const localizedArticles = useMemo(
    () => articles.map((article) => localizeArticle(article, categorySlug, locale)),
    [articles, categorySlug, locale],
  );

  const tags = useMemo(
    () =>
      Array.from(new Set(localizedArticles.map((article) => article.tag))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [localizedArticles],
  );

  const tagFiltered = useMemo(
    () =>
      selectedTag === ALL_TAGS_VALUE
        ? localizedArticles
        : localizedArticles.filter((article) => article.tag === selectedTag),
    [localizedArticles, selectedTag],
  );

  const availableLetters = useMemo(
    () => new Set(tagFiltered.map((article) => firstLetter(article.title))),
    [tagFiltered],
  );

  // If narrowing the tag filter makes the previously-selected letter unavailable,
  // treat it as cleared rather than showing a confusing empty state.
  const activeLetter = selectedLetter && availableLetters.has(selectedLetter) ? selectedLetter : null;

  const filtered = useMemo(
    () =>
      activeLetter
        ? tagFiltered.filter((article) => firstLetter(article.title) === activeLetter)
        : tagFiltered,
    [tagFiltered, activeLetter],
  );

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sort) {
      case "newest":
        return list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
      case "oldest":
        return list.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
      case "a-z":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "z-a":
        return list.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return list;
    }
  }, [filtered, sort]);

  const handleClearFilters = () => {
    setSelectedTag(ALL_TAGS_VALUE);
    setSelectedLetter(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <FilterBar
          tags={tags}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          sort={sort}
          onSortChange={setSort}
        />
        <AlphabetFilter
          availableLetters={availableLetters}
          activeLetter={activeLetter}
          onSelect={setSelectedLetter}
          allLabel={t.alphabetAll}
          ariaLabel={t.alphabetFilterLabel}
        />
      </div>

      {sorted.length > 0 ? (
        <motion.div layout className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {sorted.map((article, index) => (
              <ArticleCard
                key={article.slug}
                article={article}
                categorySlug={categorySlug}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-brand-line/60 py-16 text-center">
          <p className="text-base text-brand-brown-deep">{t.categoryArticles.noMatch}</p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm font-medium tracking-[0.7px] text-brand-rust hover:underline"
          >
            {t.categoryArticles.clearFilters}
          </button>
        </div>
      )}

      {sorted.length > 0 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            className="rounded-xl border border-brand-rust px-8 py-3 text-sm font-medium tracking-[0.7px] text-brand-rust transition-colors hover:bg-brand-rust/5"
          >
            {t.categoryArticles.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}
