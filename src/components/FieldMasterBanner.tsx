import { motion } from "framer-motion";

/**
 * Quiet capstone moment shown on Home once every habitat is complete.
 * Deliberately understated — no confetti, no big trophy. A small mono-caps
 * label, a serif headline, and a hand-drawn ink-line vista of Pt. Reyes
 * (lighthouse, hills, tideline). Reads as the inside cover of a finished
 * field journal, not a video-game victory screen.
 */
export function FieldMasterBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      role="region"
      aria-label="Field master"
      className="relative mt-4 overflow-hidden rounded-(--radius-card) border-2 border-(--color-moss-300) bg-(--color-moss-50) px-5 py-5 shadow-(--shadow-soft)"
    >
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-(--color-moss-700)">
        Field master · West Marin
      </p>
      <h2 className="mt-1 font-display text-xl leading-tight sm:text-2xl">
        Every voice in the guide.
      </h2>
      <p className="mt-1.5 max-w-sm font-display text-sm italic leading-snug text-(--color-ink-soft)">
        From scrub wrentits to barred owls — you've learned them all. Keep
        listening; the bay rewards regulars.
      </p>

      {/* Pt. Reyes vista — lighthouse silhouette + layered hills + horizon.
          Kept very small and low-contrast so it feels like a marginal sketch. */}
      <svg
        viewBox="0 0 220 60"
        aria-hidden
        className="pointer-events-none absolute right-3 bottom-3 h-12 w-44 text-(--color-moss-500)/35 sm:h-14 sm:w-52"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Horizon line */}
        <path d="M0 44h220" strokeWidth="0.8" />
        {/* Far hills */}
        <path d="M0 38c20-6 32-6 52 0s38 4 60-2 50 0 70 4 28 2 38 0" strokeWidth="0.9" />
        {/* Near hills */}
        <path d="M0 50c25-9 45-9 70-2s50 6 75-1 50 1 75 5" />
        {/* Lighthouse on the right headland */}
        <g transform="translate(185 22)">
          <path d="M0 0v18M6 0v18" />
          <path d="M-2 0h10" />
          <path d="M-3 -3h12l-1.5 3h-9z" />
          <circle cx="3" cy="-7" r="2" />
          <path d="M3 -10v-3" />
        </g>
        {/* Two gulls overhead */}
        <path d="M30 14c2-3 4-3 6 0M40 10c2-3 4-3 6 0" strokeWidth="1" />
      </svg>
    </motion.section>
  );
}
