import type { LessonRef, Manifest, Species, Unit } from "./types";

// Eager-load every unit JSON in src/data/. Adding a new unit = drop in a JSON.
const modules = import.meta.glob<Manifest>("@/data/*.json", { eager: true, import: "default" });

const sortOrder: Record<string, number> = {
  "coastal-scrub": 1,
  "oak-woodland": 2,
  "marsh-freshwater": 3,
  "riparian": 4,
  "coastal-conifer": 5,
  "night-voices": 6,
  "pasture": 7,
};

export const units: Unit[] = [];
const allSpecies: Species[] = [];
export const allLessons: Array<LessonRef & { unitId: string }> = [];

for (const m of Object.values(modules)) {
  units.push(m.unit);
  for (const s of m.species) allSpecies.push(s);
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

export const getLesson = (id: string) => {
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

export const allSpeciesWithRecordings = (): Species[] =>
  Array.from(speciesById.values()).filter((s) => s.recordings.length > 0);

export const nextLesson = (lessonId: string) => {
  const l = lessonsById.get(lessonId);
  if (!l) return null;
  const sameUnit = allLessons.filter((x) => x.unitId === l.unitId);
  const idx = sameUnit.findIndex((x) => x.id === lessonId);
  return sameUnit[idx + 1] ?? null;
};
