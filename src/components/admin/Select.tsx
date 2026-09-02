"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { microTransition } from "@/lib/animations";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Same border/background/padding you'd give a sibling <input> (e.g.
   *  `inputClass`) — applied to the trigger button. No need to reserve
   *  extra right padding for the chevron; it's a flex child, not overlaid. */
  className: string;
  /** Whether the wrapper stretches to fill its container (form fields) or
   *  sizes to content (inline toolbar filters). Default: true. */
  fullWidth?: boolean;
  ariaLabel?: string;
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

/**
 * Fully custom dropdown — button trigger + animated menu — instead of a
 * native <select>. A native select's closed trigger can be restyled, but
 * its opened list is always the plain OS/browser popup; this matches the
 * bespoke pattern already used for the public site's filter dropdowns and
 * the nav's language switcher, so the open panel is brand-styled too.
 *
 * `disabled` isn't a prop here on purpose — every current usage sits
 * inside a `<fieldset disabled={!editable}>`, and a disabled fieldset
 * already disables descendant <button>s per the HTML spec, so this picks
 * that up for free without extra plumbing.
 */
export default function Select({ id, value, options, onChange, className, fullWidth = true, ariaLabel }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <span ref={ref} className={fullWidth ? "relative block" : "relative inline-block"}>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className={`flex w-full items-center justify-between gap-2 text-left transition-colors ${className}`}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-admin-warm-grey transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
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
            className="absolute top-[calc(100%+6px)] left-0 z-20 max-h-64 w-full min-w-[11rem] overflow-y-auto rounded-xl border border-brand-line/40 bg-white py-1.5 shadow-[0_8px_30px_0_rgba(107,58,31,0.15)]"
          >
            {options.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-sm transition-colors hover:bg-brand-brown/5 ${
                    option.value === value ? "font-semibold text-brand-brown" : "text-brand-brown/80"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <span aria-hidden="true" className="shrink-0 text-brand-gold">
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
