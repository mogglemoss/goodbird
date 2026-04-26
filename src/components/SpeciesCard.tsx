import { motion } from "framer-motion";
import type { Species } from "@/lib/types";
import { cn } from "@/lib/cn";

type State = "idle" | "selected" | "correct" | "wrong" | "reveal";

interface Props {
  species: Species;
  onClick?: () => void;
  state?: State;
  showName?: boolean;
  disabled?: boolean;
  small?: boolean;
}

const stateStyles: Record<State, string> = {
  idle: "bg-(--color-surface) hover:border-(--color-moss-300) hover:-translate-y-0.5",
  selected: "border-(--color-moss-500) bg-(--color-moss-50)",
  correct: "border-(--color-correct) bg-(--color-correct-bg)",
  wrong: "border-(--color-wrong) bg-(--color-wrong-bg) shake",
  reveal: "border-(--color-correct) bg-(--color-correct-bg) ring-2 ring-(--color-correct)/40",
};

export function SpeciesCard({ species, onClick, state = "idle", showName = true, disabled, small }: Props) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.97 }}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "tap-target group flex w-full flex-col items-center overflow-hidden rounded-(--radius-card) border-2 border-(--color-line) text-left shadow-(--shadow-soft) transition-all duration-150",
        "disabled:cursor-default",
        stateStyles[state],
        small ? "p-2" : "p-3",
      )}
    >
      <div className={cn("relative w-full overflow-hidden rounded-xl bg-(--color-sand-50)", small ? "aspect-[4/3]" : "aspect-square")}>
        {species.imageUrl ? (
          <img
            src={species.imageUrl}
            alt={species.commonName}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">🪶</div>
        )}
      </div>
      {showName && (
        <div className={cn("mt-2 w-full px-1 text-center font-medium text-(--color-ink)", small ? "text-sm" : "text-base")}>
          {species.commonName}
        </div>
      )}
    </motion.button>
  );
}
