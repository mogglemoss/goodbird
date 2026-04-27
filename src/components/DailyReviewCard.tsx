import { Link } from "react-router-dom";
import { useGame } from "@/game/store";
import { pickReviewSpeciesIds, getSpecies } from "@/lib/manifest";
import { useMemo } from "react";

/**
 * "Daily review" — pulls the user's weakest + most-overdue species across
 * all units into a cross-unit lesson. Shown on Home only after the user
 * has any per-species history; otherwise nothing to review.
 *
 * The /lesson/review route is a virtual lesson; lib/manifest.ts returns
 * a synthetic LessonRef and the lesson-generator picks species via SRS.
 */
export function DailyReviewCard() {
  const speciesStats = useGame((s) => s.speciesStats);
  const hasHistory = Object.keys(speciesStats).length > 0;

  // Preview the top 5 species we'd review — same scoring the generator
  // uses, so the card and the lesson agree.
  const previewIds = useMemo(
    () => (hasHistory ? pickReviewSpeciesIds(speciesStats, 5) : []),
    [speciesStats, hasHistory],
  );

  if (!hasHistory) return null;

  const previewSpecies = previewIds.map((id) => {
    try { return getSpecies(id); } catch { return null; }
  }).filter((s): s is NonNullable<typeof s> => !!s);

  return (
    <Link
      to="/lesson/review"
      className="mt-6 flex items-center gap-3 rounded-(--radius-card) border-2 border-(--color-moss-300) bg-(--color-moss-50) px-4 py-3 shadow-(--shadow-soft) transition-colors hover:border-(--color-moss-500)"
    >
      <div className="flex -space-x-2">
        {previewSpecies.slice(0, 4).map((sp) => (
          <div
            key={sp.id}
            className="h-9 w-9 overflow-hidden rounded-full border-2 border-(--color-surface) bg-(--color-sand-50)"
            title={sp.commonName}
          >
            {sp.imageUrl ? (
              <img
                src={sp.imageUrl}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
                style={{ objectPosition: sp.imagePosition ?? "top" }}
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-base">🪶</div>
            )}
          </div>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-(--color-moss-700)">
          Daily review
        </p>
        <p className="mt-0.5 truncate font-display text-base leading-tight">
          Birds you've been working on
        </p>
        <p className="truncate text-xs text-(--color-ink-soft)">
          A short cross-habitat refresher
        </p>
      </div>
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-(--color-moss-500) text-white shadow-(--shadow-soft)">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>
    </Link>
  );
}
