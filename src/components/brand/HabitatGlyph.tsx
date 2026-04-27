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
  // Soaring Country — raptor silhouette mid-soar
  slate: (
    <>
      {/* Sun-arc ridge */}
      <path d="M3 24h26" strokeWidth="0.8" />
      {/* Distant peak silhouette */}
      <path d="M3 24l8-8 5 5 6-6 7 9" strokeWidth="0.9" />
      {/* Soaring raptor — wide W-shape with body dot */}
      <path d="M9 11c2-2 4-2 7 1 3-3 5-3 7-1" strokeWidth="1.5" />
      <circle cx="16" cy="12" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  // Open Coast & Headlands — wave + pelican silhouette over sea cliff
  teal: (
    <>
      {/* Sea cliff (right edge) */}
      <path d="M22 13v15M22 13l4 3" strokeWidth="1" />
      {/* Two layered waves */}
      <path d="M3 22c3-2 5-2 8 0s5 2 8 0" />
      <path d="M3 27c3-2 5-2 8 0s5 2 8 0 5-2 8 0" strokeWidth="1.2" />
      {/* Pelican silhouette overhead */}
      <path d="M5 9c2-1 3-1 5 0 1-2 3-2 5 0M9 9v2" strokeWidth="1.2" />
    </>
  ),
  // Redwood & Mixed Forest — tall trunk + small bird silhouette mid-trunk
  orange: (
    <>
      {/* Tall straight trunk */}
      <path d="M16 4v24" strokeWidth="2" />
      {/* Branching boughs */}
      <path d="M16 9l-4-2M16 9l4-2M16 14l-5-2M16 14l5-2M16 19l-4-1.5M16 19l4-1.5" strokeWidth="0.8" />
      {/* Tiny bird mid-trunk (left side) */}
      <circle cx="13" cy="16" r="1" fill="currentColor" stroke="none" />
      <path d="M12 16h-1" strokeWidth="0.8" />
      {/* Forest floor */}
      <path d="M5 28h22" strokeWidth="1" />
    </>
  ),
  // Town & Garden — small flower (daisy-like) for garden feel
  fuchsia: (
    <>
      {/* 5-petal flower */}
      <circle cx="16" cy="14" r="2" />
      <circle cx="16" cy="9" r="2.5" />
      <circle cx="20.5" cy="12" r="2.5" />
      <circle cx="19" cy="17.5" r="2.5" />
      <circle cx="13" cy="17.5" r="2.5" />
      <circle cx="11.5" cy="12" r="2.5" />
      <circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" />
      {/* Stem & leaf */}
      <path d="M16 20v8" strokeWidth="1" />
      <path d="M16 24c2-1 3-2 4-3" strokeWidth="0.9" />
    </>
  ),
  // Tomales Bay / Estuary & Tideflats — shorebird at the tideline
  indigo: (
    <>
      {/* Tideline — two soft horizontals */}
      <path d="M3 22c4-1 6-1 10 0s6 1 10 0 4-1 6-1" strokeWidth="1.2" />
      <path d="M3 26h26" strokeWidth="1" />
      {/* Long-billed shorebird silhouette */}
      <path d="M14 16a2.5 2.5 0 0 1 5 0v3h-5z" fill="currentColor" stroke="none" />
      <circle cx="20.4" cy="14.4" r="1.6" fill="currentColor" stroke="none" />
      <path d="M22 14l5-3" />
      <path d="M15 19v3M18 19v3" strokeWidth="1.2" />
    </>
  ),
};
