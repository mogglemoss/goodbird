// Hand-rolled validator for the persisted slice of GameState. Runs once on
// rehydration via zustand's `merge` callback. Anything malformed gets dropped
// or replaced with a default — corrupt localStorage can't crash the app.
//
// Hand-rolled (no Zod) because the persisted shape is small and stable, and
// we don't want a 12 KB dep for one schema in a static portfolio site.

import type { SpeciesStat } from "@/lib/types";

type Theme = "auto" | "light" | "dark";

interface PersistedSlice {
  xp: number;
  streak: { lastPlayedDay: string | null; days: number };
  speciesStats: Record<string, SpeciesStat>;
  completedLessons: Record<string, { bestAccuracy: number; lastPlayedAt: number }>;
  favorites: Record<string, true>;
  freeplay: boolean;
  hasOnboarded: boolean;
  dailyGoal: number;
  xpToday: number;
  xpTodayDay: string | null;
  theme: Theme;
  dismissedInstallHint: boolean;
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isFiniteNum = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

const nonNegInt = (v: unknown, fallback: number): number => {
  if (!isFiniteNum(v) || v < 0) return fallback;
  return Math.floor(v);
};

const isBool = (v: unknown): v is boolean => typeof v === "boolean";

const isStr = (v: unknown): v is string => typeof v === "string";

const isTheme = (v: unknown): v is Theme =>
  v === "auto" || v === "light" || v === "dark";

function sanitizeStreak(raw: unknown): PersistedSlice["streak"] {
  const def = { lastPlayedDay: null, days: 0 };
  if (!isObj(raw)) return def;
  const lastPlayedDay = isStr(raw.lastPlayedDay) ? raw.lastPlayedDay : null;
  const days = nonNegInt(raw.days, 0);
  return { lastPlayedDay, days };
}

function sanitizeSpeciesStats(raw: unknown): Record<string, SpeciesStat> {
  if (!isObj(raw)) return {};
  const out: Record<string, SpeciesStat> = {};
  for (const [id, v] of Object.entries(raw)) {
    if (!isObj(v)) continue;
    const stat: SpeciesStat = {
      timesSeen: nonNegInt(v.timesSeen, 0),
      timesCorrect: nonNegInt(v.timesCorrect, 0),
      lastSeenAt: nonNegInt(v.lastSeenAt, 0),
    };
    if (isFiniteNum(v.interval) && v.interval > 0) stat.interval = v.interval;
    if (isFiniteNum(v.dueAt) && v.dueAt >= 0) stat.dueAt = v.dueAt;
    // timesCorrect can never exceed timesSeen
    if (stat.timesCorrect > stat.timesSeen) stat.timesCorrect = stat.timesSeen;
    out[id] = stat;
  }
  return out;
}

function sanitizeCompletedLessons(raw: unknown): PersistedSlice["completedLessons"] {
  if (!isObj(raw)) return {};
  const out: PersistedSlice["completedLessons"] = {};
  for (const [id, v] of Object.entries(raw)) {
    if (!isObj(v)) continue;
    const bestAccuracy = nonNegInt(v.bestAccuracy, 0);
    const lastPlayedAt = nonNegInt(v.lastPlayedAt, 0);
    out[id] = {
      bestAccuracy: Math.min(100, bestAccuracy),
      lastPlayedAt,
    };
  }
  return out;
}

function sanitizeFavorites(raw: unknown): Record<string, true> {
  if (!isObj(raw)) return {};
  const out: Record<string, true> = {};
  for (const [id, v] of Object.entries(raw)) {
    if (v === true) out[id] = true;
  }
  return out;
}

/**
 * Validate-and-coerce a persisted slice. Always returns a complete, well-typed
 * shape; missing/invalid fields fall back to safe defaults.
 */
export function sanitizePersistedState(raw: unknown): PersistedSlice {
  const o: Record<string, unknown> = isObj(raw) ? raw : {};
  return {
    xp: nonNegInt(o.xp, 0),
    streak: sanitizeStreak(o.streak),
    speciesStats: sanitizeSpeciesStats(o.speciesStats),
    completedLessons: sanitizeCompletedLessons(o.completedLessons),
    favorites: sanitizeFavorites(o.favorites),
    freeplay: isBool(o.freeplay) ? o.freeplay : false,
    hasOnboarded: isBool(o.hasOnboarded) ? o.hasOnboarded : false,
    dailyGoal: Math.max(5, nonNegInt(o.dailyGoal, 30)),
    xpToday: nonNegInt(o.xpToday, 0),
    xpTodayDay: isStr(o.xpTodayDay) ? o.xpTodayDay : null,
    theme: isTheme(o.theme) ? o.theme : "auto",
    dismissedInstallHint: isBool(o.dismissedInstallHint) ? o.dismissedInstallHint : false,
  };
}
