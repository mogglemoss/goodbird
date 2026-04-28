/**
 * The 30 phrases that rotate through the Hero section's headline slot.
 * Picked deterministically per calendar day via dailyPick().
 *
 * Mix of:
 *   - imperatives / invitations (1-10)
 *   - place & atmosphere (11-20) — leans West-Marin-specific
 *   - time, scope, meta (21-30) — counts read live from the manifest
 *
 * Phrases can be plain strings OR thunks that compute live values
 * from the manifest (so habitat / species counts stay accurate as
 * content grows).
 */

import { units, allSpeciesWithRecordings } from "./manifest";

type Phrase = string | (() => string);

const roundDown = (n: number, to: number) => Math.floor(n / to) * to;

export const HERO_PHRASES: Phrase[] = [
  // Invitations
  "Pick a habitat.",
  "Open your ears.",
  "Listen, then look.",
  "Whose call is that?",
  "Know that one?",
  "Can you place it?",
  "Tune your ear.",
  "Start anywhere.",
  "Learn the locals.",
  "Bring your morning ears.",

  // Place & atmosphere
  "The hills are talking.",
  "The fog is talking.",
  "The marsh is awake.",
  "The redwoods speak first.",
  "The wood is singing.",
  "Quail country.",
  "Wrentit weather.",
  "Pasture light.",
  "Coast to ridge.",
  "From driveway to ridgetop.",

  // Time, scope, meta — counts live from the manifest so they
  // stay accurate as content grows.
  () => `${units.length} dawn choruses.`,
  () => `${roundDown(allSpeciesWithRecordings().length, 10)}+ voices.`,
  "Two-note morning.",
  "Dawn is loud.",
  "Owl-light hour.",
  "Coffee, then call notes.",
  "Pre-dawn, post-coffee.",
  "A song for every habitat.",
  "Listen at home; watch in the field.",
  "Your ears, the field guide.",
];

/** Resolve a phrase to a string (calling thunks if present). */
export function resolvePhrase(p: Phrase): string {
  return typeof p === "function" ? p() : p;
}
