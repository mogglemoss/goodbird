import { Link, useNavigate } from "react-router-dom";
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

      {/* Hero lockup — full version with tagline, horizontally centered.
          Both light and dark variants render; CSS in index.css hides the
          inactive one via .wordmark-light / .wordmark-dark. */}
      <div className="mt-8 flex flex-col items-center text-center">
        <img
          src="/lockup.png"
          srcSet="/lockup.png 1x, /lockup-2x.png 2x"
          alt="goodbird"
          width={720}
          height={167}
          className="wordmark-light block h-auto w-full"
        />
        <img
          src="/lockup-dark.png"
          srcSet="/lockup-dark.png 1x, /lockup-dark-2x.png 2x"
          alt=""
          aria-hidden
          width={720}
          height={167}
          className="wordmark-dark h-auto w-full"
        />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-(--color-ink-soft)">
          v{__APP_VERSION__}
        </p>
      </div>

      <p className="mx-auto mt-6 max-w-sm text-center font-display text-xl leading-snug">
        Listen at home, watch in the field.
      </p>

      <section className="mt-8 space-y-4 text-sm leading-relaxed text-(--color-ink-soft)">
        <p>
          Bite-sized ear training for the birds of West Marin, California.
          {" "}
          <span className="text-(--color-ink)">{unitCount} habitats</span>,
          {" "}
          <span className="text-(--color-ink)">{speciesCount} species</span>{" "}
          (and counting), each one a small course built around the calls and
          songs you'd actually hear in that place.
        </p>
        <p>
          No accounts. No client-side tracking. Your progress lives in this
          browser; nothing leaves your device unless you tap{" "}
          <em className="text-(--color-ink)">Send feedback</em>.
        </p>
      </section>

      {/* Personal note from the maker. Quirky/sincere in tone, slight
          left-border treatment to signal "aside" rather than spec copy. */}
      <section className="mt-6 border-l-4 border-(--color-moss-300) pl-4">
        <p className="text-sm leading-relaxed italic text-(--color-ink-soft)">
          A note: we made this app because we love these birds.{" "}
          <strong className="not-italic text-(--color-ink)">Tracy Corbin</strong>
          {" "}(my wife) and{" "}
          <strong className="not-italic text-(--color-ink)">Beth Lucas</strong>
          {" "}(fellow bird-nerd) had the idea, wanted a way to learn the
          calls of West Marin, and convinced me to build it. Then they
          kept feeding me <span className="not-italic">"wait, what was that?"</span>
          {" "}until the species list was right.
        </p>
        <p className="mt-3 text-sm leading-relaxed italic text-(--color-ink-soft)">
          They're the real birders. I'm the real nerd. goodbird is a
          product of the three of us.
        </p>
        <p className="mt-3 font-display text-base text-(--color-moss-700)">
          — Scott Corbin
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

      <section className="mt-8">
        <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-(--color-moss-700)">
          Support local birds
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-(--color-ink-soft)">
          This app teaches the songs. These are the people protecting the
          birds making them. If you love the birds of West Marin as we do,
          consider supporting their work — any of the five, any amount.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="rounded-2xl border-2 border-(--color-line) bg-(--color-surface) px-4 py-3">
            <a
              href="https://eacmarin.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-(--color-moss-700) underline"
            >
              Environmental Action Committee of West Marin
            </a>
            <p className="mt-0.5 text-xs leading-snug text-(--color-ink-soft)">
              Pt. Reyes Station-based; advocates for local biodiversity and
              hosts the annual Pt. Reyes Birding &amp; Nature Festival.
            </p>
          </li>
          <li className="rounded-2xl border-2 border-(--color-line) bg-(--color-surface) px-4 py-3">
            <a
              href="https://ptreyes.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-(--color-moss-700) underline"
            >
              Point Reyes National Seashore Association
            </a>
            <p className="mt-0.5 text-xs leading-snug text-(--color-ink-soft)">
              The park's nonprofit partner — runs the Field Institute's natural
              history classes and the seashore's education programs.
            </p>
          </li>
          <li className="rounded-2xl border-2 border-(--color-line) bg-(--color-surface) px-4 py-3">
            <a
              href="https://www.pointblue.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-(--color-moss-700) underline"
            >
              Point Blue Conservation Science
            </a>
            <p className="mt-0.5 text-xs leading-snug text-(--color-ink-soft)">
              Climate-smart bird research; runs the Palomarin Field Station
              near Bolinas — continuous songbird monitoring since 1966.
            </p>
          </li>
          <li className="rounded-2xl border-2 border-(--color-line) bg-(--color-surface) px-4 py-3">
            <a
              href="https://marinaudubon.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-(--color-moss-700) underline"
            >
              Marin Audubon Society
            </a>
            <p className="mt-0.5 text-xs leading-snug text-(--color-ink-soft)">
              Acquires and restores habitat across Marin — tidal marshes,
              uplands, the places these birds actually live.
            </p>
          </li>
          <li className="rounded-2xl border-2 border-(--color-line) bg-(--color-surface) px-4 py-3">
            <a
              href="https://discoverwildcare.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-(--color-moss-700) underline"
            >
              WildCare
            </a>
            <p className="mt-0.5 text-xs leading-snug text-(--color-ink-soft)">
              San Rafael wildlife hospital — rescues, rehabilitates, and
              releases injured birds throughout the county.
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
