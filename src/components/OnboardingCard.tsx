import { motion } from "framer-motion";
import { useGame } from "@/game/store";

export function OnboardingCard() {
  const hasOnboarded = useGame((s) => s.hasOnboarded);
  const setOnboarded = useGame((s) => s.setOnboarded);

  if (hasOnboarded) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto mt-6 max-w-md overflow-hidden rounded-(--radius-card) border-2 border-(--color-moss-300) bg-(--color-moss-50) p-5 shadow-(--shadow-soft)"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-(--color-moss-700)">
            Quick orientation
          </p>
          <h2 className="mt-1 font-display text-xl leading-snug">A field guide you can hear.</h2>
        </div>
        <button
          onClick={setOnboarded}
          aria-label="Dismiss"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-(--color-ink-soft) hover:bg-(--color-surface)/60 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <ol className="mt-4 space-y-2.5 text-sm">
        <Step n="1" text="Pick a habitat. Each is a short course on what's singing there right now." />
        <Step n="2" text="You'll hear a bird. Pick the right species from four cards before you run out of hearts." />
        <Step n="3" text="Tap ⋯ for offline mode, freeplay, and a daily XP goal you can tune." />
      </ol>
      <p className="mt-4 rounded-xl border border-(--color-moss-300)/60 bg-(--color-surface)/60 px-3 py-2 text-xs leading-snug text-(--color-ink-soft)">
        <strong className="text-(--color-ink)">A note for the trail.</strong>{" "}
        Please don't play these recordings outside. Even brief playback stresses
        nesting birds and disturbs territories. Listen at home; watch in the field.
      </p>
      <button
        onClick={setOnboarded}
        className="mt-4 w-full rounded-full bg-(--color-moss-500) py-2.5 text-sm font-semibold text-white shadow-(--shadow-soft) hover:bg-(--color-moss-600) cursor-pointer"
      >
        Begin
      </button>
    </motion.div>
  );
}

function Step({ n, text }: { n: string; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-(--color-moss-500) text-xs font-bold text-white">
        {n}
      </span>
      <span className="text-(--color-ink)">{text}</span>
    </li>
  );
}
