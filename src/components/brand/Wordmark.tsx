import { cn } from "@/lib/cn";

/**
 * The "goodbird" brand lockup — compact version (mark + wordmark, no
 * tagline). Used for the sticky top bar and Settings sheet, where the
 * tagline would be too small to read. The About page renders the full
 * lockup directly via its own larger <img>; this component intentionally
 * does not surface a "size=lg + tagline" mode.
 *
 * srcSet picks @2x on retina screens. Color is baked into the PNG; if
 * dark-mode legibility ever becomes an issue, swap to mask-image so the
 * fill tracks `currentColor`.
 */

interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-6",   // 24 px tall — Settings sheet
  md: "h-9",   // 36 px tall — sticky top bar
  lg: "h-12",  // 48 px tall — generic large
};

export function Wordmark({ size = "sm", className }: Props) {
  return (
    <img
      src="/lockup-compact.png"
      srcSet="/lockup-compact.png 1x, /lockup-compact-2x.png 2x"
      alt="goodbird"
      width={720}
      height={167}
      className={cn("w-auto", SIZES[size], className)}
    />
  );
}
