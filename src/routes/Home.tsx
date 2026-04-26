import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { manifest, getSpecies } from "@/lib/manifest";
import { useGame } from "@/game/store";
import { cn } from "@/lib/cn";

export function HomeRoute() {
  const xp = useGame((s) => s.xp);
  const streak = useGame((s) => s.streak);
  const completed = useGame((s) => s.completedLessons);

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-24 pt-6">
      <Header xp={xp} streakDays={streak.days} />
      <div className="mt-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-(--color-moss-700)">{manifest.unit.habitat}</p>
        <h1 className="font-display text-3xl">{manifest.unit.title}</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-(--color-ink-soft)">{manifest.unit.description}</p>
      </div>
      <div className="mt-10 flex flex-col items-center gap-2">
        {manifest.lessons.map((lesson, i) => {
          const prev = manifest.lessons[i - 1];
          const unlocked = i === 0 || (prev && !!completed[prev.id]);
          const done = !!completed[lesson.id];
          return (
            <LessonNode
              key={lesson.id}
              title={lesson.title}
              unlocked={unlocked}
              done={done}
              accuracy={completed[lesson.id]?.bestAccuracy}
              to={`/lesson/${lesson.id}`}
              offset={i % 2 === 0 ? "left" : "right"}
              birdCount={lesson.speciesIds.length}
              speciesPreview={lesson.speciesIds.slice(0, 3).map((id) => getSpecies(id))}
            />
          );
        })}
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

interface NodeProps {
  title: string;
  unlocked: boolean;
  done: boolean;
  accuracy?: number;
  to: string;
  offset: "left" | "right";
  birdCount: number;
  speciesPreview: ReturnType<typeof getSpecies>[];
}

function LessonNode({ title, unlocked, done, accuracy, to, offset, birdCount, speciesPreview }: NodeProps) {
  const inner = (
    <motion.div
      whileHover={unlocked ? { y: -2 } : undefined}
      whileTap={unlocked ? { scale: 0.97 } : undefined}
      className={cn(
        "relative flex w-full max-w-sm items-center gap-4 rounded-(--radius-card) border-2 px-5 py-4 shadow-(--shadow-soft) transition-colors",
        unlocked
          ? "cursor-pointer border-(--color-moss-300) bg-(--color-surface) hover:border-(--color-moss-500)"
          : "cursor-not-allowed border-dashed border-(--color-line) bg-(--color-bg) opacity-70",
        done && "border-(--color-moss-500) bg-(--color-moss-50)",
      )}
    >
      <NodeBadge done={done} unlocked={unlocked} />
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
    <div className={cn("flex w-full", offset === "left" ? "justify-start" : "justify-end")}>
      {unlocked ? <Link to={to}>{inner}</Link> : inner}
    </div>
  );
}

function NodeBadge({ done, unlocked }: { done: boolean; unlocked: boolean }) {
  return (
    <div
      className={cn(
        "grid h-12 w-12 shrink-0 place-items-center rounded-full text-xl",
        done
          ? "bg-(--color-moss-500) text-white"
          : unlocked
            ? "bg-(--color-moss-100) text-(--color-moss-700)"
            : "bg-(--color-line) text-(--color-ink-soft)",
      )}
      aria-hidden
    >
      {done ? "✓" : unlocked ? "🎧" : "🔒"}
    </div>
  );
}
