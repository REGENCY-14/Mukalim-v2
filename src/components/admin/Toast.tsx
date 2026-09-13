"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  onDismiss: () => void;
  /** Auto-dismiss delay in ms. Pass 0 to disable. Defaults to 5000. */
  duration?: number;
}

/** Minimal hand-rolled toast — this codebase has no toast library, so a
 * single fixed-position banner is used instead of adding a dependency.
 * Only one toast is ever shown at a time (callers hold a single
 * `message | null` piece of state), so no stacking/queueing is needed. */
export default function Toast({ message, onDismiss, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl border border-brand-line/30 bg-white px-5 py-4 text-sm text-brand-brown shadow-[0_8px_30px_rgba(107,58,31,0.15)]">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-admin-green" />
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-brand-brown/50 transition-colors hover:text-brand-brown"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
