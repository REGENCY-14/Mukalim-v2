"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { ui } from "@/lib/i18n/translations";
import { microTransition } from "@/lib/animations";

export type SortOption = "newest" | "oldest" | "a-z" | "z-a";

/** Internal sentinel value for "no tag filter" — stays English regardless of
 * locale so it never collides with a real (translated) tag string. */
export const ALL_TAGS_VALUE = "All Ingredients";

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden="true"
      className={`size-2.5 shrink-0 text-brand-brown-deep/70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

interface FilterDropdownProps {
  id: string;
  ariaLabel: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

/** A fully custom dropdown — button trigger + animated menu — instead of a
 * native <select>. A native select's closed trigger can be restyled, but
 * its opened list is always the plain OS/browser popup; this matches the
 * bespoke trigger+panel pattern already used for the nav's language
 * switcher, so the open panel is brand-styled too. */
function FilterDropdown({ id, ariaLabel, value, options, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <span ref={ref} className="relative inline-block">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className={`flex items-center gap-2 rounded-full border bg-white py-1.5 pr-3.5 pl-3.5 text-sm text-brand-ink transition-colors ${
          open
            ? "border-brand-gold ring-2 ring-brand-gold/20"
            : "border-brand-line/60 hover:border-brand-brown/40"
        }`}
      >
        {selected.label}
        <ChevronDown open={open} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={ariaLabel}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={microTransition}
            className="absolute top-[calc(100%+8px)] left-0 z-10 max-h-72 w-52 overflow-y-auto rounded-xl border border-brand-line/30 bg-white py-1.5 shadow-[0_8px_30px_0_rgba(107,58,31,0.15)]"
          >
            {options.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-brand-sand ${
                    option.value === value ? "font-semibold text-brand-gold-deep" : "text-brand-brown-deep"
                  }`}
                >
                  {option.label}
                  {option.value === value && (
                    <span aria-hidden="true" className="text-brand-gold-deep">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </span>
  );
}

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

  const tagOptions = [
    { value: ALL_TAGS_VALUE, label: t.allIngredients },
    ...tags.map((tag) => ({ value: tag, label: tag })),
  ];
  const sortOptions = (Object.keys(sortLabels) as SortOption[]).map((option) => ({
    value: option,
    label: sortLabels[option],
  }));

  return (
    <div className="flex flex-col gap-4 border-b border-brand-line/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <label htmlFor="filter-by-tag" className="text-sm font-medium tracking-[0.7px] text-brand-brown-deep">
          {t.filterBy}
        </label>
        <FilterDropdown
          id="filter-by-tag"
          ariaLabel={t.filterBy}
          value={selectedTag}
          options={tagOptions}
          onChange={onTagChange}
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="sort-by" className="text-sm font-medium tracking-[0.7px] text-brand-brown-deep">
          {t.sortBy}
        </label>
        <FilterDropdown
          id="sort-by"
          ariaLabel={t.sortBy}
          value={sort}
          options={sortOptions}
          onChange={(value) => onSortChange(value as SortOption)}
        />
      </div>
    </div>
  );
}
