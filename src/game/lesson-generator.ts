import type { Exercise, ExerciseKind, LessonRef, Recording, Species, SpeciesStat } from "@/lib/types";
import { REVIEW_LESSON_ID, allSpeciesWithRecordings, getSpecies, getSpeciesForUnit, pickReviewSpeciesIds } from "@/lib/manifest";

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWeighted<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function speciesWeight(stat: SpeciesStat | undefined): number {
  if (!stat || stat.timesSeen === 0) return 3; // brand new — heaviest
  const acc = stat.timesCorrect / stat.timesSeen;
  const recencyDays = (Date.now() - stat.lastSeenAt) / 86_400_000;
  // Lightweight SRS: extra weight when this species' review is due.
  const dueBoost = stat.dueAt && stat.dueAt <= Date.now() ? 2 : 0;
  return 1 + (1 - acc) * 2 + Math.min(recencyDays * 0.3, 2) + dueBoost;
}

function distractors(unitPool: Species[], allPool: Species[], correct: Species, n: number): Species[] {
  // Prefer same-unit distractors so an "owl" exercise gets owls, not random songbirds.
  // Backfill from the global pool only when the unit doesn't have enough other species.
  const sameUnit = shuffle(unitPool.filter((s) => s.id !== correct.id));
  if (sameUnit.length >= n) return sameUnit.slice(0, n);
  const haveIds = new Set([correct.id, ...sameUnit.map((s) => s.id)]);
  const fromGlobal = shuffle(allPool.filter((s) => !haveIds.has(s.id)));
  return [...sameUnit, ...fromGlobal].slice(0, n);
}

function makeIdentify(target: Species, unitPool: Species[], allPool: Species[]): Exercise | null {
  if (!target.recordings.length) return null;
  const choices = shuffle([target, ...distractors(unitPool, allPool, target, 3)]);
  return {
    kind: "identify",
    recording: rand(target.recordings),
    correctSpeciesId: target.id,
    choices: choices.map((s) => s.id),
  };
}

function makeMnemonic(target: Species, unitPool: Species[], allPool: Species[]): Exercise | null {
  if (!target.recordings.length) return null;
  const choices = shuffle([target, ...distractors(unitPool, allPool, target, 3)]);
  return {
    kind: "mnemonic",
    recording: rand(target.recordings),
    correctSpeciesId: target.id,
    choices: choices.map((s) => s.id),
  };
}

function makeDiscriminate(target: Species, unitPool: Species[], allPool: Species[]): Exercise | null {
  if (!target.recordings.length) return null;
  const same = Math.random() < 0.5;
  const a = rand(target.recordings);
  let b: Recording;
  let speciesIdB: string;
  if (same && target.recordings.length >= 2) {
    const others = target.recordings.filter((r) => r.id !== a.id);
    b = others.length ? rand(others) : a;
    speciesIdB = target.id;
  } else {
    const other = rand(distractors(unitPool, allPool, target, 1));
    if (!other.recordings.length) return null;
    b = rand(other.recordings);
    speciesIdB = other.id;
  }
  return {
    kind: "discriminate",
    recordingA: a,
    recordingB: b,
    speciesIdA: target.id,
    speciesIdB,
    same: target.id === speciesIdB,
  };
}

function makeFindBird(target: Species, unitPool: Species[], allPool: Species[]): Exercise | null {
  if (!target.recordings.length) return null;
  const decoyA = rand(distractors(unitPool, allPool, target, 1));
  const remainingUnit = unitPool.filter((s) => s.id !== decoyA.id);
  const decoyB = rand(distractors(remainingUnit, allPool, target, 1));
  if (!decoyA?.recordings.length || !decoyB?.recordings.length) return null;
  const targetClip = rand(target.recordings);
  const clips = shuffle([
    targetClip,
    rand(decoyA.recordings),
    rand(decoyB.recordings),
  ]);
  return {
    kind: "find-bird",
    targetSpeciesId: target.id,
    recordings: clips,
    correctIndex: clips.findIndex((r) => r.id === targetClip.id),
  };
}

type Builder = (t: Species, unitPool: Species[], allPool: Species[]) => Exercise | null;
const BUILDERS: Record<ExerciseKind, Builder> = {
  identify: makeIdentify,
  mnemonic: makeMnemonic,
  discriminate: makeDiscriminate,
  "find-bird": makeFindBird,
};

export function generateLesson(
  lesson: LessonRef,
  stats: Record<string, SpeciesStat>,
): Exercise[] {
  // Daily Review is a virtual cross-unit lesson — pick a fresh weighted
  // sample of "needs review" species each time it's started.
  const isReview = lesson.id === REVIEW_LESSON_ID;
  const speciesIds = isReview
    ? pickReviewSpeciesIds(stats, 15)
    : lesson.speciesIds;

  const pool = speciesIds.map(getSpecies).filter((s) => s.recordings.length > 0);
  // Distractors prefer same-unit species; backfill from the global pool when
  // the unit is too small (e.g. Night Voices has only ~7 species). Review
  // mode is cross-unit by definition, so its unitPool is everything.
  const allPool = allSpeciesWithRecordings();
  const unitPool = lesson.unitId ? getSpeciesForUnit(lesson.unitId) : allPool;
  const exercises: Exercise[] = [];
  const lastKinds: ExerciseKind[] = [];

  // Mostly Identify in earlier slots; sprinkle other types.
  const kindMix: ExerciseKind[] = [
    "identify", "identify", "discriminate", "identify",
    "mnemonic", "identify", "find-bird", "identify",
    "discriminate", "identify", "mnemonic", "find-bird",
  ];

  for (let i = 0; i < lesson.length; i++) {
    let kind = kindMix[i % kindMix.length];
    // Avoid 3 of the same in a row.
    if (lastKinds.length >= 2 && lastKinds[lastKinds.length - 1] === kind && lastKinds[lastKinds.length - 2] === kind) {
      kind = "identify";
    }
    const weights = pool.map((s) => speciesWeight(stats[s.id]));
    const target = pickWeighted(pool, weights);
    const ex = BUILDERS[kind](target, unitPool, allPool) ?? makeIdentify(target, unitPool, allPool);
    if (ex) {
      exercises.push(ex);
      lastKinds.push(kind);
    }
  }
  return exercises;
}
