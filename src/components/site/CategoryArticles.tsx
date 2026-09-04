"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { listPublicArticles, type PublicArticleSummary, type PublicArticlesMeta } from "@/lib/publicApi";
import FilterBar, { ALL_TAGS_VALUE, type SortOption } from "./FilterBar";
import AlphabetFilter from "./AlphabetFilter";
import ArticleCard from "./ArticleCard";

interface CategoryArticlesProps {
  categorySlug: string;
  /** Server-fetched (English, no filters) — avoids a network round trip for
   * the common case; see the page component. `null` if that fetch failed. */
  initialArticles: PublicArticleSummary[] | null;
  initialMeta: PublicArticlesMeta | null;
}

export default function CategoryArticles({ categorySlug, initialArticles, initialMeta }: CategoryArticlesProps) {
  const { locale } = useLocale();
  const t = ui[locale];
  const [selectedTag, setSelectedTag] = useState(ALL_TAGS_VALUE);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const [articles, setArticles] = useState(initialArticles);
  const [meta, setMeta] = useState(initialMeta);

  // Filtering/sorting is real query params against the backend now
  // (`?tag=&sort=&letter=`), not client-side array filtering — so every
  // change here is a fresh fetch. The very first run, for the exact
  // English/no-filters case the server already fetched, reuses that
  // instead of firing a redundant duplicate request.
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      if (locale === "en" && selectedTag === ALL_TAGS_VALUE && !selectedLetter && sort === "newest" && initialArticles) {
        return;
      }
    }
    let cancelled = false;
    listPublicArticles(categorySlug, {
      locale,
      tag: selectedTag === ALL_TAGS_VALUE ? undefined : selectedTag,
      sort,
      letter: selectedLetter ?? undefined,
      limit: 100,
    })
      .then((res) => {
        if (cancelled) return;
        setArticles(res.data);
        setMeta(res.meta);
      })
      .catch(() => {
        if (!cancelled) {
          setArticles([]);
          setMeta({ total: 0, page: 1, limit: 100, totalPages: 1, availableTags: [], availableLetters: [] });
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, locale, selectedTag, sort, selectedLetter]);

  const handleClearFilters = () => {
    setSelectedTag(ALL_TAGS_VALUE);
    setSelectedLetter(null);
  };

  const tagOptions = meta?.availableTags ?? [];
  const availableLetters = new Set(meta?.availableLetters ?? []);
  // If narrowing the tag filter makes the previously-selected letter
  // unavailable, the backend's own `availableLetters` (computed after the
  // tag filter, before the letter filter — same semantics the old
  // client-side version had) already reflects that; just don't keep a
  // selection the UI can no longer show as active.
  const activeLetter = selectedLetter && availableLetters.has(selectedLetter) ? selectedLetter : null;

  if (!articles) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <FilterBar
          tags={tagOptions}
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

      {articles.length > 0 ? (
        <motion.div layout className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {articles.map((article, index) => (
              <ArticleCard key={article.slug} article={article} categorySlug={categorySlug} index={index} />
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

      {articles.length > 0 && (
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
