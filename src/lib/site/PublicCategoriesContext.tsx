"use client";

/**
 * Single shared source for the public category list — nav links
 * (`TopNavBar`), footer links (`Footer`), and the homepage grid
 * (`CategoryGrid`) all read from this instead of each fetching
 * independently. Two problems that fixed:
 *
 * 1. Nav/footer used to render empty until their own client fetch resolved
 *    (a regression vs. the old always-present static nav) — now they read
 *    `initialCategories`, fetched server-side by `app/(site)/layout.tsx`
 *    (English, respecting the same `revalidate = 60` ISR window as the
 *    category/article pages), so they're populated on first paint.
 * 2. Three independent components each doing their own "fetch French,
 *    correct on mount" cycle is now one correction, here, that all three
 *    read from — not three separate flashes of English before French loads.
 *
 * Same render-time-adjustment pattern as CategoryHero/ArticleDetail: English
 * is already known synchronously (server-fetched), so it's restored during
 * render rather than through an effect; only French needs the actual fetch.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { listPublicCategories, type PublicCategory } from "@/lib/publicApi";

const PublicCategoriesContext = createContext<PublicCategory[]>([]);

interface PublicCategoriesState {
  locale: "en" | "fr";
  categories: PublicCategory[];
}

export function PublicCategoriesProvider({
  initialCategories,
  children,
}: {
  initialCategories: PublicCategory[];
  children: ReactNode;
}) {
  const { locale } = useLocale();
  const [state, setState] = useState<PublicCategoriesState>({
    locale: "en",
    categories: initialCategories,
  });

  if (locale === "en" && state.locale !== "en") {
    setState({ locale: "en", categories: initialCategories });
  }

  useEffect(() => {
    if (locale === "en") return;
    let cancelled = false;
    listPublicCategories(locale)
      .then((res) => {
        if (!cancelled) setState({ locale, categories: res.data });
      })
      .catch(() => {
        // Leave the English list showing rather than blanking nav/footer/grid.
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <PublicCategoriesContext.Provider value={state.categories}>{children}</PublicCategoriesContext.Provider>
  );
}

export function usePublicCategories(): PublicCategory[] {
  return useContext(PublicCategoriesContext);
}
