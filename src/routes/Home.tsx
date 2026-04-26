import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { units, getLessonsForUnit, getSpecies } from "@/lib/manifest";
import { useGame } from "@/game/store";
import { ACCENTS } from "@/lib/theme";
import type { Unit } from "@/lib/types";
import { cn } from "@/lib/cn";

export function HomeRoute() {
  const xp = useGame((s) => s.xp);
  const streak = useGame((s) => s.streak);
  const completed = useGame((s) => s.completedLessons);

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-24 pt-6">
      <Header xp={xp} streakDays={streak.days} />
      <div className="mt-6 space-y-10">
        {units.map((unit) => (
          <UnitSection key={unit.id} unit={unit} completed={completed} />
        ))}
      </div>
    </div>
  );
}

interface UnitSectionProps {
  unit: Unit;
  completed: Record<string, { bestAccuracy: number }>;
}

function UnitSection({ unit, completed }: UnitSectionProps) {
  const lessons = getLessonsForUnit(unit.id);
  const accent = ACCENTS[unit.accent];

  return (
    <section>
      <div className="text-center">
        <p className={cn("text-sm font-medium uppercase tracking-wider", accent.label)}>
          {unit.habitat}
        </p>
        <h2 className="mt-1 font-display text-2xl">{unit.title}</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-(--color-ink-soft)">
          {unit.description}
        </p>
      </div>
      <div className="mt-6 flex flex-col items-center gap-2">
        {lessons.map((lesson, i) => {
          const prevLesson = lessons[i - 1];
          // First lesson of every unit is always unlocked; the rest gate on the previous lesson within the same unit.
          const lessonUnlocked = i === 0 || !!(prevLesson && completed[prevLesson.id]);
          const done = !!completed[lesson.id];
          return (
            <LessonNode
              key={lesson.id}
              title={lesson.title}
              unlocked={lessonUnlocked}
              done={done}
              accuracy={completed[lesson.id]?.bestAccuracy}
              to={`/lesson/${lesson.id}`}
              birdCount={lesson.speciesIds.length}
              speciesPreview={lesson.speciesIds.slice(0, 3).map((id) => getSpecies(id))}
              accent={accent}
            />
          );
        })}
      </div>
    </section>
  );
}

function Header({ xp, streakDays }: { xp: number; streakDays: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 font-display text-xl">
        <span aria-hidden>🪶</span>
        <span>goodbird</span>
      </div>
      <div className="flex items-center gap-3">
        <Pill icon="🔥" value={streakDays} label="day streak" muted={streakDays === 0} />
        <Pill icon="✦" value={xp} label="xp" />
      </div>
    </div>
  );
}

function Pill({ icon, value, label, muted }: { icon: string; value: number; label: string; muted?: boolean }) {
  return (
    <div
      title={label}
      className={cn(
        "flex items-center gap-1 rounded-full border-2 border-(--color-line) bg-(--color-surface) px-3 py-1 text-sm font-semibold",
        muted && "opacity-60",
      )}
    >
      <span aria-hidden>{icon}</span>
      <span>{value}</span>
    </div>
  );
}

interface NodeProps {
  title: string;
  unlocked: boolean;
  done: boolean;
  accuracy?: number;
  to: string;
  birdCount: number;
  speciesPreview: ReturnType<typeof getSpecies>[];
  accent: typeof ACCENTS[keyof typeof ACCENTS];
}

function LessonNode({ title, unlocked, done, accuracy, to, birdCount, speciesPreview, accent }: NodeProps) {
  const inner = (
    <motion.div
      whileHover={unlocked ? { y: -2 } : undefined}
      whileTap={unlocked ? { scale: 0.97 } : undefined}
      className={cn(
        "relative flex w-full items-center gap-4 rounded-(--radius-card) border-2 px-5 py-4 shadow-(--shadow-soft) transition-colors",
        unlocked
          ? cn("cursor-pointer bg-(--color-surface)", accent.unlockedBorder, accent.unlockedHover)
          : "cursor-not-allowed border-dashed border-(--color-line) bg-(--color-bg) opacity-70",
        done && cn(accent.doneBorder, accent.doneBg),
      )}
    >
      <NodeBadge done={done} unlocked={unlocked} accent={accent} />
      <div className="min-w-0 flex-1">
        <div className="font-display text-lg leading-tight">{title}</div>
        <div className="mt-0.5 text-xs text-(--color-ink-soft)">
          {done ? `Best ${accuracy ?? 0}% · ${birdCount} birds` : `${birdCount} birds`}
        </div>
      </div>
      <div className="flex -space-x-2">
        {speciesPreview.slice(0, 3).map((s) => (
          <div
            key={s.id}
            className="h-8 w-8 overflow-hidden rounded-full border-2 border-(--color-surface) bg-(--color-sand-50)"
            title={s.commonName}
          >
            {s.imageUrl ? (
              <img src={s.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-base">🪶</div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
  return (
    <div className="flex w-full">
      {unlocked ? <Link to={to} className="w-full">{inner}</Link> : inner}
    </div>
  );
}

function NodeBadge({ done, unlocked, accent }: { done: boolean; unlocked: boolean; accent: typeof ACCENTS[keyof typeof ACCENTS] }) {
  return (
    <div
      className={cn(
        "grid h-12 w-12 shrink-0 place-items-center rounded-full text-xl",
        done
          ? cn("text-white", accent.doneBadgeBg)
          : unlocked
            ? cn(accent.badgeBg, accent.badgeText)
            : "bg-(--color-line) text-(--color-ink-soft)",
      )}
      aria-hidden
    >
      {done ? "✓" : unlocked ? "🎧" : "🔒"}
    </div>
  );
}
