import { useState } from "react";
import { motion } from "framer-motion";
import { AudioPlayer } from "@/components/AudioPlayer";
import { getSpecies } from "@/lib/manifest";
import { cn } from "@/lib/cn";
import type { MnemonicExercise as MExercise } from "@/lib/types";

interface Props {
  exercise: MExercise;
  /** See IdentifyExercise — same locked semantics. */
  locked: { value: string | null; correct: boolean } | null;
  onAnswered: (correct: boolean, picked: string) => void;
}

export function MnemonicExerciseView({ exercise, onAnswered, locked }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const isLocked = locked !== null;

  const choose = (id: string) => {
    if (isLocked || picked) return;
    setPicked(id);
    onAnswered(id === exercise.correctSpeciesId, id);
  };
  const decided = locked?.value ?? picked;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-(--color-ink-soft)">Match the phrase</p>
        <h2 className="mt-1 text-xl font-medium">Which mnemonic fits this call?</h2>
      </div>
      <AudioPlayer url={exercise.recording.url} autoPlay showControls gain={exercise.recording.gain ?? 1} />
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {exercise.choices.map((id) => {
          const sp = getSpecies(id);
          const state =
            decided === id
              ? id === exercise.correctSpeciesId ? "correct" : "wrong"
              : isLocked && id === exercise.correctSpeciesId ? "reveal" : "idle";
          return (
            <motion.button
              key={id}
              type="button"
              whileTap={isLocked ? undefined : { scale: 0.98 }}
              disabled={isLocked}
              onClick={() => choose(id)}
              className={cn(
                "tap-target rounded-(--radius-card) border-2 border-(--color-line) bg-(--color-surface) px-5 py-4 text-left shadow-(--shadow-soft) transition-colors",
                state === "correct" && "border-(--color-correct) bg-(--color-correct-bg)",
                state === "wrong" && "border-(--color-wrong) bg-(--color-wrong-bg) shake",
                state === "reveal" && "border-(--color-correct) bg-(--color-correct-bg) ring-2 ring-(--color-correct)/40",
                state === "idle" && "hover:border-(--color-moss-300)",
              )}
            >
              <div className="font-display text-lg leading-snug">"{sp.mnemonic}"</div>
              {isLocked && (
                <div className="mt-1 text-sm text-(--color-ink-soft)">{sp.commonName}</div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
