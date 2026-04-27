import { useMemo } from "react";
import { Link } from "react-router-dom";
import { allSpeciesWithRecordings, units, allLessons } from "@/lib/manifest";
import type { Species, UnitAccent } from "@/lib/types";
import { ACCENTS } from "@/lib/theme";
import { PlaySoundButton } from "./PlaySoundButton";
import { cn } from "@/lib/cn";

/** Deterministic hash of a string into a non-negative integer. */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function pickBirdOfDay(): { species: Species; accent: UnitAccent } | null {
  const pool = allSpeciesWithRecordings();
  if (!pool.length) return null;
  const idx = hashStr(todayStr()) % pool.length;
  const sp = pool[idx];
  // Find a primary unit for this species so we can color the card.
  const memberUnit = units.find((u) =>
    allLessons.some((l) => l.unitId === u.id && l.speciesIds.includes(sp.id)),
  );
  return { species: sp, accent: memberUnit?.accent ?? "moss" };
}

export function BirdOfTheDay() {
  const pick = useMemo(() => pickBirdOfDay(), []);
  if (!pick) return null;
  const { species, accent } = pick;
  const a = ACCENTS[accent];
  const url = species.recordings[0]?.url;

  return (
    <Link
      to={`/species/${species.id}`}
      className={cn(
        "mt-6 flex items-center gap-3 rounded-(--radius-card) border-2 px-3 py-3 shadow-(--shadow-soft) transition-colors sm:px-4",
        a.unlockedBorder,
        a.doneBg,
        a.unlockedHover,
      )}
    >
      <div
        className={cn(
          "h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 sm:h-16 sm:w-16",
          a.unlockedBorder,
        )}
      >
        {species.imageUrl ? (
          <img src={species.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-(--color-sand-50) text-2xl">🪶</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("font-mono text-[10px] font-medium uppercase tracking-[0.2em]", a.label)}>
          Bird of the day
        </p>
        <h3 className="truncate font-display text-lg leading-tight sm:text-xl">{species.commonName}</h3>
        <p className="truncate text-xs italic text-(--color-ink-soft)">"{species.mnemonic}"</p>
      </div>
      {url && (
        <div onClick={(e) => { e.preventDefault(); }}>
          <PlaySoundButton url={url} tone="moss" size="sm" ariaLabel={`Play ${species.commonName}`} />
        </div>
      )}
    </Link>
  );
}
