import { cn } from "@/lib/cn";

/**
 * The "goodbird" brand lockup. Renders the rasterized lockup PNG (mark
 * + wordmark, no tagline) at three header-friendly sizes via height-only
 * sizing — width follows the source aspect ratio (~5.4:1).
 *
 * The lockup is a hand-tuned graphic so we ship the raster directly
 * rather than rebuilding it inline. srcSet picks @2x on retina screens.
 *
 * Colors are baked into the PNG (dark moss green). If dark-mode
 * legibility ever becomes an issue, swap to a mask-image approach so
 * the color tracks `currentColor`.
 */

interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-5",   // 20 px tall — Settings sheet, sticky bar
  md: "h-7",   // 28 px tall — sticky bar at desktop sizes
  lg: "h-10",  // 40 px tall — About page hero
};

export function Wordmark({ size = "sm", className }: Props) {
  return (
    <img
      src="/lockup.png"
      srcSet="/lockup.png 1x, /lockup-2x.png 2x"
      alt="goodbird"
      width={720}
      height={133}
      className={cn("w-auto", SIZES[size], className)}
      // Decorative role kept implicit via meaningful alt; no extra aria.
    />
  );
}
