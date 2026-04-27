import { Wordmark } from "./brand/Wordmark";

interface Props {
  /** Right-aligned controls (settings + pills) injected by the parent. */
  controls?: React.ReactNode;
}

/**
 * Restrained atmospheric band that sits above the home grid.
 * Three-layer rolling hills along the bottom edge + a few tiny bird
 * silhouettes upper-left + the title block centered.
 *
 * Sized to feel like a brand mark with utility, not a marketing splash.
 */
export function Hero({ controls }: Props) {
  return (
    <section className="relative -mx-5 mb-2 overflow-hidden border-b border-(--color-line) bg-gradient-to-b from-(--color-bg) via-(--color-sand-50)/40 to-(--color-moss-50)/60 px-5 pb-20 pt-6 sm:pb-24">
      {/* Top row — wordmark + controls */}
      <div className="relative z-10 flex items-center justify-between">
        <Wordmark size="sm" />
        {controls}
      </div>

      {/* Tiny decorative birds, upper-left */}
      <div aria-hidden className="pointer-events-none absolute left-12 top-12 text-(--color-moss-700)/40">
        <svg viewBox="0 0 60 24" className="h-4 w-16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <path d="M2 14 q 4 -6, 8 0 q 4 -6, 8 0" />
          <path d="M28 8 q 3 -4, 6 0 q 3 -4, 6 0" />
          <path d="M48 16 q 2 -3, 4 0 q 2 -3, 4 0" />
        </svg>
      </div>

      {/* Title block */}
      <div className="relative z-10 mt-8 text-center sm:mt-10">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-(--color-ink-soft)">
          West Marin · Ear Training
        </p>
        <h1 className="mt-2 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          Pick a habitat.
        </h1>
        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-(--color-ink-soft)">
          38°02′N · 122°42′W
        </p>
      </div>

      {/* Layered rolling hills along the bottom */}
      <svg
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-16 w-full sm:h-20"
        viewBox="0 0 800 100"
        preserveAspectRatio="none"
      >
        {/* Far layer — palest sage */}
        <path
          d="M0,70 C120,50 240,80 360,60 C480,40 600,70 720,55 L800,60 L800,100 L0,100 Z"
          fill="oklch(91% 0.04 160 / 0.55)"
        />
        {/* Mid layer */}
        <path
          d="M0,80 C100,65 220,90 340,72 C460,55 580,85 700,70 L800,72 L800,100 L0,100 Z"
          fill="oklch(82% 0.06 160 / 0.6)"
        />
        {/* Near layer */}
        <path
          d="M0,90 C80,80 200,98 320,86 C440,74 560,96 680,84 L800,86 L800,100 L0,100 Z"
          fill="oklch(70% 0.08 160 / 0.55)"
        />
      </svg>
    </section>
  );
}
