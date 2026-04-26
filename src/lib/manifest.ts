import raw from "@/data/coastal-scrub.json";
import type { Manifest, Species } from "./types";

export const manifest = raw as unknown as Manifest;

const bySpecies = new Map(manifest.species.map((s) => [s.id, s]));
export const getSpecies = (id: string): Species => {
  const s = bySpecies.get(id);
  if (!s) throw new Error(`Unknown species id: ${id}`);
  return s;
};

export const getLesson = (id: string) => {
  const l = manifest.lessons.find((l) => l.id === id);
  if (!l) throw new Error(`Unknown lesson id: ${id}`);
  return l;
};
