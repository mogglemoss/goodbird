import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getUnit, getLessonsForUnit, getSpecies, getSpeciesForUnit } from "@/lib/manifest";
import { useGame } from "@/game/store";
import { ACCENTS } from "@/lib/theme";
import { cn } from "@/lib/cn";

export function UnitRoute() {
  const { slug = "" } = useParams();
  const nav = useNavigate();
  const completed = useGame((s) => s.completedLessons);

  let unit;
  try {
    unit = getUnit(slug);
  } catch {
    nav("/", { replace: true });
    return null;
  }

  const lessons = getLessonsForUnit(unit.id);
  const accent = ACCENTS[unit.accent];

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-24 pt-4 sm:max-w-lg">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          aria-label="Back to habitats"
          className="grid h-10 w-10 place-items-center rounded-full text-(--color-ink-soft) hover:bg-(--color-line)"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </Link>
        <span className={cn("text-xs font-medium uppercase tracking-wider", accent.label)}>
          {unit.habitat}
        </span>
        <span className="w-10" />
      </div>

      <div className="mt-2 text-center">
        <h1 className="font-display text-3xl">{unit.title}</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-(--color-ink-soft)">
          {unit.description}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        {lessons.map((lesson, i) => {
          const prevLesson = lessons[i - 1];
          const lessonUnlocked = i === 0 || !!(prevLesson && completed[prevLesson.id]);
          const done = !!completed[lesson.id];
          const inner = (
            <motion.div
              whileHover={lessonUnlocked ? { y: -2 } : undefined}
              whileTap={lessonUnlocked ? { scale: 0.97 } : undefined}
              className={cn(
                "relative flex w-full items-center gap-4 rounded-(--radius-card) border-2 px-5 py-4 shadow-(--shadow-soft) transition-colors",
                lessonUnlocked
                  ? cn("cursor-pointer bg-(--color-surface)", accent.unlockedBorder, accent.unlockedHover)
                  : "cursor-not-allowed border-dashed border-(--color-line) bg-(--color-bg) opacity-70",
                done && cn(accent.doneBorder, accent.doneBg),
              )}
            >
              <div
                className={cn(
                  "grid h-12 w-12 shrink-0 place-items-center rounded-full text-xl",
                  done
                    ? cn("text-white", accent.doneBadgeBg)
                    : lessonUnlocked
                      ? cn(accent.badgeBg, accent.badgeText)
                      : "bg-(--color-line) text-(--color-ink-soft)",
                )}
                aria-hidden
              >
                {done ? "✓" : lessonUnlocked ? "🎧" : "🔒"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg leading-tight">{lesson.title}</div>
                <div className="mt-0.5 text-xs text-(--color-ink-soft)">
                  {done ? `Best ${completed[lesson.id]?.bestAccuracy ?? 0}% · ${lesson.speciesIds.length} birds` : `${lesson.speciesIds.length} birds`}
                </div>
              </div>
              <div className="flex -space-x-2">
                {lesson.speciesIds.slice(0, 3).map((id) => {
                  const s = getSpecies(id);
                  return (
                    <div
                      key={id}
                      className="h-8 w-8 overflow-hidden rounded-full border-2 border-(--color-surface) bg-(--color-sand-50)"
                      title={s.commonName}
                    >
                      {s.imageUrl ? (
                        <img src={s.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-base">🪶</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
          return (
            <div key={lesson.id} className="flex w-full">
              {lessonUnlocked ? <Link to={`/lesson/${lesson.id}`} className="w-full">{inner}</Link> : inner}
            </div>
          );
        })}
      </div>

      {/* Browse all species in this habitat — entry point to species detail without playing. */}
      <section className="mt-12">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-(--color-ink-soft)">
          Birds in this habitat
        </h3>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {getSpeciesForUnit(unit.id).map((sp) => (
            <Link
              key={sp.id}
              to={`/species/${sp.id}`}
              className={cn(
                "group flex flex-col items-center gap-1.5 rounded-(--radius-card) border-2 border-(--color-line) bg-(--color-surface) p-2 shadow-(--shadow-soft) transition-colors",
                accent.unlockedHover,
              )}
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-(--color-sand-50)">
                {sp.imageUrl ? (
                  <img src={sp.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-2xl">🪶</div>
                )}
              </div>
              <div className="line-clamp-2 w-full text-center text-xs font-medium leading-tight">
                {sp.commonName}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
