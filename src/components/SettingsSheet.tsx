import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/game/store";
import { allMediaUrls } from "@/lib/manifest";
import { clearMediaCache, countCachedMedia, precacheUrls } from "@/lib/sw";
import { Wordmark } from "@/components/brand/Wordmark";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { cn } from "@/lib/cn";

interface Props {
  open: boolean;
  onClose: () => void;
}

type OfflineState =
  | { kind: "idle" }
  | { kind: "downloading"; done: number; total: number }
  | { kind: "done"; failed: number }
  | { kind: "error"; message: string };

export function SettingsSheet({ open, onClose }: Props) {
  const xp = useGame((s) => s.xp);
  const streakDays = useGame((s) => s.streak.days);
  const completedCount = useGame((s) => Object.keys(s.completedLessons).length);
  const speciesSeen = useGame((s) => Object.keys(s.speciesStats).length);
  const resetProgress = useGame((s) => s.resetProgress);
  const freeplay = useGame((s) => s.freeplay);
  const setFreeplay = useGame((s) => s.setFreeplay);
  const dailyGoal = useGame((s) => s.dailyGoal);
  const setDailyGoal = useGame((s) => s.setDailyGoal);

  const [confirming, setConfirming] = useState(false);
  const [offline, setOffline] = useState<OfflineState>({ kind: "idle" });
  const [cachedCount, setCachedCount] = useState<number | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // We deliberately don't show a byte-size estimate. Browsers pad cross-origin
  // (no-cors) cache entries to ~7 MB each as a side-channel-attack defense, so
  // navigator.storage.estimate() can be off by 30x. The clip count is honest.
  const refreshStorage = () => {
    countCachedMedia().then(setCachedCount);
  };

  // Reset the destructive-confirm state when the sheet closes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (!open) setConfirming(false); }, [open]);
  useEffect(() => {
    if (!open) return;
    refreshStorage();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    // Body scroll lock — without this, scrolling inside the sheet bleeds
    // through to the page behind once the sheet content fits in its container.
    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [open, onClose]);

  const startDownload = async () => {
    const urls = allMediaUrls();
    setOffline({ kind: "downloading", done: 0, total: urls.length });
    try {
      const result = await precacheUrls(urls, (p) =>
        setOffline({ kind: "downloading", done: p.done, total: p.total }),
      );
      setOffline({ kind: "done", failed: result.failed });
      refreshStorage();
    } catch (e) {
      setOffline({ kind: "error", message: (e as Error).message });
    }
  };

  const wipeMedia = async () => {
    await clearMediaCache();
    setOffline({ kind: "idle" });
    refreshStorage();
  };

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
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] max-w-md overflow-y-auto overscroll-contain rounded-t-3xl bg-(--color-surface) px-6 pb-8 pt-6 shadow-(--shadow-pop)"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-(--color-ink-soft)">
                  Field protocol
                </p>
                <h2 className="mt-1 font-display text-3xl">Settings</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close settings"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-(--color-ink-soft) hover:bg-(--color-line) cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Field ethics — promoted from Onboarding footer to a permanent reference */}
            <Section label="Field ethics">
              <p className="rounded-2xl border-2 border-(--color-moss-300)/60 bg-(--color-moss-50) px-4 py-3 text-sm leading-snug text-(--color-ink)">
                <strong>Listen at home; watch in the field.</strong>{" "}
                <span className="text-(--color-ink-soft)">
                  Playing recordings outside to attract birds stresses them and
                  disturbs territories, especially while nesting. The recordings
                  are for ear training, not as bait.
                </span>
              </p>
            </Section>

            <Section label="Mode">
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-(--color-line) bg-(--color-bg) px-4 py-3">
                <div className="min-w-0">
                  <div className="font-medium">Freeplay</div>
                  <div className="text-xs text-(--color-ink-soft)">Hearts don't deplete; lessons can't fail.</div>
                </div>
                <input
                  type="checkbox"
                  checked={freeplay}
                  onChange={(e) => setFreeplay(e.target.checked)}
                  className="h-5 w-5 accent-(--color-moss-500)"
                />
              </label>

              <div className="mt-3 rounded-2xl border-2 border-(--color-line) bg-(--color-bg) px-4 py-3">
                <div className="flex items-baseline justify-between">
                  <div className="font-medium">Daily goal</div>
                  <div className="font-display text-lg text-(--color-moss-700)">{dailyGoal} <span className="font-mono text-xs">XP</span></div>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="mt-2 w-full accent-(--color-moss-500)"
                  aria-label="Daily XP goal"
                />
                <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-(--color-ink-soft)">
                  <span>casual</span>
                  <span>committed</span>
                </div>
              </div>
            </Section>

            <Section label="Field log">
              <dl className="grid grid-cols-2 gap-3">
                <Stat label="XP" value={xp} />
                <Stat label="Day streak" value={streakDays} />
                <Stat label="Lessons" value={completedCount} />
                <Stat label="Species heard" value={speciesSeen} />
              </dl>
            </Section>

            <Section label="Offline">
              {!("serviceWorker" in navigator) || import.meta.env.DEV ? (
                <p className="text-sm text-(--color-ink-soft)">
                  Offline mode is only available on the deployed site, not in dev.
                </p>
              ) : (
                <>
                  <p className="text-sm leading-snug text-(--color-ink-soft)">
                    Lessons you've already played are cached automatically.
                    Tap below to pre-download every clip and image so the app
                    works without an internet connection.
                  </p>
                  {cachedCount !== null && (
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-(--color-ink-soft)">
                      {cachedCount} clips / images cached
                    </p>
                  )}
                  {offline.kind === "idle" && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        onClick={startDownload}
                        className="tap-target rounded-full bg-(--color-moss-500) px-4 py-3 text-sm font-semibold text-white shadow-(--shadow-pop) hover:bg-(--color-moss-600) cursor-pointer"
                      >
                        Download all
                      </button>
                      <button
                        onClick={wipeMedia}
                        className="tap-target rounded-full border-2 border-(--color-line) px-4 py-3 text-sm font-semibold text-(--color-ink-soft) hover:border-(--color-ink-soft) cursor-pointer"
                      >
                        Clear cache
                      </button>
                    </div>
                  )}
                  {offline.kind === "downloading" && (
                    <div className="mt-3">
                      <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-(--color-ink-soft)">
                        <span>downloading…</span>
                        <span>{offline.done}/{offline.total}</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-(--color-line)">
                        <div
                          className="h-full bg-(--color-moss-500) transition-[width]"
                          style={{ width: `${(offline.done / offline.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {offline.kind === "done" && (
                    <p className="mt-3 text-sm text-(--color-moss-700)">
                      ✓ Done.{offline.failed ? ` (${offline.failed} clips failed — they'll retry next time you play one.)` : ""}
                    </p>
                  )}
                  {offline.kind === "error" && (
                    <p className="mt-3 text-sm text-(--color-wrong)">{offline.message}</p>
                  )}
                </>
              )}
            </Section>

            <Section label="About">
              <div className="rounded-2xl border-2 border-(--color-line) bg-(--color-bg) px-4 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Wordmark size="sm" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-(--color-ink-soft)">
                    v{__APP_VERSION__}
                  </span>
                </div>
                <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-(--color-ink-soft)">
                  Recordings from <a href="https://xeno-canto.org" target="_blank" rel="noopener noreferrer" className="text-(--color-moss-700) underline">xeno-canto</a>.
                  Photographs from <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="text-(--color-moss-700) underline">Wikimedia Commons</a>.
                  Observation data from <a href="https://inaturalist.org" target="_blank" rel="noopener noreferrer" className="text-(--color-moss-700) underline">iNaturalist</a>.
                  All under Creative Commons; recordist credit on each clip.
                </p>
                <div className="mt-3 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em]">
                  <a
                    href="https://github.com/mogglemoss/goodbird"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-(--color-ink-soft) underline hover:text-(--color-ink)"
                  >
                    GitHub
                  </a>
                  <span aria-hidden className="text-(--color-line)">·</span>
                  <span className="text-(--color-ink-soft)">MIT licensed</span>
                </div>
              </div>
              <button
                onClick={() => setFeedbackOpen(true)}
                className="mt-3 tap-target w-full rounded-full border-2 border-(--color-line) bg-(--color-surface) px-5 py-3 text-sm font-semibold text-(--color-ink) transition-colors hover:border-(--color-moss-300) cursor-pointer"
              >
                Send feedback
              </button>
            </Section>
            <FeedbackDialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

            <Section label="Danger" tone="warn">
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
                    Wipes XP, streak, lesson completions, favorites, and per-species stats. Cannot be undone.
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
            </Section>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ label, tone, children }: { label: string; tone?: "warn"; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3
        className={cn(
          "font-mono text-[10px] font-medium uppercase tracking-[0.22em]",
          tone === "warn" ? "text-(--color-wrong)" : "text-(--color-moss-700)",
        )}
      >
        {label}
      </h3>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border-2 border-(--color-line) bg-(--color-moss-50) px-3 py-3">
      <div className="font-display text-2xl tabular-nums">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-(--color-ink-soft)">{label}</div>
    </div>
  );
}

