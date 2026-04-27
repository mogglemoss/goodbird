export interface Recording {
  id: string;
  url: string;
  duration: number;
  type: string;
  recordist: string;
  location: string;
  license: string;
  sourceUrl: string;
}

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  mnemonic: string;
  imageUrl: string | null;
  recordings: Recording[];
  /** Optional one-line "where + when" hint for naturalists. */
  field?: string;
}

export interface LessonRef {
  id: string;
  title: string;
  speciesIds: string[];
  length: number;
  /** Annotated by the manifest loader; not present in the JSON files. */
  unitId?: string;
}

export type UnitAccent = "moss" | "amber" | "sky" | "indigo" | "rose" | "sand" | "emerald" | "violet";

export interface Unit {
  id: string;
  title: string;
  habitat: string;
  description: string;
  accent: UnitAccent;
  /** One-line italic narrative descriptor for the home grid card. */
  tagline?: string;
}

export interface Manifest {
  unit: Unit;
  species: Species[];
  lessons: LessonRef[];
}

export type ExerciseKind = "identify" | "discriminate" | "mnemonic" | "find-bird";

export interface IdentifyExercise {
  kind: "identify";
  recording: Recording;
  correctSpeciesId: string;
  choices: string[]; // 4 species ids including correct
}

export interface DiscriminateExercise {
  kind: "discriminate";
  recordingA: Recording;
  recordingB: Recording;
  speciesIdA: string;
  speciesIdB: string;
  same: boolean;
}

export interface MnemonicExercise {
  kind: "mnemonic";
  recording: Recording;
  correctSpeciesId: string;
  choices: string[]; // 4 species ids; player picks by mnemonic phrase
}

export interface FindBirdExercise {
  kind: "find-bird";
  targetSpeciesId: string;
  recordings: Recording[]; // 3 clips, one matches target
  correctIndex: number;
}

export type Exercise =
  | IdentifyExercise
  | DiscriminateExercise
  | MnemonicExercise
  | FindBirdExercise;

export interface SpeciesStat {
  timesSeen: number;
  timesCorrect: number;
  lastSeenAt: number;
  /** Spaced-repetition interval in days; doubles on correct, resets to 1 on wrong. */
  interval?: number;
  /** Timestamp at which this species is "due" for review; lesson generator boosts due species. */
  dueAt?: number;
}
