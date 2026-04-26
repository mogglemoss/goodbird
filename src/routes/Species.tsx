import { Link, useNavigate, useParams } from "react-router-dom";
import { allLessons, getSpecies, units } from "@/lib/manifest";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useGame } from "@/game/store";
import { ACCENTS } from "@/lib/theme";
import { cn } from "@/lib/cn";

export function SpeciesRoute() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const favorites = useGame((s) => s.favorites);
  const stats = useGame((s) => s.speciesStats[id]);
  const toggleFavorite = useGame((s) => s.toggleFavorite);

  let species;
  try {
    species = getSpecies(id);
  } catch {
    nav("/", { replace: true });
    return null;
  }

  const isFavorite = !!favorites[id];

  // Find which units this species belongs to (a species can appear in multiple units).
  const memberUnits = units.filter((u) =>
    allLessons.some((l) => l.unitId === u.id && l.speciesIds.includes(id)),
  );

  const accuracy = stats && stats.timesSeen
    ? Math.round((stats.timesCorrect / stats.timesSeen) * 100)
    : null;

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
        <button
          onClick={() => toggleFavorite(id)}
          aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
          aria-pressed={isFavorite}
          className={cn(
            "grid h-10 w-10 place-items-center rounded-full transition-colors cursor-pointer",
            isFavorite ? "text-(--color-wrong)" : "text-(--color-ink-soft) hover:bg-(--color-line)",
          )}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7.5-4.6-9.6-9.2C1 8.5 2.6 5 6.1 5c2 0 3.6 1.1 4.4 2.7C11.3 6.1 12.9 5 14.9 5c3.5 0 5.1 3.5 3.7 6.8C19.5 16.4 12 21 12 21z" />
          </svg>
        </button>
      </div>

      <div className="mt-2 overflow-hidden rounded-(--radius-card) bg-(--color-sand-50) shadow-(--shadow-soft)">
        {species.imageUrl ? (
          <img src={species.imageUrl} alt={species.commonName} className="aspect-[4/3] w-full object-cover" />
        ) : (
          <div className="grid aspect-[4/3] w-full place-items-center text-6xl">🪶</div>
        )}
      </div>

      <div className="mt-4 text-center">
        <h1 className="font-display text-3xl">{species.commonName}</h1>
        <p className="mt-1 text-sm italic text-(--color-ink-soft)">{species.scientificName}</p>
        <p className="mx-auto mt-3 max-w-sm font-display text-lg leading-snug">
          "{species.mnemonic}"
        </p>
      </div>

      {memberUnits.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {memberUnits.map((u) => {
            const accent = ACCENTS[u.accent];
            return (
              <Link
                key={u.id}
                to={`/unit/${u.id}`}
                className={cn(
                  "rounded-full border-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                  accent.unlockedBorder,
                  accent.label,
                  "hover:bg-(--color-bg)",
                )}
              >
                {u.title}
              </Link>
            );
          })}
        </div>
      )}

      {stats && stats.timesSeen > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat label="Heard" value={String(stats.timesSeen)} />
          <Stat label="Correct" value={String(stats.timesCorrect)} />
          <Stat label="Accuracy" value={accuracy != null ? `${accuracy}%` : "—"} />
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-(--color-ink-soft)">
          Recordings ({species.recordings.length})
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {species.recordings.map((rec) => (
            <li
              key={rec.id}
              className="flex items-center gap-4 rounded-(--radius-card) border-2 border-(--color-line) bg-(--color-surface) p-3 shadow-(--shadow-soft)"
            >
              <AudioPlayer url={rec.url} size="md" label={`Play ${rec.id}`} />
              <div className="min-w-0 flex-1 text-sm">
                <div className="truncate font-medium">{rec.recordist || "Unknown recordist"}</div>
                <div className="truncate text-xs text-(--color-ink-soft)">{rec.location || "—"}</div>
                {rec.license && (
                  <a
                    href={rec.license.startsWith("http") ? rec.license : `https://creativecommons.org/${rec.license}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs text-(--color-moss-700) underline"
                  >
                    {rec.license.startsWith("http") ? "License" : rec.license}
                  </a>
                )}
              </div>
              {rec.sourceUrl && (
                <a
                  href={rec.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open recording source"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-(--color-ink-soft) hover:bg-(--color-line)"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 4h6v6" />
                    <path d="M20 4l-8 8" />
                    <path d="M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
                  </svg>
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border-2 border-(--color-line) bg-(--color-surface) px-3 py-3 text-center">
      <div className="font-display text-xl">{value}</div>
      <div className="text-xs uppercase tracking-wider text-(--color-ink-soft)">{label}</div>
    </div>
  );
}
