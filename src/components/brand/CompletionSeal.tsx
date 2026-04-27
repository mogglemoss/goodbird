import { cn } from "@/lib/cn";

/**
 * Small "specimen verified" seal stamped on a HabitatCard once every lesson
 * in the unit is done. Replaces the previous green tick — same footprint,
 * but reads as a field-guide stamp rather than a generic checkmark.
 *
 * The ring is accent-tinted; the rosette inside is white. We deliberately
 * went with an ink-line rosette (5 short petals around a small dot) rather
 * than a star — feels more botanical/field-guide than gamified.
 */
interface Props {
  /** Tailwind classes for the filled background — usually accent.doneBadgeBg. */
  bgClass: string;
  /** Accessible label; default is "Habitat complete". */
  ariaLabel?: string;
  /** Visual size — md is for HabitatCard, sm is for compact strips. */
  size?: "md" | "sm";
}

const SIZES = {
  md: { wrap: "h-6 w-6", glyph: "h-3.5 w-3.5" },
  sm: { wrap: "h-4 w-4", glyph: "h-2.5 w-2.5" },
};

export function CompletionSeal({ bgClass, ariaLabel = "Habitat complete", size = "md" }: Props) {
  const dim = SIZES[size];
  return (
    <span
      role="img"
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        "grid place-items-center rounded-full text-white shadow-(--shadow-soft)",
        bgClass,
        dim.wrap,
      )}
    >
      <svg viewBox="0 0 16 16" className={dim.glyph} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* Five small petals around a center dot — a botanical rosette */}
        <circle cx="8" cy="8" r="0.9" fill="currentColor" stroke="none" />
        <path d="M8 4.4v1.4M11.2 6.2l-.8 1.2M10.4 10.5l-1.2-.6M5.6 10.5l1.2-.6M4.8 6.2l.8 1.2" />
      </svg>
    </span>
  );
}
