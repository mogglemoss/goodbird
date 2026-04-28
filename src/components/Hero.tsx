import { motion, useReducedMotion } from "framer-motion";

/**
 * Restrained atmospheric band that sits below the sticky StickyTopBar.
 * Decorative-only: small caps label + display headline + coordinates +
 * four layers of rolling hills + tiny bird silhouettes. No interactive
 * controls — those live in StickyTopBar so they pin to the top on scroll.
 *
 * The back two fog layers drift slowly horizontally (parallax depth);
 * the front two stay static so the foreground doesn't pull the eye away
 * from the title block above. Drift is disabled under
 * prefers-reduced-motion. Each animated layer renders the path twice,
 * the second copy translated by exactly one wave period (800 viewBox
 * units), so the loop seam is invisible.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();
  const drift = (durationSec: number) =>
    reduceMotion
      ? {}
      : {
          animate: { x: [0, -800] },
          transition: { duration: durationSec, ease: "linear" as const, repeat: Infinity, repeatType: "loop" as const },
        };

  return (
    <section className="relative -mx-5 mb-2 overflow-hidden border-b border-(--color-line) bg-gradient-to-b from-(--color-bg) via-(--color-sand-50)/40 to-(--color-moss-50)/60 px-5 pb-24 pt-2 sm:pb-28 dark:via-(--color-sand-50)/30 dark:to-(--color-moss-50)/40">
      {/* Tiny decorative birds, upper-left */}
      <div aria-hidden className="pointer-events-none absolute left-6 top-6 text-(--color-moss-700)/40">
        <svg viewBox="0 0 60 24" className="h-4 w-16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <path d="M2 14 q 4 -6, 8 0 q 4 -6, 8 0" />
          <path d="M28 8 q 3 -4, 6 0 q 3 -4, 6 0" />
          <path d="M48 16 q 2 -3, 4 0 q 2 -3, 4 0" />
        </svg>
      </div>

      {/* Title block */}
      <div className="relative z-10 mt-6 text-center sm:mt-8">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-(--color-ink-soft)">
          West Marin · Ear Training
        </p>
        <h1 className="mt-2 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          Pick a habitat.
        </h1>
        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-(--color-ink-soft)" title="Paper Mill Creek Saloon, Forest Knolls">
          38°00′52″N · 122°41′44″W
        </p>
      </div>

      {/* Layered fog-and-hill silhouettes along the bottom. Four wavy layers,
          each a smooth Q→T-chain so peaks and valleys flow organically.
          Palette: pale sage in back, deepening toward the foreground.
          Phase offsets between layers so peaks don't stack vertically.
          preserveAspectRatio="none" lets the shapes stretch across any
          viewport while keeping the 800×100 design grid. */}
      <svg
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 w-full sm:h-28"
        viewBox="0 0 800 100"
        preserveAspectRatio="none"
      >
        {/* Back fog — palest, broad waves, slowest drift (60s/cycle).
            Path duplicated at +800 so the loop seam is invisible. */}
        <motion.g {...drift(60)}>
          <path
            d="M0,48 Q 100,22 200,48 T 400,48 T 600,48 T 800,48 L 800,100 L 0,100 Z"
            fill="oklch(93% 0.03 160 / 0.55)"
          />
          <path
            transform="translate(800, 0)"
            d="M0,48 Q 100,22 200,48 T 400,48 T 600,48 T 800,48 L 800,100 L 0,100 Z"
            fill="oklch(93% 0.03 160 / 0.55)"
          />
        </motion.g>
        {/* Mid-back — phase-shifted so its peaks fall in back's valleys.
            Faster drift (45s) than back layer for parallax depth. */}
        <motion.g {...drift(45)}>
          <path
            d="M0,64 Q 80,42 180,62 T 380,62 T 580,62 T 800,64 L 800,100 L 0,100 Z"
            fill="oklch(85% 0.04 160 / 0.7)"
          />
          <path
            transform="translate(800, 0)"
            d="M0,64 Q 80,42 180,62 T 380,62 T 580,62 T 800,64 L 800,100 L 0,100 Z"
            fill="oklch(85% 0.04 160 / 0.7)"
          />
        </motion.g>
        {/* Mid-front — denser sage, different rhythm. STATIC. */}
        <path
          d="M0,78 Q 130,58 260,76 T 520,76 T 800,78 L 800,100 L 0,100 Z"
          fill="oklch(76% 0.055 160 / 0.8)"
        />
        {/* Foreground — deepest, finer texture. STATIC so the bird/title
            isn't visually crowded by motion. */}
        <path
          d="M0,90 Q 60,80 120,89 T 240,89 T 360,89 T 480,89 T 600,89 T 720,89 T 800,90 L 800,100 L 0,100 Z"
          fill="oklch(66% 0.07 160 / 0.88)"
        />
      </svg>
    </section>
  );
}
