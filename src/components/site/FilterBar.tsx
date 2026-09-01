"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";

export type SortOption = "newest" | "oldest" | "a-z" | "z-a";

/** Internal sentinel value for "no tag filter" — stays English regardless of
 * locale so it never collides with a real (translated) tag string. */
export const ALL_TAGS_VALUE = "All Ingredients";

function ChevronDown() {
  return (
    <svg
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-3 size-2.5 -translate-y-1/2 text-brand-brown-deep/70"
    >
      <path
        d="M1 1l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Shared pill treatment for both filter <select>s — a subtle bordered
 * chip instead of bare unstyled text, matching the rounded/hover language
 * the rest of the nav (e.g. the language switcher) already uses. */
const selectClass =
  "appearance-none rounded-full border border-brand-line/60 bg-white py-1.5 pr-8 pl-3.5 text-sm text-brand-ink outline-none transition-colors hover:border-brand-brown/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";

interface FilterBarProps {
  tags: string[];
  selectedTag: string;
  onTagChange: (tag: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function FilterBar({
  tags,
  selectedTag,
  onTagChange,
  sort,
  onSortChange,
}: FilterBarProps) {
  const { locale } = useLocale();
  const t = ui[locale].filterBar;
  const sortLabels: Record<SortOption, string> = {
    newest: t.newest,
    oldest: t.oldest,
    "a-z": t.aToZ,
    "z-a": t.zToA,
  };

  return (
    <div className="flex flex-col gap-4 border-b border-brand-line/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <label htmlFor="filter-by-tag" className="text-sm font-medium tracking-[0.7px] text-brand-brown-deep">
          {t.filterBy}
        </label>
        <span className="relative">
          <select
            id="filter-by-tag"
            value={selectedTag}
            onChange={(event) => onTagChange(event.target.value)}
            className={selectClass}
          >
            <option value={ALL_TAGS_VALUE}>{t.allIngredients}</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <ChevronDown />
        </span>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="sort-by" className="text-sm font-medium tracking-[0.7px] text-brand-brown-deep">
          {t.sortBy}
        </label>
        <span className="relative">
          <select
            id="sort-by"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className={selectClass}
          >
            {(Object.keys(sortLabels) as SortOption[]).map((option) => (
              <option key={option} value={option}>
                {sortLabels[option]}
              </option>
            ))}
          </select>
          <ChevronDown />
        </span>
      </div>
    </div>
  );
}
