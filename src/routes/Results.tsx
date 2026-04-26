import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useGame } from "@/game/store";
import { lessonComplete } from "@/lib/feedback";
import { getLesson, nextLesson as findNextLesson } from "@/lib/manifest";

export function ResultsRoute() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const active = useGame((s) => s.active);
  const finalize = useGame((s) => s.finalizeLesson);
  const completed = useGame((s) => s.completedLessons);
  // We finalize once on mount (active is still set when arriving here).
  const [snap, setSnap] = useState<{
    xpGained: number;
    passed: boolean;
    correct: number;
    total: number;
    hearts: number;
  } | null>(null);

  useEffect(() => {
    if (!active && !snap) {
      // No active lesson and no snapshot — user landed cold; bounce home.
      nav("/", { replace: true });
      return;
    }
    if (active && !snap) {
      const correct = active.correctCount;
      const total = active.exercises.length;
      const hearts = active.hearts;
      const result = finalize();
      if (result) {
        setSnap({ ...result, correct, total, hearts });
        if (result.passed) {
          lessonComplete();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
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
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center justify-center gap-6 px-6 py-10 text-center">
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
      <div className="flex w-full flex-col gap-3">
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
          Back to map
        </Link>
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
