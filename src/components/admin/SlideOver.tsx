"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { baseTransition, microTransition } from "@/lib/animations";

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  widthClassName?: string;
}

export default function SlideOver({ open, onClose, title, children, widthClassName = "max-w-lg" }: SlideOverProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={microTransition}
            onClick={onClose}
            className="absolute inset-0 bg-brand-ink/40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={baseTransition}
            className={`relative flex h-full w-full ${widthClassName} flex-col bg-admin-cream shadow-[0_0_40px_0_rgba(0,0,0,0.25)]`}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-brand-line/40 px-6 py-5">
              <h2 className="font-serif text-xl font-bold text-brand-brown">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="flex size-8 items-center justify-center rounded-full text-admin-warm-grey transition-colors hover:bg-brand-brown/5 hover:text-brand-brown"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
