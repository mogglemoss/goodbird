import { describe, expect, it } from "vitest";
import { sanitizePersistedState } from "./persist-schema";

describe("sanitizePersistedState", () => {
  it("returns full default shape when given undefined", () => {
    const out = sanitizePersistedState(undefined);
    expect(out).toEqual({
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
    });
  });

  it("returns full default shape when given non-object garbage", () => {
    expect(sanitizePersistedState(null).xp).toBe(0);
    expect(sanitizePersistedState("bogus").dailyGoal).toBe(30);
    expect(sanitizePersistedState(42).theme).toBe("auto");
    expect(sanitizePersistedState([1, 2, 3]).favorites).toEqual({});
  });

  it("preserves valid fields verbatim", () => {
    const input = {
      xp: 250,
      streak: { lastPlayedDay: "2026-04-28", days: 5 },
      speciesStats: {
        wrentit: { timesSeen: 4, timesCorrect: 3, lastSeenAt: 1700000000000, interval: 4, dueAt: 1700400000000 },
      },
      completedLessons: { "cs-1": { bestAccuracy: 90, lastPlayedAt: 1700000000000 } },
      favorites: { wrentit: true, "varied-thrush": true },
      freeplay: true,
      hasOnboarded: true,
      dailyGoal: 50,
      xpToday: 30,
      xpTodayDay: "2026-04-28",
      theme: "dark" as const,
      dismissedInstallHint: true,
    };
    expect(sanitizePersistedState(input)).toEqual(input);
  });

  it("coerces negative xp to 0", () => {
    expect(sanitizePersistedState({ xp: -50 }).xp).toBe(0);
  });

  it("coerces NaN/Infinity numbers to defaults", () => {
    expect(sanitizePersistedState({ xp: NaN }).xp).toBe(0);
    expect(sanitizePersistedState({ xp: Infinity }).xp).toBe(0);
    expect(sanitizePersistedState({ dailyGoal: NaN }).dailyGoal).toBe(30);
  });

  it("clamps dailyGoal to a minimum of 5", () => {
    expect(sanitizePersistedState({ dailyGoal: 0 }).dailyGoal).toBe(5);
    expect(sanitizePersistedState({ dailyGoal: 1 }).dailyGoal).toBe(5);
    expect(sanitizePersistedState({ dailyGoal: 100 }).dailyGoal).toBe(100);
  });

  it("rejects invalid theme values", () => {
    expect(sanitizePersistedState({ theme: "neon" }).theme).toBe("auto");
    expect(sanitizePersistedState({ theme: 42 }).theme).toBe("auto");
    expect(sanitizePersistedState({ theme: "light" }).theme).toBe("light");
  });

  it("clamps bestAccuracy to 100", () => {
    const out = sanitizePersistedState({
      completedLessons: { "cs-1": { bestAccuracy: 150, lastPlayedAt: 1 } },
    });
    expect(out.completedLessons["cs-1"].bestAccuracy).toBe(100);
  });

  it("self-corrects timesCorrect > timesSeen in species stats", () => {
    const out = sanitizePersistedState({
      speciesStats: {
        wrentit: { timesSeen: 3, timesCorrect: 999, lastSeenAt: 0 },
      },
    });
    expect(out.speciesStats.wrentit.timesCorrect).toBe(3);
  });

  it("drops malformed species stat entries", () => {
    const out = sanitizePersistedState({
      speciesStats: {
        good: { timesSeen: 1, timesCorrect: 1, lastSeenAt: 0 },
        bad: "not an object",
        alsoBad: null,
      },
    });
    expect(Object.keys(out.speciesStats)).toEqual(["good"]);
  });

  it("drops non-true favorite values", () => {
    const out = sanitizePersistedState({
      favorites: { wrentit: true, fake: false, also: 1, real: true },
    });
    expect(out.favorites).toEqual({ wrentit: true, real: true });
  });

  it("strips invalid streak fields and rebuilds with defaults", () => {
    expect(sanitizePersistedState({ streak: { days: -10 } }).streak).toEqual({
      lastPlayedDay: null,
      days: 0,
    });
    expect(sanitizePersistedState({ streak: "garbage" }).streak).toEqual({
      lastPlayedDay: null,
      days: 0,
    });
  });

  it("preserves only positive interval and non-negative dueAt", () => {
    const out = sanitizePersistedState({
      speciesStats: {
        a: { timesSeen: 1, timesCorrect: 0, lastSeenAt: 0, interval: -1, dueAt: -5 },
        b: { timesSeen: 1, timesCorrect: 0, lastSeenAt: 0, interval: 4, dueAt: 1000 },
      },
    });
    expect(out.speciesStats.a.interval).toBeUndefined();
    expect(out.speciesStats.a.dueAt).toBeUndefined();
    expect(out.speciesStats.b.interval).toBe(4);
    expect(out.speciesStats.b.dueAt).toBe(1000);
  });
});
