import { useState } from "react";
import { motion } from "framer-motion";
import { AudioPlayer } from "@/components/AudioPlayer";
import { getSpecies } from "@/lib/manifest";
import { cn } from "@/lib/cn";
import type { DiscriminateExercise as DExercise } from "@/lib/types";

interface Props {
  exercise: DExercise;
  onAnswered: (correct: boolean) => void;
  locked: boolean | null; // user's pick: same(true) or different(false)
}

export function DiscriminateExerciseView({ exercise, onAnswered, locked }: Props) {
  const [picked, setPicked] = useState<boolean | null>(null);
  const decided = locked ?? picked;

  const choose = (same: boolean) => {
    if (decided !== null) return;
    setPicked(same);
    onAnswered(same === exercise.same);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-(--color-ink-soft)">Compare</p>
        <h2 className="mt-1 text-xl font-medium">Same species, or different?</h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <AudioPlayer url={exercise.recordingA.url} size="md" label="Play clip 1" />
          <span className="text-xs font-medium text-(--color-ink-soft)">Clip 1</span>
        </div>
        <div className="text-2xl text-(--color-ink-soft)">vs</div>
        <div className="flex flex-col items-center gap-2">
          <AudioPlayer url={exercise.recordingB.url} size="md" label="Play clip 2" />
          <span className="text-xs font-medium text-(--color-ink-soft)">Clip 2</span>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-3">
        {([
          { val: true,  label: "Same species" },
          { val: false, label: "Different" },
        ] as const).map(({ val, label }) => {
          const isPicked = decided === val;
          const correct = val === exercise.same;
          let state: "idle" | "correct" | "wrong" | "reveal" = "idle";
          if (isPicked) state = correct ? "correct" : "wrong";
          else if (decided !== null && correct) state = "reveal";
          return (
            <motion.button
              key={String(val)}
              whileTap={decided !== null ? undefined : { scale: 0.97 }}
              disabled={decided !== null}
              onClick={() => choose(val)}
              className={cn(
                "tap-target rounded-(--radius-card) border-2 border-(--color-line) bg-(--color-surface) px-5 py-5 text-center font-medium shadow-(--shadow-soft) transition-colors",
                state === "correct" && "border-(--color-correct) bg-(--color-correct-bg)",
                state === "wrong" && "border-(--color-wrong) bg-(--color-wrong-bg) shake",
                state === "reveal" && "border-(--color-correct) bg-(--color-correct-bg) ring-2 ring-(--color-correct)/40",
                state === "idle" && "hover:border-(--color-moss-300)",
              )}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
      {decided !== null && (
        <div className="text-center text-sm text-(--color-ink-soft)">
          Clip 1: <strong>{getSpecies(exercise.speciesIdA).commonName}</strong>{" "}
          · Clip 2: <strong>{getSpecies(exercise.speciesIdB).commonName}</strong>
        </div>
      )}
    </div>
  );
}
