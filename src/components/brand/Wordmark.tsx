import { cn } from "@/lib/cn";

/**
 * The "goodbird" brand lockup — compact version (mark + wordmark, no
 * tagline). Used for the sticky top bar and Settings sheet.
 *
 * Renders both light and dark PNG variants in the DOM; index.css hides
 * one via `.wordmark-light` / `.wordmark-dark` based on the active
 * theme. Both variants share the same intrinsic dimensions so layout
 * is stable across theme changes.
 */

interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-6",                // 24 px tall — Settings sheet
  md: "h-7 sm:h-9",         // 28 → 36 px — sticky top bar (mobile shrinks
                            // 1 notch so narrow phones like Pixel 10 Pro
                            // don't squeeze the wordmark against the pills)
  lg: "h-12",               // 48 px tall — generic large
};

export function Wordmark({ size = "sm", className }: Props) {
  const sizeClass = SIZES[size];
  return (
    <>
      <img
        src="/lockup-compact.png"
        srcSet="/lockup-compact.png 1x, /lockup-compact-2x.png 2x"
        alt="goodbird"
        width={720}
        height={167}
        className={cn("wordmark-light w-auto shrink-0", sizeClass, className)}
      />
      <img
        src="/lockup-compact-dark.png"
        srcSet="/lockup-compact-dark.png 1x, /lockup-compact-dark-2x.png 2x"
        alt=""
        aria-hidden
        width={720}
        height={167}
        className={cn("wordmark-dark w-auto shrink-0", sizeClass, className)}
      />
    </>
  );
}
