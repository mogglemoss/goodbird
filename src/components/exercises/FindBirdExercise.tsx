import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SpeciesCard } from "@/components/SpeciesCard";
import { getSpecies } from "@/lib/manifest";
import { cn } from "@/lib/cn";
import type { FindBirdExercise as FExercise } from "@/lib/types";

interface Props {
  exercise: FExercise;
  /** See IdentifyExercise — same locked semantics. The value is the index
   *  the user picked when known. */
  locked: { value: number | null; correct: boolean } | null;
  onAnswered: (correct: boolean, pickedIdx: number) => void;
}

export function FindBirdExerciseView({ exercise, onAnswered, locked }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const isLocked = locked !== null;
  const decided = locked?.value ?? picked;
  const target = getSpecies(exercise.targetSpeciesId);

  const choose = (idx: number) => {
    if (isLocked || picked !== null) return;
    setPicked(idx);
    onAnswered(idx === exercise.correctIndex, idx);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-(--color-ink-soft)">Find the bird</p>
        <h2 className="mt-1 text-xl font-medium">Which clip is the {target.commonName}?</h2>
        {!isLocked && (
          <p className="mt-2 text-xs text-(--color-ink-soft)">Tap ▶ to listen, then tap <strong className="text-(--color-ink)">Pick</strong>.</p>
        )}
      </div>
      <Link to={`/species/${target.id}`} className="w-40" aria-label={`More about ${target.commonName}`}>
        <SpeciesCard species={target} state="idle" />
      </Link>
      <div className="grid w-full grid-cols-3 gap-3">
        {exercise.recordings.map((rec, i) => {
          const isCorrect = i === exercise.correctIndex;
          let state: "idle" | "correct" | "wrong" | "reveal" = "idle";
          if (decided === i) state = isCorrect ? "correct" : "wrong";
          else if (isLocked && isCorrect) state = "reveal";
          return (
            <motion.div
              key={rec.id + i}
              className={cn(
                "flex flex-col items-center gap-3 rounded-(--radius-card) border-2 border-(--color-line) bg-(--color-surface) p-3 shadow-(--shadow-soft) transition-colors",
                state === "correct" && "border-(--color-correct) bg-(--color-correct-bg)",
                state === "wrong" && "border-(--color-wrong) bg-(--color-wrong-bg) shake",
                state === "reveal" && "border-(--color-correct) bg-(--color-correct-bg) ring-2 ring-(--color-correct)/40",
              )}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-(--color-ink-soft)">
                Clip {i + 1}
              </div>
              {/* Stop click bubbling so play doesn't commit a selection. */}
              <div onClick={(e) => e.stopPropagation()}>
                <AudioPlayer url={rec.url} size="md" label={`Play clip ${i + 1}`} gain={rec.gain ?? 1} />
              </div>
              <button
                type="button"
                onClick={() => choose(i)}
                disabled={isLocked}
                aria-pressed={decided === i}
                className={cn(
                  "tap-target w-full rounded-full px-3 py-2 text-sm font-semibold transition-colors cursor-pointer",
                  !isLocked
                    ? "bg-(--color-moss-500) text-white hover:bg-(--color-moss-600)"
                    : decided === i
                      ? isCorrect
                        ? "bg-(--color-correct) text-white"
                        : "bg-(--color-wrong) text-white"
                      : isCorrect
                        ? "bg-(--color-correct)/20 text-(--color-moss-700)"
                        : "bg-(--color-line) text-(--color-ink-soft)",
                )}
              >
                {!isLocked
                  ? "Pick"
                  : decided === i
                    ? isCorrect ? "Correct" : "Wrong"
                    : isCorrect ? "Was this" : "—"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
