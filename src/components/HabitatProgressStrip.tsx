import { units, getLessonsForUnit } from "@/lib/manifest";
import { ACCENTS } from "@/lib/theme";
import { useGame } from "@/game/store";
import { HabitatGlyph } from "@/components/brand/HabitatGlyph";
import { cn } from "@/lib/cn";

/**
 * Compact strip showing every habitat as a small glyph token, filled in its
 * accent color once every lesson in that unit is done. Lives in Settings →
 * Field Log so the user can see at-a-glance how many habitats are complete
 * without us having to add another card to Home.
 *
 * Design intent: feels like a row of botanical-specimen seals, not a
 * gamified progress bar. Tooltip + aria-label per token name the habitat.
 */
export function HabitatProgressStrip() {
  const completed = useGame((s) => s.completedLessons);
  const total = units.length;

  const states = units.map((u) => {
    const lessons = getLessonsForUnit(u.id);
    const done = lessons.filter((l) => completed[l.id]).length;
    return {
      unit: u,
      isComplete: lessons.length > 0 && done === lessons.length,
      hasProgress: done > 0,
    };
  });
  const completeCount = states.filter((s) => s.isComplete).length;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-(--color-ink-soft)">
          Habitats
        </p>
        <p className="font-mono text-[10px] font-medium tabular-nums text-(--color-ink-soft)">
          {completeCount}/{total}
        </p>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {states.map(({ unit, isComplete, hasProgress }) => {
          const accent = ACCENTS[unit.accent];
          return (
            <li key={unit.id}>
              <span
                role="img"
                aria-label={`${unit.title}${isComplete ? " — complete" : hasProgress ? " — in progress" : ""}`}
                title={`${unit.title}${isComplete ? " — complete" : hasProgress ? " — in progress" : ""}`}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full border-2 transition-colors",
                  isComplete
                    ? cn(accent.doneBadgeBg, "border-transparent text-white")
                    : hasProgress
                      ? cn(accent.doneBg, accent.unlockedBorder, accent.label)
                      : "border-(--color-line) bg-(--color-surface) text-(--color-ink-soft)/60",
                )}
              >
                <HabitatGlyph accent={unit.accent} className="h-5 w-5" />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
