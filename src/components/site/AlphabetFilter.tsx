"use client";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface AlphabetFilterProps {
  /** Letters with at least one matching article — everything else renders disabled. */
  availableLetters: Set<string>;
  activeLetter: string | null;
  onSelect: (letter: string | null) => void;
  allLabel: string;
  ariaLabel: string;
}

export default function AlphabetFilter({
  availableLetters,
  activeLetter,
  onSelect,
  allLabel,
  ariaLabel,
}: AlphabetFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={activeLetter === null}
        className={`rounded-full px-3 py-1 text-xs font-medium tracking-[0.7px] transition-colors ${
          activeLetter === null
            ? "bg-brand-gold-deep text-white"
            : "text-brand-brown-deep hover:bg-brand-sand"
        }`}
      >
        {allLabel}
      </button>
      <span className="mx-1 h-4 w-px bg-brand-line/50" aria-hidden="true" />
      {LETTERS.map((letter) => {
        const isAvailable = availableLetters.has(letter);
        const isActive = activeLetter === letter;
        return (
          <button
            key={letter}
            type="button"
            disabled={!isAvailable}
            onClick={() => onSelect(isActive ? null : letter)}
            aria-pressed={isActive}
            className={`flex size-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
              isActive
                ? "bg-brand-gold-deep text-white"
                : isAvailable
                  ? "text-brand-ink hover:bg-brand-sand"
                  : "cursor-not-allowed text-brand-brown-deep/30"
            }`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
