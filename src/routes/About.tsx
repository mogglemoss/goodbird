import { Link, useNavigate } from "react-router-dom";
import { Wordmark } from "@/components/brand/Wordmark";
import { units, allSpeciesWithRecordings } from "@/lib/manifest";

export function AboutRoute() {
  const nav = useNavigate();
  const speciesCount = allSpeciesWithRecordings().length;
  const unitCount = units.length;

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-24 pt-4 sm:max-w-lg">
      <div className="flex items-center justify-between">
        <button
          onClick={() => nav(-1)}
          aria-label="Back"
          className="grid h-10 w-10 place-items-center rounded-full text-(--color-ink-soft) hover:bg-(--color-line) cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--color-ink-soft)">
          About
        </span>
        <span className="w-10" />
      </div>

      <div className="mt-6 text-center">
        <Wordmark size="lg" />
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-(--color-ink-soft)">
          v{__APP_VERSION__}
        </p>
      </div>

      <p className="mx-auto mt-6 max-w-sm text-center font-display text-xl leading-snug">
        A field guide you can hear.
      </p>

      <section className="mt-8 space-y-4 text-sm leading-relaxed text-(--color-ink-soft)">
        <p>
          Duolingo-style ear training for the birds of West Marin, California.
          {" "}
          <span className="text-(--color-ink)">{unitCount} habitats</span>,
          {" "}
          <span className="text-(--color-ink)">{speciesCount} species</span>{" "}
          (and counting), each one a small course built around the calls and
          songs you'd actually hear in that place.
        </p>
        <p>
          Built as a no-account, no-backend prototype. Your progress lives in
          this browser; nothing leaves your device unless you tap{" "}
          <em className="text-(--color-ink)">Send feedback</em>.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-(--color-moss-700)">
          A note for the trail
        </h2>
        <p className="mt-2 rounded-2xl border-2 border-(--color-moss-300) bg-(--color-moss-50) px-4 py-3 text-sm leading-snug">
          <strong>Listen at home; watch in the field.</strong>{" "}
          <span className="text-(--color-ink-soft)">
            Playing recordings outside to attract birds stresses them and
            disturbs territories, especially during nesting season. The
            recordings are for ear training, not as bait.
          </span>
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-(--color-ink-soft)">
          Sources
        </h2>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="rounded-2xl border-2 border-(--color-line) bg-(--color-surface) px-4 py-3">
            <div className="font-medium">Recordings</div>
            <p className="mt-0.5 text-xs leading-snug text-(--color-ink-soft)">
              <a href="https://xeno-canto.org" target="_blank" rel="noopener noreferrer" className="text-(--color-moss-700) underline">xeno-canto.org</a>
              {" "}— a community-curated archive of bird sounds. Each clip
              shown with its recordist and CC license; full credit on the
              species detail page.
            </p>
          </li>
          <li className="rounded-2xl border-2 border-(--color-line) bg-(--color-surface) px-4 py-3">
            <div className="font-medium">Photographs</div>
            <p className="mt-0.5 text-xs leading-snug text-(--color-ink-soft)">
              <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="text-(--color-moss-700) underline">Wikimedia Commons</a>
              {" "}thumbnails, fetched at build time and cached. Public domain
              or Creative Commons.
            </p>
          </li>
          <li className="rounded-2xl border-2 border-(--color-line) bg-(--color-surface) px-4 py-3">
            <div className="font-medium">Observation data</div>
            <p className="mt-0.5 text-xs leading-snug text-(--color-ink-soft)">
              <a href="https://inaturalist.org" target="_blank" rel="noopener noreferrer" className="text-(--color-moss-700) underline">iNaturalist</a>
              {" "}— used as a no-key fallback when xeno-canto isn't reachable
              during a manifest build.
            </p>
          </li>
        </ul>
      </section>

      <section className="mt-8 flex flex-col items-center gap-3">
        <a
          href="https://github.com/mogglemoss/goodbird"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-(--color-ink-soft) underline hover:text-(--color-ink)"
        >
          Source on GitHub · MIT
        </a>
        <Link
          to="/"
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-(--color-ink-soft) hover:text-(--color-ink)"
        >
          ← Home
        </Link>
      </section>
    </div>
  );
}
