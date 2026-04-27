import { Link } from "react-router-dom";
import { Wordmark } from "./brand/Wordmark";

interface Props {
  controls?: React.ReactNode;
}

/**
 * Always-sticky top bar. Carries the wordmark + the page's controls
 * (pills, settings menu, etc.) so they pin to the top on scroll. Sits
 * above the decorative Hero band on the home page; can be reused on
 * other routes that want the same persistent identity.
 *
 * The full-bleed trick (-mx-5) extends the bar to the viewport edges so
 * its bottom border doesn't end abruptly at the page container's
 * max-width on desktop.
 */
export function StickyTopBar({ controls }: Props) {
  return (
    <div
      className="sticky top-0 z-30 -mx-5 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] border-b border-(--color-line)/80 bg-(--color-bg)/90 px-5 py-2.5 backdrop-blur-md sm:py-3"
    >
      <div className="mx-auto flex w-full max-w-md items-center justify-between gap-4 sm:max-w-2xl lg:max-w-4xl">
        {/* Wordmark links to About — the meta page that explains what the app is,
            who built it, where the data comes from, and the field ethics. */}
        <Link to="/about" aria-label="About goodbird" className="rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-moss-300)">
          <Wordmark size="md" />
        </Link>
        {controls}
      </div>
    </div>
  );
}
