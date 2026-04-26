import { useState } from "react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SpeciesCard } from "@/components/SpeciesCard";
import { getSpecies } from "@/lib/manifest";
import type { IdentifyExercise as IExercise } from "@/lib/types";

interface Props {
  exercise: IExercise;
  onAnswered: (correct: boolean) => void;
  locked: string | null; // selected species id once answered
}

export function IdentifyExerciseView({ exercise, onAnswered, locked }: Props) {
  const [picked, setPicked] = useState<string | null>(null);

  const choose = (id: string) => {
    if (locked || picked) return;
    setPicked(id);
    onAnswered(id === exercise.correctSpeciesId);
  };

  const decided = locked ?? picked;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-(--color-ink-soft)">Listen</p>
        <h2 className="mt-1 text-xl font-medium">Whose voice is this?</h2>
      </div>
      <AudioPlayer url={exercise.recording.url} autoPlay />
      <div className="grid w-full grid-cols-2 gap-3 sm:gap-4">
        {exercise.choices.map((id) => {
          const sp = getSpecies(id);
          let state: "idle" | "selected" | "correct" | "wrong" | "reveal" = "idle";
          if (decided === id) {
            state = id === exercise.correctSpeciesId ? "correct" : "wrong";
          } else if (decided && id === exercise.correctSpeciesId) {
            state = "reveal";
          }
          return (
            <SpeciesCard
              key={id}
              species={sp}
              onClick={() => choose(id)}
              state={state}
              disabled={!!decided}
            />
          );
        })}
      </div>
    </div>
  );
}
