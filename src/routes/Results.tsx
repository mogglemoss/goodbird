import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useGame } from "@/game/store";
import { lessonComplete } from "@/lib/feedback";
import { getLesson, getSpecies, nextLesson as findNextLesson } from "@/lib/manifest";
import { PlaySoundButton } from "@/components/PlaySoundButton";

interface Snapshot {
  xpGained: number;
  passed: boolean;
  correct: number;
  total: number;
  hearts: number;
  missedSpeciesIds: string[];
  xpToday: number;
  dailyGoal: number;
  goalReached: boolean;
}

export function ResultsRoute() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const active = useGame((s) => s.active);
  const finalize = useGame((s) => s.finalizeLesson);
  const completed = useGame((s) => s.completedLessons);
  const [snap, setSnap] = useState<Snapshot | null>(null);

  useEffect(() => {
    if (!active && !snap) {
      nav("/", { replace: true });
      return;
    }
    if (active && !snap) {
      const correct = active.correctCount;
      const total = active.exercises.length;
      const hearts = active.hearts;
      // Unique species the user got wrong on at least once.
      const missed = new Set<string>();
      for (const r of active.results) {
        if (!r.correct && r.speciesId) missed.add(r.speciesId);
      }
      const missedSpeciesIds = [...missed];
      const result = finalize();
      if (result) {
        setSnap({ ...result, correct, total, hearts, missedSpeciesIds });
        if (result.passed) {
          lessonComplete();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
        // Bonus celebration when the daily goal was crossed this lesson.
        if (result.goalReached) {
          setTimeout(() => {
            confetti({ particleCount: 140, spread: 120, startVelocity: 45, origin: { y: 0.5 } });
          }, 350);
        }
      }
    }
  }, [active, snap, finalize, nav]);

  const lessonTitle = useMemo(() => {
    try { return getLesson(id).title; } catch { return "Lesson"; }
  }, [id]);
  const nextLesson = useMemo(() => findNextLesson(id), [id]);

  if (!snap) return null;
  const accuracy = Math.round((snap.correct / snap.total) * 100);

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center gap-6 px-6 py-10 text-center sm:max-w-lg">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="grid h-24 w-24 place-items-center rounded-full bg-(--color-moss-100) text-5xl"
      >
        {snap.passed ? "🪶" : "🌱"}
      </motion.div>
      <div>
        <h1 className="font-display text-3xl">
          {snap.passed ? "Lesson complete" : "Out of hearts"}
        </h1>
        <p className="mt-1 text-(--color-ink-soft)">{lessonTitle}</p>
      </div>
      <div className="grid w-full grid-cols-3 gap-3">
        <Stat label="XP" value={`+${snap.xpGained}`} accent="moss" />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        <Stat label="Hearts" value={`${snap.hearts}/3`} />
      </div>

      <DailyGoalBar
        xpToday={snap.xpToday}
        dailyGoal={snap.dailyGoal}
        justReached={snap.goalReached}
      />

      {snap.missedSpeciesIds.length > 0 && (
        <section className="w-full">
          <h2 className="text-left text-xs font-semibold uppercase tracking-wider text-(--color-ink-soft)">
            Listen again
          </h2>
          <ul className="mt-2 flex flex-col gap-2">
            {snap.missedSpeciesIds.map((sid) => (
              <MissedSpeciesRow key={sid} speciesId={sid} />
            ))}
          </ul>
        </section>
      )}

      <div className="mt-2 flex w-full flex-col gap-3">
        {snap.passed && nextLesson && completed[id] && (
          <Link
            to={`/lesson/${nextLesson.id}`}
            className="tap-target rounded-full bg-(--color-moss-500) px-6 py-3 text-center font-semibold text-white shadow-(--shadow-pop) transition-transform active:scale-95 hover:bg-(--color-moss-600)"
          >
            Next lesson →
          </Link>
        )}
        {!snap.passed && (
          <Link
            to={`/lesson/${id}`}
            className="tap-target rounded-full bg-(--color-moss-500) px-6 py-3 text-center font-semibold text-white shadow-(--shadow-pop) transition-transform active:scale-95 hover:bg-(--color-moss-600)"
          >
            Try again
          </Link>
        )}
        <Link
          to="/"
          className="tap-target rounded-full border-2 border-(--color-line) bg-(--color-surface) px-6 py-3 text-center font-semibold text-(--color-ink) transition-colors hover:border-(--color-moss-300)"
        >
          Back to habitats
        </Link>
      </div>
    </div>
  );
}

function MissedSpeciesRow({ speciesId }: { speciesId: string }) {
  const sp = (() => { try { return getSpecies(speciesId); } catch { return null; } })();
  if (!sp) return null;
  const url = sp.recordings[0]?.url;
  return (
    <li>
      <Link
        to={`/species/${sp.id}`}
        className="flex items-center gap-3 rounded-(--radius-card) border-2 border-(--color-line) bg-(--color-surface) p-2 text-left shadow-(--shadow-soft) transition-colors hover:border-(--color-moss-300)"
      >
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-(--color-sand-50)">
          {sp.imageUrl ? (
            <img src={sp.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="grid h-full w-full place-items-center text-xl">🪶</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{sp.commonName}</div>
          <div className="truncate text-xs text-(--color-ink-soft)">"{sp.mnemonic}"</div>
        </div>
        {url && <PlaySoundButton url={url} size="sm" ariaLabel={`Play ${sp.commonName}`} />}
      </Link>
    </li>
  );
}

function DailyGoalBar({ xpToday, dailyGoal, justReached }: { xpToday: number; dailyGoal: number; justReached: boolean }) {
  const pct = Math.min(100, Math.round((xpToday / dailyGoal) * 100));
  const reached = xpToday >= dailyGoal;
  return (
    <div className="w-full rounded-2xl border-2 border-(--color-line) bg-(--color-surface) px-4 py-3 text-left">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold">
          {reached ? (
            <>Daily goal {justReached ? "reached today 🔥" : "complete"}</>
          ) : (
            <>Daily goal</>
          )}
        </span>
        <span className="text-(--color-ink-soft)">
          {Math.min(xpToday, dailyGoal)}/{dailyGoal} XP
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-(--color-line)">
        <motion.div
          className="h-full rounded-full bg-(--color-moss-500)"
          initial={{ width: `${Math.max(0, pct - 30)}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: "moss" }) {
  return (
    <div className={`rounded-2xl border-2 border-(--color-line) bg-(--color-surface) px-3 py-4 ${accent === "moss" ? "border-(--color-moss-300) bg-(--color-moss-50)" : ""}`}>
      <div className="font-display text-2xl text-(--color-ink)">{value}</div>
      <div className="text-xs uppercase tracking-wider text-(--color-ink-soft)">{label}</div>
    </div>
  );
}
