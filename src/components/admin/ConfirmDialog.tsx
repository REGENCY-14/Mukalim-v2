"use client";

import { AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { microTransition } from "@/lib/animations";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={microTransition}
            onClick={onCancel}
            className="absolute inset-0 bg-brand-ink/40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={microTransition}
            className="relative flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-admin-cream p-6 shadow-[0_20px_60px_0_rgba(0,0,0,0.25)]"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-admin-terracotta/12 text-admin-terracotta">
              <AlertTriangle className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="font-serif text-lg font-bold text-brand-brown">{title}</h2>
              <p className="text-sm text-admin-warm-grey">{description}</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg px-4 py-2 text-sm font-medium text-brand-brown transition-colors hover:bg-brand-brown/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="rounded-lg bg-admin-terracotta px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-95"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
