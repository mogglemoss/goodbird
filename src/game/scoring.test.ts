import { describe, expect, it } from "vitest";
import { STARTING_HEARTS, XP_BONUS_LESSON, XP_PER_CORRECT, accuracy, lessonXp } from "./scoring";

describe("scoring constants", () => {
  it("has sensible defaults", () => {
    expect(STARTING_HEARTS).toBe(3);
    expect(XP_PER_CORRECT).toBe(10);
    expect(XP_BONUS_LESSON).toBe(20);
  });
});

describe("lessonXp", () => {
  it("awards bonus for completing the lesson at all", () => {
    // 0 correct, 0 hearts → just the lesson bonus
    expect(lessonXp(0, 0)).toBe(XP_BONUS_LESSON);
  });

  it("awards XP_PER_CORRECT per correct answer", () => {
    expect(lessonXp(8, 0)).toBe(8 * XP_PER_CORRECT + XP_BONUS_LESSON);
    expect(lessonXp(12, 0)).toBe(12 * XP_PER_CORRECT + XP_BONUS_LESSON);
  });

  it("awards 5 XP per heart remaining", () => {
    // Same correct count, varying hearts
    const base = lessonXp(8, 0);
    expect(lessonXp(8, 1)).toBe(base + 5);
    expect(lessonXp(8, 2)).toBe(base + 10);
    expect(lessonXp(8, 3)).toBe(base + 15);
  });

  it("perfect 8-question lesson with all hearts = 115 XP", () => {
    expect(lessonXp(8, STARTING_HEARTS)).toBe(8 * 10 + 20 + 3 * 5);
  });
});

describe("accuracy", () => {
  it("returns 0 when total is 0 (no divide-by-zero)", () => {
    expect(accuracy(0, 0)).toBe(0);
    expect(accuracy(5, 0)).toBe(0); // defensive: even if correct > 0
  });

  it("rounds to nearest integer percent", () => {
    expect(accuracy(0, 8)).toBe(0);
    expect(accuracy(8, 8)).toBe(100);
    expect(accuracy(4, 8)).toBe(50);
    expect(accuracy(7, 8)).toBe(88); // 87.5 → 88
    expect(accuracy(5, 8)).toBe(63); // 62.5 → 63 (banker's rounding off here)
  });

  it("handles all-correct and all-wrong edges", () => {
    expect(accuracy(12, 12)).toBe(100);
    expect(accuracy(0, 12)).toBe(0);
  });
});
