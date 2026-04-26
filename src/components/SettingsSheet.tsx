import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/game/store";
import { cn } from "@/lib/cn";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsSheet({ open, onClose }: Props) {
  const xp = useGame((s) => s.xp);
  const streakDays = useGame((s) => s.streak.days);
  const completedCount = useGame((s) => Object.keys(s.completedLessons).length);
  const speciesSeen = useGame((s) => Object.keys(s.speciesStats).length);
  const resetProgress = useGame((s) => s.resetProgress);
  const [confirming, setConfirming] = useState(false);

  // Reset confirm state when the sheet closes
  useEffect(() => { if (!open) setConfirming(false); }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-(--color-ink)/35 backdrop-blur-[2px]"
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-label="Settings"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl bg-(--color-surface) p-6 shadow-(--shadow-pop)"
          >
            <div className="mx-auto h-1 w-12 rounded-full bg-(--color-line)" aria-hidden />
            <h2 className="mt-4 font-display text-2xl">Settings</h2>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              <Stat label="XP" value={xp} />
              <Stat label="Day streak" value={streakDays} />
              <Stat label="Lessons done" value={completedCount} />
              <Stat label="Species heard" value={speciesSeen} />
            </dl>

            <div className="mt-6">
              {!confirming ? (
                <button
                  onClick={() => setConfirming(true)}
                  className="tap-target w-full rounded-full border-2 border-(--color-wrong)/40 bg-(--color-wrong-bg) px-5 py-3 font-semibold text-(--color-wrong) transition-colors hover:border-(--color-wrong) cursor-pointer"
                >
                  Reset all progress
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-(--color-ink-soft)">
                    This wipes XP, streak, lesson completions, and per-species stats.
                    Cannot be undone.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setConfirming(false)}
                      className="tap-target rounded-full border-2 border-(--color-line) px-5 py-3 font-semibold text-(--color-ink-soft) hover:border-(--color-ink-soft) cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { resetProgress(); onClose(); }}
                      className="tap-target rounded-full bg-(--color-wrong) px-5 py-3 font-semibold text-white shadow-(--shadow-pop) hover:brightness-110 cursor-pointer"
                    >
                      Yes, reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full text-center text-sm text-(--color-ink-soft) hover:text-(--color-ink) cursor-pointer"
            >
              Close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className={cn("rounded-2xl border-2 border-(--color-line) bg-(--color-bg) px-3 py-3")}>
      <div className="font-display text-2xl">{value}</div>
      <div className="text-xs uppercase tracking-wider text-(--color-ink-soft)">{label}</div>
    </div>
  );
}
