import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { units, getLessonsForUnit, getSpecies, allLessons } from "@/lib/manifest";
import { useGame } from "@/game/store";
import { ACCENTS } from "@/lib/theme";
import type { Unit } from "@/lib/types";
import { cn } from "@/lib/cn";

export function HomeRoute() {
  const xp = useGame((s) => s.xp);
  const streak = useGame((s) => s.streak);
  const completed = useGame((s) => s.completedLessons);

  // Most-recently-completed lesson → which unit it belongs to → "Continue" hint.
  const continueTarget = (() => {
    let bestAt = 0;
    let target: { unitSlug: string; unitTitle: string } | null = null;
    for (const [lessonId, info] of Object.entries(completed)) {
      if (!info.lastPlayedAt || info.lastPlayedAt <= bestAt) continue;
      const lesson = allLessons.find((l) => l.id === lessonId);
      if (!lesson) continue;
      const unit = units.find((u) => u.id === lesson.unitId);
      if (!unit) continue;
      bestAt = info.lastPlayedAt;
      target = { unitSlug: unit.id, unitTitle: unit.title };
    }
    return target;
  })();

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-24 pt-6">
      <Header xp={xp} streakDays={streak.days} />

      <div className="mt-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-(--color-ink-soft)">
          West Marin
        </p>
        <h1 className="mt-1 font-display text-3xl">Pick a habitat</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-(--color-ink-soft)">
          Each habitat is its own ear-training course. Tap any to start.
        </p>
      </div>

      {continueTarget && (
        <Link
          to={`/unit/${continueTarget.unitSlug}`}
          className="mt-6 flex items-center justify-between gap-3 rounded-(--radius-card) border-2 border-(--color-moss-300) bg-(--color-moss-50) px-5 py-3 shadow-(--shadow-soft) transition-colors hover:border-(--color-moss-500)"
        >
          <div className="min-w-0">
            <div className="text-xs font-medium uppercase tracking-wider text-(--color-moss-700)">Continue</div>
            <div className="truncate font-display text-base">
              {(() => { try { return units.find((u) => u.id === continueTarget!.unitSlug)?.title ?? ""; } catch { return ""; } })()}
            </div>
          </div>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-(--color-moss-500) text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </div>
        </Link>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        {units.map((unit) => (
          <HabitatCard key={unit.id} unit={unit} completed={completed} />
        ))}
      </div>
    </div>
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

interface HabitatCardProps {
  unit: Unit;
  completed: Record<string, { bestAccuracy: number }>;
}

function HabitatCard({ unit, completed }: HabitatCardProps) {
  const lessons = getLessonsForUnit(unit.id);
  const speciesCount = new Set(lessons.flatMap((l) => l.speciesIds)).size;
  const lessonsDone = lessons.filter((l) => completed[l.id]).length;
  const totalLessons = lessons.length;
  const progress = totalLessons === 0 ? 0 : lessonsDone / totalLessons;
  const accent = ACCENTS[unit.accent];

  // Pull a few species to use as a visual sample (3 thumbnails on the card).
  const sampleSpecies = Array.from(new Set(lessons.flatMap((l) => l.speciesIds)))
    .slice(0, 3)
    .map((id) => getSpecies(id));

  return (
    <Link to={`/unit/${unit.id}`} className="block">
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-(--radius-card) border-2 bg-(--color-surface) p-4 shadow-(--shadow-soft) transition-colors",
          accent.unlockedBorder,
          accent.unlockedHover,
        )}
      >
        {/* species avatar strip */}
        <div className="flex -space-x-2">
          {sampleSpecies.map((s) => (
            <div
              key={s.id}
              className="h-9 w-9 overflow-hidden rounded-full border-2 border-(--color-surface) bg-(--color-sand-50)"
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

        <div className="mt-3 flex-1">
          <div className={cn("text-[11px] font-semibold uppercase tracking-wider", accent.label)}>
            {unit.habitat}
          </div>
          <div className="mt-0.5 font-display text-lg leading-tight">{unit.title}</div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-(--color-ink-soft)">
          <span>{speciesCount} birds</span>
          {lessonsDone > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>{lessonsDone}/{totalLessons}</span>
            </>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-(--color-line)">
          <motion.div
            className={cn("h-full rounded-full", accent.doneBadgeBg)}
            initial={false}
            animate={{ width: `${Math.max(progress * 100, lessonsDone > 0 ? 8 : 0)}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        </div>
      </motion.div>
    </Link>
  );
}
