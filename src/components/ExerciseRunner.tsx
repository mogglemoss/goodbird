import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Exercise } from "@/lib/types";
import { IdentifyExerciseView } from "./exercises/IdentifyExercise";
import { MnemonicExerciseView } from "./exercises/MnemonicExercise";
import { DiscriminateExerciseView } from "./exercises/DiscriminateExercise";
import { FindBirdExerciseView } from "./exercises/FindBirdExercise";
import { correctChime, wrongBuzz } from "@/lib/feedback";
import { getHowl, stopAll } from "@/lib/audio";
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
  const replayUrl = correctReplayUrl(exercise);
  // Local state — survives the exit animation since it's tied to this FeedbackBar instance.
  // Without this, a fast double-tap (or a flaky touch) on Continue can advance two exercises.
  const [advancing, setAdvancing] = useState(false);

  // Reset the guard when a fresh answer comes in (new locked, new exercise).
  useEffect(() => { setAdvancing(false); }, [locked, exercise]);

  const handleClick = () => {
    if (advancing) return;
    setAdvancing(true);
    onContinue();
  };

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
            <div className="min-w-0 flex items-center gap-3">
              {!correct && replayUrl && (
                <ReplayButton url={replayUrl} />
              )}
              <div className="min-w-0">
                <div className={cn("font-display text-lg font-medium",
                  correct ? "text-(--color-moss-700)" : "text-(--color-wrong)")}>
                  {correct ? "Nice ear." : `It was the ${correctName}.`}
                </div>
                {!correct && (
                  <div className="text-sm text-(--color-ink-soft) truncate">"{correctMnemonic(exercise)}"</div>
                )}
              </div>
            </div>
            <button
              onClick={handleClick}
              disabled={advancing}
              className={cn(
                "tap-target shrink-0 rounded-full px-6 py-3 font-semibold text-white shadow-(--shadow-pop) transition-transform active:scale-95 cursor-pointer",
                correct ? "bg-(--color-moss-500) hover:bg-(--color-moss-600)" : "bg-(--color-wrong) hover:brightness-110",
                advancing && "opacity-70 cursor-default",
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

function ReplayButton({ url }: { url: string }) {
  return (
    <button
      type="button"
      aria-label="Replay correct call"
      onClick={() => {
        stopAll();
        const sound = getHowl(url);
        sound.seek(0);
        sound.play();
      }}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-(--color-wrong) text-white shadow-(--shadow-pop) hover:brightness-110 active:scale-95 cursor-pointer"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M8 5.5v13a.5.5 0 0 0 .76.43l11-6.5a.5.5 0 0 0 0-.86l-11-6.5A.5.5 0 0 0 8 5.5z" />
      </svg>
    </button>
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

/** URL for the correct answer's first recording, used by the replay button on wrong answers. */
function correctReplayUrl(ex: Exercise): string | null {
  switch (ex.kind) {
    case "identify":
    case "mnemonic":
      return getSpecies(ex.correctSpeciesId).recordings[0]?.url ?? null;
    case "find-bird":
      return ex.recordings[ex.correctIndex]?.url ?? null;
    case "discriminate":
      return null; // no single "correct species" to replay
  }
}
