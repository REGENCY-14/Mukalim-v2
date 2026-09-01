"use client";

import { LANGUAGES, type Language, type LocalizedText } from "@/lib/admin/types";

interface LanguageTabsProps {
  active: Language;
  onChange: (lang: Language) => void;
  /** One or more LocalizedText fields — a tab's dot is filled only once
   * every field is non-empty for that language (e.g. name AND description). */
  fields: LocalizedText[];
}

export default function LanguageTabs({ active, onChange, fields }: LanguageTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-brand-line/40" role="tablist" aria-label="Language">
      {LANGUAGES.map((lang) => {
        const isComplete = fields.every((field) => field[lang.code].trim().length > 0);
        const isActive = active === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(lang.code)}
            className={`relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors ${
              isActive ? "text-brand-brown" : "text-admin-warm-grey hover:text-brand-brown"
            }`}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${isComplete ? "bg-admin-green" : "bg-admin-warm-grey/40"}`}
            />
            {lang.label}
            {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-gold" />}
          </button>
        );
      })}
    </div>
  );
}
