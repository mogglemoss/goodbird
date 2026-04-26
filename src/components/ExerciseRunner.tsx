import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Exercise } from "@/lib/types";
import { IdentifyExerciseView } from "./exercises/IdentifyExercise";
import { MnemonicExerciseView } from "./exercises/MnemonicExercise";
import { DiscriminateExerciseView } from "./exercises/DiscriminateExercise";
import { FindBirdExerciseView } from "./exercises/FindBirdExercise";
import { correctChime, wrongBuzz } from "@/lib/feedback";
import { stopAll } from "@/lib/audio";
import { getSpecies } from "@/lib/manifest";
import { cn } from "@/lib/cn";

interface Props {
  exercise: Exercise;
  exerciseIndex: number; // for re-mount key
  onAnswered: (correct: boolean, speciesId: string | null) => void;
  onContinue: () => void;
}

export function ExerciseRunner({ exercise, exerciseIndex, onAnswered, onContinue }: Props) {
  // Locked answer state lives here so the child can stay simple.
  const [locked, setLocked] = useState<{ value: any; correct: boolean } | null>(null);

  useEffect(() => {
    setLocked(null);
  }, [exerciseIndex]);

  const handleAnswered = (correct: boolean, locker: any, speciesId: string | null) => {
    setLocked({ value: locker, correct });
    if (correct) correctChime(); else wrongBuzz();
    onAnswered(correct, speciesId);
  };

  const handleContinue = () => {
    stopAll();
    onContinue();
  };

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={exerciseIndex}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mx-auto w-full max-w-md"
          >
            {renderExercise(exercise, locked, handleAnswered)}
          </motion.div>
        </AnimatePresence>
      </div>
      <FeedbackBar locked={locked} exercise={exercise} onContinue={handleContinue} />
    </div>
  );
}

function renderExercise(
  exercise: Exercise,
  locked: { value: any; correct: boolean } | null,
  onAnswered: (correct: boolean, locker: any, speciesId: string | null) => void,
) {
  switch (exercise.kind) {
    case "identify":
      return (
        <IdentifyExerciseView
          exercise={exercise}
          locked={locked?.value ?? null}
          onAnswered={(correct) => onAnswered(correct, exercise.choices.find(id => id === exercise.correctSpeciesId)!, exercise.correctSpeciesId)}
        />
      );
    case "mnemonic":
      return (
        <MnemonicExerciseView
          exercise={exercise}
          locked={locked?.value ?? null}
          onAnswered={(correct) => onAnswered(correct, exercise.correctSpeciesId, exercise.correctSpeciesId)}
        />
      );
    case "discriminate":
      return (
        <DiscriminateExerciseView
          exercise={exercise}
          locked={locked?.value ?? null}
          onAnswered={(correct) => onAnswered(correct, exercise.same, exercise.speciesIdA)}
        />
      );
    case "find-bird":
      return (
        <FindBirdExerciseView
          exercise={exercise}
          locked={locked?.value ?? null}
          onAnswered={(correct) => onAnswered(correct, exercise.correctIndex, exercise.targetSpeciesId)}
        />
      );
  }
}

function FeedbackBar({
  locked,
  exercise,
  onContinue,
}: {
  locked: { value: any; correct: boolean } | null;
  exercise: Exercise;
  onContinue: () => void;
}) {
  const correct = locked?.correct;
  const correctName = correctSpeciesName(exercise);

  return (
    <AnimatePresence>
      {locked && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className={cn(
            "border-t-2 px-5 py-4 sm:py-5",
            correct
              ? "border-(--color-correct) bg-(--color-correct-bg)"
              : "border-(--color-wrong) bg-(--color-wrong-bg)",
          )}
        >
          <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3">
            <div className="min-w-0">
              <div className={cn("font-display text-lg font-medium",
                correct ? "text-(--color-moss-700)" : "text-(--color-wrong)")}>
                {correct ? "Nice ear." : `It was the ${correctName}.`}
              </div>
              {!correct && (
                <div className="text-sm text-(--color-ink-soft) truncate">"{correctMnemonic(exercise)}"</div>
              )}
            </div>
            <button
              onClick={onContinue}
              className={cn(
                "tap-target shrink-0 rounded-full px-6 py-3 font-semibold text-white shadow-(--shadow-pop) transition-transform active:scale-95 cursor-pointer",
                correct ? "bg-(--color-moss-500) hover:bg-(--color-moss-600)" : "bg-(--color-wrong) hover:brightness-110",
              )}
            >
              Continue
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function correctSpeciesName(ex: Exercise): string {
  switch (ex.kind) {
    case "identify": return getSpecies(ex.correctSpeciesId).commonName;
    case "mnemonic": return getSpecies(ex.correctSpeciesId).commonName;
    case "find-bird": return getSpecies(ex.targetSpeciesId).commonName;
    case "discriminate": return ex.same ? "same species" : "different species";
  }
}
function correctMnemonic(ex: Exercise): string {
  switch (ex.kind) {
    case "identify":
    case "mnemonic":
      return getSpecies(ex.correctSpeciesId).mnemonic;
    case "find-bird":
      return getSpecies(ex.targetSpeciesId).mnemonic;
    case "discriminate":
      return "";
  }
}
