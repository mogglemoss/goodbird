import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Exercise, SpeciesStat } from "@/lib/types";
import { generateLesson } from "./lesson-generator";
import { getLesson } from "@/lib/manifest";
import { STARTING_HEARTS } from "./scoring";

type LessonOutcome = "passed" | "failed" | "in-progress";

interface ActiveLesson {
  lessonId: string;
  exercises: Exercise[];
  index: number;
  hearts: number;
  correctCount: number;
  startedAt: number;
  outcome: LessonOutcome;
  results: Array<{ correct: boolean; speciesId: string | null }>;
}

interface GameState {
  // Persistent
  xp: number;
  streak: { lastPlayedDay: string | null; days: number };
  speciesStats: Record<string, SpeciesStat>;
  completedLessons: Record<string, { bestAccuracy: number; lastPlayedAt: number }>;
  // Transient
  active: ActiveLesson | null;

  startLesson: (lessonId: string) => void;
  answer: (correct: boolean, speciesId: string | null) => void;
  nextExercise: () => void;
  abandonLesson: () => void;
  finalizeLesson: () => { xpGained: number; passed: boolean } | null;
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};
const isYesterday = (iso: string) => {
  const y = new Date(); y.setDate(y.getDate() - 1);
  return `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}` === iso;
};

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: { lastPlayedDay: null, days: 0 },
      speciesStats: {},
      completedLessons: {},
      active: null,

      startLesson: (lessonId) => {
        const lesson = getLesson(lessonId);
        const exercises = generateLesson(lesson, get().speciesStats);
        set({
          active: {
            lessonId,
            exercises,
            index: 0,
            hearts: STARTING_HEARTS,
            correctCount: 0,
            startedAt: Date.now(),
            outcome: "in-progress",
            results: [],
          },
        });
      },

      answer: (correct, speciesId) => {
        const a = get().active;
        if (!a) return;
        const stats = { ...get().speciesStats };
        if (speciesId) {
          const cur = stats[speciesId] ?? { timesSeen: 0, timesCorrect: 0, lastSeenAt: 0 };
          stats[speciesId] = {
            timesSeen: cur.timesSeen + 1,
            timesCorrect: cur.timesCorrect + (correct ? 1 : 0),
            lastSeenAt: Date.now(),
          };
        }
        const hearts = correct ? a.hearts : Math.max(0, a.hearts - 1);
        const correctCount = a.correctCount + (correct ? 1 : 0);
        const results = [...a.results, { correct, speciesId }];
        const failed = hearts === 0;
        set({
          speciesStats: stats,
          active: {
            ...a,
            hearts,
            correctCount,
            results,
            outcome: failed ? "failed" : a.outcome,
          },
        });
      },

      nextExercise: () => {
        const a = get().active;
        if (!a) return;
        const next = a.index + 1;
        if (next >= a.exercises.length) {
          set({ active: { ...a, outcome: a.outcome === "failed" ? "failed" : "passed" } });
        } else {
          set({ active: { ...a, index: next } });
        }
      },

      abandonLesson: () => set({ active: null }),

      finalizeLesson: () => {
        const a = get().active;
        if (!a || a.outcome === "in-progress") return null;
        const passed = a.outcome === "passed";
        const accuracy = Math.round((a.correctCount / a.exercises.length) * 100);
        const xpGained = passed
          ? a.correctCount * 10 + 20 + a.hearts * 5
          : a.correctCount * 5;
        const completed = { ...get().completedLessons };
        const prev = completed[a.lessonId];
        if (passed) {
          completed[a.lessonId] = {
            bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
            lastPlayedAt: Date.now(),
          };
        }
        // Streak
        const t = today();
        const s = get().streak;
        let nextStreak = s;
        if (s.lastPlayedDay !== t) {
          if (s.lastPlayedDay && isYesterday(s.lastPlayedDay)) {
            nextStreak = { lastPlayedDay: t, days: s.days + 1 };
          } else {
            nextStreak = { lastPlayedDay: t, days: 1 };
          }
        }
        set({
          xp: get().xp + xpGained,
          completedLessons: completed,
          streak: nextStreak,
          active: null,
        });
        return { xpGained, passed };
      },
    }),
    {
      name: "goodbird-v1",
      partialize: (s) => ({
        xp: s.xp,
        streak: s.streak,
        speciesStats: s.speciesStats,
        completedLessons: s.completedLessons,
      }),
    },
  ),
);
