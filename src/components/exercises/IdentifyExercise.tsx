import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SpeciesCard } from "@/components/SpeciesCard";
import { getSpecies } from "@/lib/manifest";
import type { IdentifyExercise as IExercise } from "@/lib/types";

interface Props {
  exercise: IExercise;
  /** Locked state from the runner. `null` = not answered, free to pick.
   *  `{ value: <id>, ... }` = answered, that id was the user's pick.
   *  `{ value: null, ... }` = answered earlier (user navigated away and
   *  came back) — we don't know which id was picked, but they're locked
   *  out of re-answering. */
  locked: { value: string | null; correct: boolean } | null;
  onAnswered: (correct: boolean, picked: string) => void;
}

export function IdentifyExerciseView({ exercise, onAnswered, locked }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const nav = useNavigate();

  const isLocked = locked !== null;

  const choose = (id: string) => {
    if (isLocked || picked) return;
    setPicked(id);
    onAnswered(id === exercise.correctSpeciesId, id);
  };

  // The specific id we know was picked, if any. May be null even when locked.
  const decided = locked?.value ?? picked;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-(--color-ink-soft)">Listen</p>
        <h2 className="mt-1 text-xl font-medium">Whose voice is this?</h2>
      </div>
      <AudioPlayer url={exercise.recording.url} autoPlay showControls gain={exercise.recording.gain ?? 1} />
      <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {exercise.choices.map((id) => {
          const sp = getSpecies(id);
          let state: "idle" | "selected" | "correct" | "wrong" | "reveal" = "idle";
          if (decided === id) {
            state = id === exercise.correctSpeciesId ? "correct" : "wrong";
          } else if (isLocked && id === exercise.correctSpeciesId) {
            // Reveal the correct answer when locked — even if we don't know
            // which (wrong) card the user picked.
            state = "reveal";
          }
          // After answering (or after returning from species detail), tapping
          // any card opens that species' detail page. Before answering, taps
          // commit a selection via choose().
          const handleClick = isLocked ? () => nav(`/species/${id}`) : () => choose(id);
          return (
            <SpeciesCard
              key={id}
              species={sp}
              onClick={handleClick}
              state={state}
            />
          );
        })}
      </div>
    </div>
  );
}
