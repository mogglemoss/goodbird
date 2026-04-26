import { useState } from "react";
import { motion } from "framer-motion";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SpeciesCard } from "@/components/SpeciesCard";
import { getSpecies } from "@/lib/manifest";
import { cn } from "@/lib/cn";
import type { FindBirdExercise as FExercise } from "@/lib/types";

interface Props {
  exercise: FExercise;
  onAnswered: (correct: boolean) => void;
  locked: number | null;
}

export function FindBirdExerciseView({ exercise, onAnswered, locked }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const decided = locked ?? picked;
  const target = getSpecies(exercise.targetSpeciesId);

  const choose = (idx: number) => {
    if (decided !== null) return;
    setPicked(idx);
    onAnswered(idx === exercise.correctIndex);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-(--color-ink-soft)">Find the bird</p>
        <h2 className="mt-1 text-xl font-medium">Which clip is the {target.commonName}?</h2>
      </div>
      <div className="w-40">
        <SpeciesCard species={target} disabled state="idle" />
      </div>
      <div className="grid w-full grid-cols-3 gap-3">
        {exercise.recordings.map((rec, i) => {
          const isCorrect = i === exercise.correctIndex;
          let state: "idle" | "correct" | "wrong" | "reveal" = "idle";
          if (decided === i) state = isCorrect ? "correct" : "wrong";
          else if (decided !== null && isCorrect) state = "reveal";
          return (
            <motion.div
              key={rec.id + i}
              whileTap={decided !== null ? undefined : { scale: 0.97 }}
              className={cn(
                "flex flex-col items-center gap-3 rounded-(--radius-card) border-2 border-(--color-line) bg-(--color-surface) p-4 shadow-(--shadow-soft) transition-colors cursor-pointer",
                state === "correct" && "border-(--color-correct) bg-(--color-correct-bg)",
                state === "wrong" && "border-(--color-wrong) bg-(--color-wrong-bg) shake",
                state === "reveal" && "border-(--color-correct) bg-(--color-correct-bg) ring-2 ring-(--color-correct)/40",
                state === "idle" && "hover:border-(--color-moss-300)",
              )}
              onClick={() => choose(i)}
            >
              <AudioPlayer url={rec.url} size="md" label={`Play clip ${i + 1}`} />
              <div className="text-sm font-medium">Clip {i + 1}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
