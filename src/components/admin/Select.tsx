import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Whether the wrapper stretches to fill its container (form fields) or
   *  sizes to content (inline toolbar filters). Default: true. */
  fullWidth?: boolean;
}

/**
 * Styled wrapper around a native <select> — the browser's own dropdown
 * arrow doesn't match the dashboard's rounded, bordered inputs, so this
 * resets `appearance` and draws a brand-matched chevron instead.
 *
 * `className` should carry the same border/background/padding as a
 * sibling <input> (e.g. `inputClass`), plus right padding for the chevron
 * (e.g. `pr-9`) — this component only adds the reset, the icon, and the
 * wrapper, it doesn't guess at your spacing.
 */
export default function Select({ className = "", fullWidth = true, children, ...props }: SelectProps) {
  return (
    <span className={fullWidth ? "relative block" : "relative inline-block"}>
      <select {...props} className={`appearance-none transition-colors ${className}`}>
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-admin-warm-grey"
      />
    </span>
  );
}
