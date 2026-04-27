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
import { PlaySoundButton } from "./PlaySoundButton";
import { ACCENTS } from "@/lib/theme";
import type { UnitAccent } from "@/lib/types";
import { cn } from "@/lib/cn";

interface Props {
  exercise: Exercise;
  exerciseIndex: number; // for re-mount key
  /** Result already recorded in the store for this exercise, if the user
   * navigated away and came back. Lets us re-show the locked feedback
   * state instead of allowing them to re-answer. */
  previouslyAnswered?: { correct: boolean } | null;
  /** Unit accent — used to color the Hint pill so it matches the lesson's habitat. */
  accent?: UnitAccent | null;
  onAnswered: (correct: boolean, speciesId: string | null) => void;
  onContinue: () => void;
}

export function ExerciseRunner({ exercise, exerciseIndex, previouslyAnswered, accent, onAnswered, onContinue }: Props) {
  const a = accent ? ACCENTS[accent] : null;
  // Locked answer state lives here so the child can stay simple.
  // If the store already has a result for this exercise (user navigated to a
  // species page and back), seed locked so they can't re-answer.
  const seed = previouslyAnswered ? { value: null, correct: previouslyAnswered.correct } : null;
  const [locked, setLocked] = useState<{ value: any; correct: boolean } | null>(seed);
  const [hintShown, setHintShown] = useState(false);

  useEffect(() => {
    setLocked(previouslyAnswered ? { value: null, correct: previouslyAnswered.correct } : null);
    setHintShown(false);
  }, [exerciseIndex, previouslyAnswered]);

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

      {/* Hint pill — visible while you haven't answered yet. */}
      {!locked && hintFor(exercise) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-5">
          <div className="pointer-events-auto flex flex-col items-center gap-2">
            <AnimatePresence>
              {hintShown && (
                <motion.div
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className={cn(
                    "max-w-xs rounded-2xl border-2 px-4 py-2 text-center text-sm font-medium shadow-(--shadow-soft)",
                    a?.unlockedBorder ?? "border-(--color-moss-300)",
                    a?.doneBg ?? "bg-(--color-moss-50)",
                    a?.label ?? "text-(--color-moss-700)",
                  )}
                >
                  "{hintFor(exercise)}"
                </motion.div>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={() => setHintShown((s) => !s)}
              className={cn(
                "rounded-full border-2 bg-(--color-surface) px-3 py-1 text-xs font-semibold shadow-(--shadow-soft) transition-colors cursor-pointer",
                hintShown
                  ? cn(a?.doneBorder ?? "border-(--color-moss-500)", a?.label ?? "text-(--color-moss-700)")
                  : cn("border-(--color-line) text-(--color-ink-soft)", a?.unlockedHover ?? "hover:border-(--color-moss-300)"),
              )}
            >
              {hintShown ? "Hide hint" : "💡 Hint"}
            </button>
          </div>
        </div>
      )}

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
      {/* Screen-reader announcement of the answer outcome — outside
          AnimatePresence so the message stays in the DOM long enough for
          screen readers to read it. */}
      <div role="status" aria-live="polite" className="sr-only">
        {locked
          ? (locked.correct
              ? `Correct. ${correctName}.`
              : `Wrong. It was the ${correctName}.`)
          : ""}
      </div>
      {locked && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          // Full-bleed across the viewport so the tinted accent doesn't end
          // abruptly at the lesson container's max-width on desktop.
          // ml/mr negatives = half-viewport-minus-half-container.
          className={cn(
            "ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] border-t-2 px-5 py-4 sm:py-5",
            correct
              ? "border-(--color-correct) bg-(--color-correct-bg)"
              : "border-(--color-wrong) bg-(--color-wrong-bg)",
          )}
        >
          <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-3">
              {replayUrl && (
                <PlaySoundButton
                  url={replayUrl}
                  tone={correct ? "moss" : "wrong"}
                  ariaLabel={correct ? "Replay this call" : "Replay correct call"}
                />
              )}
              <div className="min-w-0">
                <div className={cn("font-display text-lg font-medium",
                  correct ? "text-(--color-moss-700)" : "text-(--color-wrong)")}>
                  {correct ? `${correctName} ✓` : `It was the ${correctName}.`}
                </div>
                <div className="text-sm text-(--color-ink-soft) truncate">"{correctMnemonic(exercise)}"</div>
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

/** Hint text shown by the in-exercise hint button. */
function hintFor(ex: Exercise): string | null {
  switch (ex.kind) {
    case "identify":
    case "mnemonic":
      return getSpecies(ex.correctSpeciesId).mnemonic;
    case "find-bird":
      return getSpecies(ex.targetSpeciesId).mnemonic;
    case "discriminate":
      return ex.same ? "Same species — listen for matching pacing and pitch." : "Different species.";
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
