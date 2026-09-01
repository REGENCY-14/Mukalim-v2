"use client";

/**
 * AnimatedBackground
 *
 * Reusable decorative background: soft, blurred blobs that drift/rotate/pulse
 * slowly in an infinite loop. Purely decorative — never affects layout.
 *
 * Usage: render once near the top of a page/section that needs visual life
 * (hero sections, empty states, auth pages), inside a `relative` ancestor:
 *
 *   <section className="relative overflow-hidden">
 *     <AnimatedBackground />
 *     <div className="relative z-10"> ...actual content... </div>
 *   </section>
 *
 * Extend this component (e.g. a `variant` prop) rather than adding one-off
 * background SVGs/blobs to individual pages.
 */

import { motion, useReducedMotion } from "framer-motion";
import { duration, ease } from "@/lib/animations";

export default function AnimatedBackground() {
  const shouldReduceMotion = useReducedMotion();

  // When the user prefers reduced motion, render the blobs statically
  // (no `animate` loop) instead of just slowing the animation down.
  const blobs = [
    {
      className:
        "absolute -top-24 -left-24 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-foreground/10 blur-3xl",
      animate: shouldReduceMotion
        ? undefined
        : { x: [0, 30, -10, 0], y: [0, 20, -20, 0], scale: [1, 1.08, 0.96, 1] },
      duration: duration.ambient,
    },
    {
      className:
        "absolute top-1/3 -right-16 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-foreground/[0.07] blur-3xl",
      animate: shouldReduceMotion
        ? undefined
        : { x: [0, -25, 15, 0], y: [0, -15, 25, 0], rotate: [0, 15, -10, 0] },
      duration: duration.ambient * 1.3,
    },
    {
      className:
        "absolute bottom-0 left-1/4 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-foreground/[0.06] blur-3xl",
      animate: shouldReduceMotion
        ? undefined
        : { x: [0, 15, -20, 0], y: [0, -20, 10, 0], scale: [1, 0.94, 1.06, 1] },
      duration: duration.ambient * 1.6,
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={blob.className}
          animate={blob.animate}
          transition={
            blob.animate
              ? {
                  duration: blob.duration,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: ease.standard,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
