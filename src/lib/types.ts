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
}

export interface LessonRef {
  id: string;
  title: string;
  speciesIds: string[];
  length: number;
}

export type UnitAccent = "moss" | "amber" | "sky" | "indigo" | "rose" | "sand";

export interface Unit {
  id: string;
  title: string;
  habitat: string;
  description: string;
  accent: UnitAccent;
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
}
