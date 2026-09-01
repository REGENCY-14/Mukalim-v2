import { LANGUAGES, type LocalizedText } from "@/lib/admin/types";

/** Compact FR/EN/DE/IT completion indicator for table rows — the full
 * interactive version lives in `LanguageTabs` (used inside forms). */
export default function LanguageDots({ fields }: { fields: LocalizedText[] }) {
  return (
    <div className="flex items-center gap-1.5" title="Language completion">
      {LANGUAGES.map((lang) => {
        const isComplete = fields.every((field) => field[lang.code].trim().length > 0);
        return (
          <span key={lang.code} className="flex flex-col items-center gap-0.5">
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${isComplete ? "bg-admin-green" : "bg-admin-warm-grey/30"}`}
            />
            <span className="text-[9px] leading-none text-admin-warm-grey">{lang.label}</span>
          </span>
        );
      })}
    </div>
  );
}
