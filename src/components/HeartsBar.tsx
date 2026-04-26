import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface Props {
  hearts: number;
  max: number;
  progress: number; // 0..1
  freeplay?: boolean;
  onExit?: () => void;
}

export function HeartsBar({ hearts, max, progress, freeplay, onExit }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <button
        onClick={onExit}
        aria-label="Exit lesson"
        className="grid h-9 w-9 place-items-center rounded-full text-(--color-ink-soft) hover:bg-(--color-line) cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-(--color-line)">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-(--color-moss-500)"
          initial={false}
          animate={{ width: `${Math.max(4, progress * 100)}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </div>
      {freeplay ? (
        <span className="rounded-full border-2 border-(--color-moss-300) bg-(--color-moss-50) px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-(--color-moss-700)">
          Freeplay
        </span>
      ) : (
        <div
          role="status"
          aria-live="polite"
          aria-label={`${hearts} ${hearts === 1 ? "heart" : "hearts"} remaining`}
          className="flex items-center gap-1"
        >
          {Array.from({ length: max }).map((_, i) => (
            <Heart key={i} filled={i < hearts} />
          ))}
        </div>
      )}
    </div>
  );
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={cn("h-6 w-6", filled ? "text-(--color-wrong)" : "text-(--color-line)")}
      animate={filled ? {} : { scale: [1, 0.85, 1] }}
      transition={{ duration: 0.4 }}
      fill="currentColor"
    >
      <path d="M12 21s-7.5-4.6-9.6-9.2C1 8.5 2.6 5 6.1 5c2 0 3.6 1.1 4.4 2.7C11.3 6.1 12.9 5 14.9 5c3.5 0 5.1 3.5 3.7 6.8C19.5 16.4 12 21 12 21z" />
    </motion.svg>
  );
}
