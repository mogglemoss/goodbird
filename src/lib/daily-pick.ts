/**
 * Date-seeded deterministic picks. The same calendar day always returns
 * the same result, so refresh-stability is automatic and there's no
 * need for any persistence layer.
 *
 * Used by:
 *   - BirdOfTheDay        (species pool, no salt)
 *   - Hero phrase rotation (phrase pool, salt = "hero")
 *   - anything else that wants "today's X" picked from a stable pool
 */

/** Deterministic FNV-1a-ish hash of a string → non-negative 32-bit int. */
export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * "YYYY-M-D" — note: NOT zero-padded. Don't change the format casually;
 * any existing date hashes (BirdOfTheDay, etc.) depend on it.
 */
export function todayStr(d: Date = new Date()): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * Stable daily pick from a pool. The optional `salt` lets multiple
 * pickers vary independently on the same date — pass different salts
 * (e.g. "hero" vs "" for bird-of-the-day) so the indexes don't lock
 * in lockstep.
 */
export function dailyPick<T>(pool: readonly T[], salt = ""): T | null {
  if (pool.length === 0) return null;
  return pool[hashStr(todayStr() + salt) % pool.length];
}
