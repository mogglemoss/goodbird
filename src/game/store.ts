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
  favorites: Record<string, true>;
  freeplay: boolean; // when true, hearts don't deplete and lessons don't fail
  hasOnboarded: boolean;
  dailyGoal: number; // XP target per day
  xpToday: number;
  xpTodayDay: string | null; // the day xpToday is for
  theme: "auto" | "light" | "dark";
  dismissedInstallHint: boolean;
  // Transient
  active: ActiveLesson | null;

  startLesson: (lessonId: string) => void;
  answer: (correct: boolean, speciesId: string | null) => void;
  nextExercise: () => void;
  abandonLesson: () => void;
  finalizeLesson: () => { xpGained: number; passed: boolean; xpToday: number; dailyGoal: number; goalReached: boolean } | null;
  resetProgress: () => void;
  toggleFavorite: (speciesId: string) => void;
  setFreeplay: (on: boolean) => void;
  setOnboarded: () => void;
  setDailyGoal: (n: number) => void;
  setTheme: (t: "auto" | "light" | "dark") => void;
  dismissInstallHint: () => void;
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
      favorites: {},
      freeplay: false,
      hasOnboarded: false,
      dailyGoal: 30,
      xpToday: 0,
      xpTodayDay: null,
      theme: "auto",
      dismissedInstallHint: false,
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
          const cur = stats[speciesId] ?? { timesSeen: 0, timesCorrect: 0, lastSeenAt: 0, interval: 1 };
          // Lightweight SRS: correct doubles the interval (capped at 30d);
          // wrong resets it to 1 day.
          const prevInterval = cur.interval ?? 1;
          const nextInterval = correct ? Math.min(prevInterval * 2, 30) : 1;
          const now = Date.now();
          stats[speciesId] = {
            timesSeen: cur.timesSeen + 1,
            timesCorrect: cur.timesCorrect + (correct ? 1 : 0),
            lastSeenAt: now,
            interval: nextInterval,
            dueAt: now + nextInterval * 86_400_000,
          };
        }
        const freeplay = get().freeplay;
        const hearts = freeplay
          ? a.hearts
          : (correct ? a.hearts : Math.max(0, a.hearts - 1));
        const correctCount = a.correctCount + (correct ? 1 : 0);
        const results = [...a.results, { correct, speciesId }];
        // We deliberately DO NOT set outcome=failed here, even when hearts hit 0.
        // The user must see the feedback bar for their losing answer first; the
        // navigation to /results is triggered by nextExercise() below when they
        // tap Continue.
        set({
          speciesStats: stats,
          active: { ...a, hearts, correctCount, results },
        });
      },

      nextExercise: () => {
        const a = get().active;
        if (!a) return;
        const freeplay = get().freeplay;
        // Promote a heart-zero answer to "failed" only now (after the user has
        // acknowledged the feedback bar by tapping Continue).
        if (!freeplay && a.hearts === 0) {
          set({ active: { ...a, outcome: "failed" } });
          return;
        }
        const next = a.index + 1;
        if (next >= a.exercises.length) {
          set({ active: { ...a, outcome: "passed" } });
        } else {
          set({ active: { ...a, index: next } });
        }
      },

      abandonLesson: () => set({ active: null }),

      resetProgress: () => {
        set({
          xp: 0,
          streak: { lastPlayedDay: null, days: 0 },
          speciesStats: {},
          completedLessons: {},
          favorites: {},
          active: null,
          // Don't wipe freeplay or hasOnboarded — those are user preferences, not progress.
        });
      },

      toggleFavorite: (speciesId) => {
        const favorites = { ...get().favorites };
        if (favorites[speciesId]) delete favorites[speciesId];
        else favorites[speciesId] = true;
        set({ favorites });
      },

      setFreeplay: (on) => set({ freeplay: on }),
      setOnboarded: () => set({ hasOnboarded: true }),
      setDailyGoal: (n) => set({ dailyGoal: Math.max(5, Math.floor(n)) }),
      setTheme: (t) => set({ theme: t }),
      dismissInstallHint: () => set({ dismissedInstallHint: true }),

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
        const t = today();

        // Daily XP bookkeeping — reset xpToday at midnight.
        const cur = get();
        const xpTodayPrev = cur.xpTodayDay === t ? cur.xpToday : 0;
        const xpTodayNext = xpTodayPrev + xpGained;
        const dailyGoal = cur.dailyGoal;
        const goalReached = xpTodayPrev < dailyGoal && xpTodayNext >= dailyGoal;

        // Streak — only increments when the daily goal is reached today,
        // not just on any played lesson. Lifts the streak from "you tapped
        // anything" to "you actually trained today."
        const s = cur.streak;
        let nextStreak = s;
        if (s.lastPlayedDay !== t && xpTodayNext >= dailyGoal) {
          if (s.lastPlayedDay && isYesterday(s.lastPlayedDay)) {
            nextStreak = { lastPlayedDay: t, days: s.days + 1 };
          } else {
            nextStreak = { lastPlayedDay: t, days: 1 };
          }
        }

        set({
          xp: cur.xp + xpGained,
          completedLessons: completed,
          streak: nextStreak,
          xpToday: xpTodayNext,
          xpTodayDay: t,
          active: null,
        });
        return { xpGained, passed, xpToday: xpTodayNext, dailyGoal, goalReached };
      },
    }),
    {
      name: "goodbird-v1",
      partialize: (s) => ({
        xp: s.xp,
        streak: s.streak,
        speciesStats: s.speciesStats,
        completedLessons: s.completedLessons,
        favorites: s.favorites,
        freeplay: s.freeplay,
        hasOnboarded: s.hasOnboarded,
        dailyGoal: s.dailyGoal,
        xpToday: s.xpToday,
        xpTodayDay: s.xpTodayDay,
        theme: s.theme,
        dismissedInstallHint: s.dismissedInstallHint,
      }),
    },
  ),
);
