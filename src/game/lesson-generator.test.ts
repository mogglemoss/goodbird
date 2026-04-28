import { describe, expect, it } from "vitest";
import { generateLesson } from "./lesson-generator";
import { allLessons, REVIEW_LESSON_ID, getLesson } from "@/lib/manifest";

// Smoke tests against the real (eager-loaded) manifest data. These are
// integration-flavored because lesson-generator depends on manifest, but
// they're fast and catch regressions in the kind-mix and SRS weighting.

describe("generateLesson", () => {
  it("produces the requested lesson length for every shipping lesson", () => {
    expect(allLessons.length).toBeGreaterThan(0);
    for (const lesson of allLessons) {
      const exercises = generateLesson(lesson, {});
      expect(exercises.length).toBe(lesson.length);
    }
  });

  it("never produces 3 of the same exercise kind in a row", () => {
    const lesson = getLesson("cs-1"); // a real Coastal Scrub lesson
    // Run 50× — randomized output, so exercise this hard.
    for (let trial = 0; trial < 50; trial++) {
      const exercises = generateLesson(lesson, {});
      for (let i = 2; i < exercises.length; i++) {
        const a = exercises[i - 2].kind;
        const b = exercises[i - 1].kind;
        const c = exercises[i].kind;
        // Three identical kinds in a row would mean the runner's anti-streak
        // rule failed; assert the contract.
        const tripled = a === b && b === c;
        expect(tripled, `Run ${trial}: ${a}/${b}/${c} at index ${i}`).toBe(false);
      }
    }
  });

  it("each exercise's correct answer is a valid species id from the lesson", () => {
    const lesson = getLesson("cs-1");
    const allowedIds = new Set(lesson.speciesIds);
    const exercises = generateLesson(lesson, {});
    for (const ex of exercises) {
      switch (ex.kind) {
        case "identify":
        case "mnemonic":
          expect(allowedIds.has(ex.correctSpeciesId)).toBe(true);
          // Choices include the correct id
          expect(ex.choices).toContain(ex.correctSpeciesId);
          break;
        case "find-bird":
          expect(allowedIds.has(ex.targetSpeciesId)).toBe(true);
          expect(ex.recordings.length).toBeGreaterThanOrEqual(2);
          break;
        case "discriminate":
          // speciesIdA must be from the lesson's species pool
          expect(allowedIds.has(ex.speciesIdA)).toBe(true);
          break;
      }
    }
  });

  it("Daily Review path picks a sample even when stats is empty", () => {
    const reviewLesson = getLesson(REVIEW_LESSON_ID);
    const exercises = generateLesson(reviewLesson, {});
    expect(exercises.length).toBe(reviewLesson.length);
    // Cross-unit by definition; we just need each exercise to be valid.
    for (const ex of exercises) {
      expect(["identify", "mnemonic", "discriminate", "find-bird"]).toContain(ex.kind);
    }
  });
});
