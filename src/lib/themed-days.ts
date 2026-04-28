/**
 * Curated calendar-date overrides for the Hero phrase. When a themed day
 * matches today's date, its phrase appears INSTEAD of the daily-rotation
 * pick. Used for:
 *
 *   - Civic / nature dates that recur every year (Earth Day, solstices,
 *     Halloween for the owls). Keyed by "MM-DD".
 *   - Specific multi-day windows that move year-to-year (Pt. Reyes
 *     Birding Festival, etc.). Keyed by "YYYY-MM-DD" range and need
 *     manual annual updates.
 */

export interface ThemedDay {
  phrase: string;
  /** Optional: also pin the bird-of-the-day to this species id. */
  speciesId?: string;
}

/** Anniversaries that fire every year. Keyed by "MM-DD". */
export const THEMED_EXACT_DAYS: Record<string, ThemedDay> = {
  "01-01": { phrase: "A new year of birds." },
  "02-14": { phrase: "Send a love song." },
  "03-20": { phrase: "First day of spring; first songs." },
  "04-22": { phrase: "Earth Day. Listen up." },
  "06-21": { phrase: "Solstice morning. Long, loud chorus." },
  "10-31": { phrase: "Owls all night." },
  "12-21": { phrase: "Solstice. The owls have it." },
  "12-25": { phrase: "Even today, the birds are out." },
};

/**
 * Multi-day windows. Update annually as event dates are announced.
 * `from` and `to` are inclusive "YYYY-MM-DD" strings.
 *
 * Pt. Reyes Birding & Nature Festival — pointreyesbirdingfestival.org.
 * Three-day weekend in mid-to-late April. Past:
 *   2026: Apr 24–26
 *   2027: Apr 16–18  ← scheduled
 */
export const THEMED_RANGES: Array<{ from: string; to: string; day: ThemedDay }> = [
  { from: "2027-04-16", to: "2027-04-18",
    day: { phrase: "The Pt. Reyes Birding Festival is on." } },
];

/** Pick today's themed override, if any. Returns null on a regular day. */
export function pickThemedDay(d: Date = new Date()): ThemedDay | null {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  // Anniversaries first
  const exact = THEMED_EXACT_DAYS[`${mm}-${dd}`];
  if (exact) return exact;

  // Then specific-year ranges
  const today = `${d.getFullYear()}-${mm}-${dd}`;
  for (const r of THEMED_RANGES) {
    if (today >= r.from && today <= r.to) return r.day;
  }
  return null;
}
