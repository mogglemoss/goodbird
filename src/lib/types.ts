export interface Recording {
  id: string;
  url: string;
  duration: number;
  type: string;
  recordist: string;
  location: string;
  license: string;
  sourceUrl: string;
  /** Per-clip volume multiplier (0..1) computed by scripts/normalize-audio.mjs.
   *  ffmpeg's loudnorm pass measures integrated LUFS; we store the gain that
   *  drops loud clips down to a common target (~-30 LUFS) so a faint nuthatch
   *  and a screaming jay land at comparable loudness. Defaults to 1.0 when
   *  measurement hasn't been run yet for this recording. */
  gain?: number;
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
  /** Override default object-position when the photo's subject is offset.
   *  Defaults to "top" for small circular crops; "center" for the detail page.
   *  Use this for photos where the bird is unusually placed and gets cropped poorly. */
  imagePosition?: "top" | "center" | "bottom" | "left" | "right";
}

export interface LessonRef {
  id: string;
  title: string;
  speciesIds: string[];
  length: number;
  /** Annotated by the manifest loader; not present in the JSON files. */
  unitId?: string;
}

export type UnitAccent =
  | "moss"      // Coastal Scrub
  | "amber"     // Oak Woodland
  | "sky"       // Riparian / Creekside
  | "indigo"    // Tomales Bay / Estuary
  | "rose"      // Pasture & Open Country
  | "sand"      // Coastal Conifer
  | "emerald"   // Marsh & Wetland
  | "violet"    // Night Voices
  | "slate"     // Soaring Country (raptors + sky)
  | "teal"      // Open Coast & Headlands
  | "orange"    // Redwood & Mixed Forest (bark color)
  | "fuchsia";  // Town & Garden

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
