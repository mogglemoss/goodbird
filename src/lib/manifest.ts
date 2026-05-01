import type { LessonRef, Manifest, Species, SpeciesStat, Unit } from "./types";

// Lazy-load every unit JSON. Each match becomes a dynamic import that Vite
// code-splits into its own chunk — the JSON ships as a separate parallel
// download instead of being inlined into the main JS bundle.
//
// Top-level await below resolves all loaders at module init, so consumers
// can keep using `units`, `allLessons`, etc. synchronously after the
// module is imported. main.tsx imports manifest before mounting React, so
// every component sees fully-populated state at render time.
const modules = import.meta.glob<Manifest>("@/data/*.json", { import: "default" });

const sortOrder: Record<string, number> = {
  // Land-side habitats first, working out from the trail
  "coastal-scrub": 1,
  "oak-woodland": 2,
  "redwood-forest": 3,
  "riparian": 4,
  "marsh-freshwater": 5,
  "coastal-conifer": 6,
  // Coast & water
  "tomales-bay": 7,
  "open-coast": 8,
  // Open country & sky
  "pasture": 9,
  "soaring-country": 10,
  // Human edge
  "town-garden": 11,
  // After dark — capstone
  "night-voices": 12,
};

export const units: Unit[] = [];
const allSpecies: Species[] = [];
export const allLessons: Array<LessonRef & { unitId: string }> = [];

// Resolve every unit JSON in parallel and process them into the manifest.
const loadedManifests = await Promise.all(
  Object.values(modules).map((load) => load()),
);
for (const m of loadedManifests) {
  units.push(m.unit);
  for (const s of m.species) {
    // Defensive: drop recordings without a usable URL. xeno-canto withholds
    // audio for sensitive species (e.g., Spotted Owl) — those entries arrive
    // with `url: null` and would otherwise leak into quizzes via the
    // `recordings.length > 0` filter while crashing on playback.
    const recordings = s.recordings.filter((r) => !!r.url);
    allSpecies.push({ ...s, recordings });
  }
  for (const l of m.lessons) allLessons.push({ ...l, unitId: m.unit.id });
}
units.sort((a, b) => (sortOrder[a.id] ?? 99) - (sortOrder[b.id] ?? 99));

const speciesById = new Map<string, Species>();
for (const s of allSpecies) {
  // Same species can appear in multiple units. Prefer the first one with recordings.
  const prev = speciesById.get(s.id);
  if (!prev || (!prev.recordings.length && s.recordings.length)) speciesById.set(s.id, s);
}

const lessonsById = new Map(allLessons.map((l) => [l.id, l]));

export const getSpecies = (id: string): Species => {
  const s = speciesById.get(id);
  if (!s) throw new Error(`Unknown species id: ${id}`);
  return s;
};

/** Sentinel id for the cross-unit "Daily review" lesson. */
export const REVIEW_LESSON_ID = "review";

export const getLesson = (id: string) => {
  if (id === REVIEW_LESSON_ID) {
    // Synthetic lesson — the lesson-generator handles species selection
    // from speciesStats (most-needs-review) rather than a fixed list.
    return {
      id: REVIEW_LESSON_ID,
      title: "Daily review",
      speciesIds: [],
      length: 10,
      unitId: undefined,
    };
  }
  const l = lessonsById.get(id);
  if (!l) throw new Error(`Unknown lesson id: ${id}`);
  return l;
};

export const getLessonsForUnit = (unitId: string): LessonRef[] =>
  allLessons.filter((l) => l.unitId === unitId);

export const getUnit = (id: string): Unit => {
  const u = units.find((u) => u.id === id);
  if (!u) throw new Error(`Unknown unit id: ${id}`);
  return u;
};

/** Species eligible for quizzes: has audio AND isn't a sensitive (Threatened/
 *  Endangered) species we've explicitly opted out of playback for. The
 *  sensitive flag wins even if recordings are present — see Marbled Murrelet,
 *  which has working xeno-canto audio that we choose not to expose because
 *  field playback disrupts nesting. */
export const allSpeciesWithRecordings = (): Species[] =>
  Array.from(speciesById.values()).filter((s) => !s.sensitive && s.recordings.length > 0);

const speciesByUnit = new Map<string, Species[]>();
for (const u of units) {
  const ids = new Set<string>();
  for (const l of allLessons) if (l.unitId === u.id) for (const id of l.speciesIds) ids.add(id);
  speciesByUnit.set(u.id, [...ids].map((id) => speciesById.get(id)).filter((s): s is Species => !!s && !s.sensitive && s.recordings.length > 0));
}
export const getSpeciesForUnit = (unitId: string): Species[] => speciesByUnit.get(unitId) ?? [];

/**
 * Pick the species most in need of review, sorted by weakness + how
 * overdue they are. Used by the Daily Review lesson type.
 *
 * Scoring: low accuracy (1-acc) + days overdue (dueAt past now) + a small
 * boost for species seen fewer than 3 times. Brand-new (never-seen)
 * species get a fixed mid-high score so they surface but don't dominate.
 */
export function pickReviewSpeciesIds(
  stats: Record<string, SpeciesStat>,
  max = 15,
): string[] {
  const pool = allSpeciesWithRecordings();
  if (!pool.length) return [];
  const now = Date.now();
  const scored = pool.map((s) => {
    const st = stats[s.id];
    if (!st || st.timesSeen === 0) return { id: s.id, weight: 1.5 };
    const acc = st.timesCorrect / Math.max(1, st.timesSeen);
    const overdueDays = st.dueAt ? Math.max(0, (now - st.dueAt) / 86_400_000) : 0;
    const fewBoost = st.timesSeen < 3 ? 1 : 0;
    return { id: s.id, weight: (1 - acc) * 4 + Math.min(overdueDays, 5) + fewBoost };
  });
  scored.sort((a, b) => b.weight - a.weight);
  return scored.slice(0, max).map((x) => x.id);
}

/** Every audio + image URL across all units — for offline pre-caching. */
export function allMediaUrls(): string[] {
  const urls = new Set<string>();
  for (const s of speciesById.values()) {
    if (s.imageUrl) urls.add(s.imageUrl);
    for (const r of s.recordings) if (r.url) urls.add(r.url);
  }
  return [...urls];
}

export const nextLesson = (lessonId: string) => {
  const l = lessonsById.get(lessonId);
  if (!l) return null;
  const sameUnit = allLessons.filter((x) => x.unitId === l.unitId);
  const idx = sameUnit.findIndex((x) => x.id === lessonId);
  return sameUnit[idx + 1] ?? null;
};

export const getUnitForLesson = (lessonId: string): Unit | null => {
  const l = lessonsById.get(lessonId);
  if (!l?.unitId) return null;
  return units.find((u) => u.id === l.unitId) ?? null;
};
