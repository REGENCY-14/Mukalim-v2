/**
 * Shared Framer Motion tokens & variants.
 *
 * Single source of truth for motion across the app. Import from here instead
 * of writing one-off transition/variant objects in individual components, so
 * every animated screen shares the same feel (duration, easing, distances).
 *
 * Reduced motion:
 * - The app is wrapped in `<MotionConfig reducedMotion="user">` (see
 *   `src/app/layout.tsx`), which automatically disables transform-based
 *   animations (x/y/scale/rotate) for users with `prefers-reduced-motion`
 *   set, collapsing them to their end state instead of animating.
 * - `AnimatedBackground` additionally checks `useReducedMotion()` directly
 *   so decorative loops are removed (not just slowed) for those users.
 */

import type { Transition, Variants } from "framer-motion";

/** Shared easing curves. Prefer `standard` for most UI motion. */
export const ease = {
  /** General purpose UI easing (Material "standard" curve). */
  standard: [0.4, 0, 0.2, 1] as const,
  /** Slightly springier curve for emphasis (entrances, reveals). */
  emphasized: [0.16, 1, 0.3, 1] as const,
} as const;

/** Shared duration tokens, in seconds. */
export const duration = {
  fast: 0.15,
  base: 0.35,
  slow: 0.6,
  /** For large, continuous decorative background loops. */
  ambient: 18,
} as const;

/** Default transition using the shared tokens. Spread into variants as needed. */
export const baseTransition: Transition = {
  duration: duration.base,
  ease: ease.standard,
};

// ---------------------------------------------------------------------------
// Page-level transitions
// ---------------------------------------------------------------------------

/** Wrap route/page content in this for consistent enter/exit transitions. */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: duration.fast, ease: ease.standard },
  },
};

// ---------------------------------------------------------------------------
// Fade / slide primitives
// ---------------------------------------------------------------------------

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease: ease.standard } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
};

// ---------------------------------------------------------------------------
// Stagger (lists / grids)
// ---------------------------------------------------------------------------

/** Put on the parent (e.g. a `<motion.ul>`) alongside `initial="hidden" animate="visible"`. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

/** Put on each child (e.g. `<motion.li variants={staggerItem} />`) — no need to set initial/animate on children. */
export const staggerItem: Variants = fadeInUp;

// ---------------------------------------------------------------------------
// Scroll-triggered reveal
// ---------------------------------------------------------------------------

/** Use with `whileInView="visible" initial="hidden" viewport={scrollViewport}`. */
export const scrollReveal: Variants = fadeInUp;

/** Default viewport options for scroll reveals: animate once, slightly before entering view. */
export const scrollViewport = { once: true, margin: "-80px" } as const;

// ---------------------------------------------------------------------------
// Hover / tap micro-interactions
// ---------------------------------------------------------------------------

/** Spread as `whileHover={hoverScale} whileTap={tapScale} transition={microTransition}`. */
export const hoverScale = { scale: 1.03 };
export const tapScale = { scale: 0.97 };

/** Subtle lift for cards/links — combine with `hoverScale`-style usage if desired. */
export const hoverLift = { y: -4, scale: 1.02 };
export const tapLift = { y: 0, scale: 0.98 };

/** Short, snappy transition for hover/tap (kept separate from entrance timings). */
export const microTransition: Transition = {
  duration: duration.fast,
  ease: ease.standard,
};
