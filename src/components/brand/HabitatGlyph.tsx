import type { ReactElement } from "react";
import type { UnitAccent } from "@/lib/types";
import { cn } from "@/lib/cn";

/**
 * Small ink-line glyph per habitat. Sized to live next to numerals at the
 * top-right of a HabitatCard. Inherits color from the parent via currentColor.
 */
interface Props {
  accent: UnitAccent;
  className?: string;
}

export function HabitatGlyph({ accent, className }: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-hidden="true"
      className={cn("h-7 w-7", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {GLYPHS[accent] ?? GLYPHS.moss}
    </svg>
  );
}

const GLYPHS: Record<UnitAccent, ReactElement> = {
  // Coastal Scrub — cluster of round shrubs
  moss: (
    <>
      <circle cx="10" cy="20" r="4" />
      <circle cx="18" cy="16" r="5" />
      <circle cx="24" cy="22" r="3.5" />
      <path d="M6 26h22" strokeWidth="1" />
    </>
  ),
  // Oak Woodland — branching tree
  amber: (
    <>
      <path d="M16 28V14" />
      <circle cx="11" cy="11" r="4" />
      <circle cx="21" cy="10" r="4.5" />
      <circle cx="16" cy="6" r="3.5" />
      <path d="M16 18l-4 3M16 20l4 2" strokeWidth="1.2" />
    </>
  ),
  // Creekside / Riparian — three flowing waves
  sky: (
    <>
      <path d="M4 11c4 0 4-3 8-3s4 3 8 3 4-3 8-3" />
      <path d="M4 17c4 0 4-3 8-3s4 3 8 3 4-3 8-3" />
      <path d="M4 23c4 0 4-3 8-3s4 3 8 3 4-3 8-3" />
    </>
  ),
  // Marsh & Wetland — cattail stalks
  emerald: (
    <>
      <path d="M9 28V12" />
      <path d="M16 28V8" />
      <path d="M23 28V14" />
      <rect x="7.5" y="6" width="3" height="6" rx="1.2" fill="currentColor" />
      <rect x="14.5" y="2" width="3" height="6" rx="1.2" fill="currentColor" />
      <rect x="21.5" y="8" width="3" height="6" rx="1.2" fill="currentColor" />
      <path d="M5 28h22" strokeWidth="1" />
    </>
  ),
  // Coastal Conifer — pine triangle
  sand: (
    <>
      <path d="M16 4l-7 9h4l-6 8h5l-4 6h16l-4-6h5l-6-8h4z" />
      <path d="M16 27v3" />
    </>
  ),
  // Pasture / Open Country — hovering raptor over grass
  rose: (
    <>
      <path d="M3 14c4-3 6-3 8 0M21 14c2-3 4-3 8 0" />
      <circle cx="16" cy="14" r="1.4" fill="currentColor" />
      <path d="M5 26c2-2 4-2 6 0M11 26c2-2 4-2 6 0M17 26c2-2 4-2 6 0" />
    </>
  ),
  // Night Voices — crescent moon + two stars
  violet: (
    <>
      <path d="M21 10a8 8 0 1 0 0 12 6.5 6.5 0 0 1 0-12z" fill="currentColor" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
      <circle cx="13" cy="4" r="0.7" fill="currentColor" />
      <circle cx="6" cy="14" r="0.7" fill="currentColor" />
    </>
  ),
  // Fallback (sand) — unused but type-required
  indigo: (
    <>
      <circle cx="16" cy="16" r="10" />
    </>
  ),
};
