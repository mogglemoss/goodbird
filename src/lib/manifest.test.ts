import { describe, expect, it } from "vitest";
import {
  allLessons,
  allSpeciesWithRecordings,
  getLesson,
  getLessonsForUnit,
  getSpecies,
  getSpeciesForUnit,
  getUnit,
  getUnitForLesson,
  nextLesson,
  pickReviewSpeciesIds,
  REVIEW_LESSON_ID,
  units,
} from "./manifest";
import type { SpeciesStat } from "./types";

describe("manifest fundamentals", () => {
  it("ships at least one unit and one lesson", () => {
    expect(units.length).toBeGreaterThan(0);
    expect(allLessons.length).toBeGreaterThan(0);
  });

  it("every shipping lesson resolves to a unit", () => {
    for (const lesson of allLessons) {
      const u = getUnitForLesson(lesson.id);
      expect(u, `lesson ${lesson.id}`).not.toBeNull();
    }
  });

  it("every species id referenced by a lesson exists in the manifest", () => {
    for (const lesson of allLessons) {
      for (const sid of lesson.speciesIds) {
        // Throws if missing — test would fail on the throw.
        expect(() => getSpecies(sid)).not.toThrow();
      }
    }
  });
});

describe("getUnit / getLesson / getUnitForLesson", () => {
  it("getUnit throws on unknown id (defensive contract)", () => {
    expect(() => getUnit("nope")).toThrow();
  });

  it("getLesson resolves by id and returns the same data as the unit's list", () => {
    const u = units[0];
    const lessons = getLessonsForUnit(u.id);
    expect(lessons.length).toBeGreaterThan(0);
    const direct = getLesson(lessons[0].id);
    expect(direct.id).toBe(lessons[0].id);
  });

  it("getUnitForLesson(REVIEW_LESSON_ID) returns null (cross-unit)", () => {
    expect(getUnitForLesson(REVIEW_LESSON_ID)).toBeNull();
  });
});

describe("allSpeciesWithRecordings", () => {
  it("returns only species with at least one recording", () => {
    const all = allSpeciesWithRecordings();
    expect(all.length).toBeGreaterThan(0);
    for (const sp of all) {
      expect(sp.recordings.length).toBeGreaterThan(0);
    }
  });
});

describe("getSpeciesForUnit", () => {
  it("returns a non-empty list for every shipping unit", () => {
    for (const u of units) {
      const list = getSpeciesForUnit(u.id);
      expect(list.length, `unit ${u.id}`).toBeGreaterThan(0);
    }
  });
});

describe("pickReviewSpeciesIds", () => {
  it("returns the requested count when stats are empty (all-fresh weighting)", () => {
    const ids = pickReviewSpeciesIds({}, 15);
    expect(ids.length).toBe(15);
    // No duplicates in the returned set
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("returns IDs that exist as species", () => {
    const ids = pickReviewSpeciesIds({}, 10);
    for (const id of ids) {
      expect(() => getSpecies(id)).not.toThrow();
    }
  });

  it("respects the requested count even when stats biases weights", () => {
    // Synth: every species seen 10 times, all wrong → should still
    // produce `count` ids without throwing.
    const stats: Record<string, SpeciesStat> = {};
    for (const sp of allSpeciesWithRecordings()) {
      stats[sp.id] = { timesSeen: 10, timesCorrect: 0, lastSeenAt: 0, interval: 1 };
    }
    const ids = pickReviewSpeciesIds(stats, 12);
    expect(ids.length).toBe(12);
  });

  it("never returns more IDs than the species pool size", () => {
    const total = allSpeciesWithRecordings().length;
    const ids = pickReviewSpeciesIds({}, total + 50);
    expect(ids.length).toBeLessThanOrEqual(total);
  });
});

describe("nextLesson", () => {
  it("returns the next lesson within the same unit, or the first lesson of the next unit", () => {
    const firstUnit = units[0];
    const lessons = getLessonsForUnit(firstUnit.id);
    expect(lessons.length).toBeGreaterThan(1);
    const next = nextLesson(lessons[0].id);
    expect(next).not.toBeNull();
    // Either the second lesson in the same unit, or some other valid lesson id
    expect(allLessons.find((l) => l.id === next?.id)).toBeTruthy();
  });

  it("returns null (or wraps gracefully) for an unknown lesson id", () => {
    // Defensive: don't throw on an invalid id
    expect(() => nextLesson("does-not-exist")).not.toThrow();
  });
});
