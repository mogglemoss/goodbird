import { describe, expect, it } from "vitest";
import { dailyPick, hashStr, todayStr } from "./daily-pick";

describe("hashStr", () => {
  it("is deterministic", () => {
    expect(hashStr("goodbird")).toBe(hashStr("goodbird"));
    expect(hashStr("2026-04-29")).toBe(hashStr("2026-04-29"));
  });

  it("returns a non-negative 32-bit int", () => {
    for (const s of ["", "a", "2026-1-1", "🐦", "a much longer test string"]) {
      const h = hashStr(s);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(0xffffffff);
      expect(Number.isInteger(h)).toBe(true);
    }
  });

  it("produces different hashes for different strings (typically)", () => {
    expect(hashStr("a")).not.toBe(hashStr("b"));
    expect(hashStr("2026-1-1")).not.toBe(hashStr("2026-1-2"));
  });
});

describe("todayStr", () => {
  it("formats date as YYYY-M-D without zero-padding (don't change!)", () => {
    expect(todayStr(new Date(2026, 0, 1))).toBe("2026-1-1");
    expect(todayStr(new Date(2026, 11, 31))).toBe("2026-12-31");
    expect(todayStr(new Date(2026, 3, 9))).toBe("2026-4-9");
  });

  it("changes across midnight", () => {
    expect(todayStr(new Date(2026, 3, 28))).not.toBe(todayStr(new Date(2026, 3, 29)));
  });
});

describe("dailyPick", () => {
  it("returns null on empty pool", () => {
    expect(dailyPick([])).toBeNull();
    expect(dailyPick([], "any")).toBeNull();
  });

  it("returns the same item for the same date + salt across calls", () => {
    const pool = ["a", "b", "c", "d", "e"];
    // Mock today by relying on JS Date being stable within a single test run.
    // dailyPick uses todayStr(new Date()) internally.
    const a = dailyPick(pool, "test");
    const b = dailyPick(pool, "test");
    expect(a).toBe(b);
  });

  it("different salts pick differently most of the time", () => {
    // Generate a wide pool so collision-by-coincidence is unlikely.
    const pool = Array.from({ length: 30 }, (_, i) => i);
    const a = dailyPick(pool, "salt-a");
    const b = dailyPick(pool, "salt-b");
    const c = dailyPick(pool, "salt-c");
    // At least 2 of the 3 should differ. (Hash collisions are possible
    // but with 3 salts × 30 pool, all-three-same is vanishingly rare.)
    const distinct = new Set([a, b, c]).size;
    expect(distinct).toBeGreaterThanOrEqual(2);
  });

  it("returns an item from the pool", () => {
    const pool = ["x", "y", "z"];
    const picked = dailyPick(pool);
    expect(pool).toContain(picked);
  });
});
