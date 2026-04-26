import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/game/store";
import { allMediaUrls } from "@/lib/manifest";
import { clearMediaCache, countCachedMedia, estimateCacheBytes, precacheUrls } from "@/lib/sw";
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

  const [confirming, setConfirming] = useState(false);
  const [offline, setOffline] = useState<OfflineState>({ kind: "idle" });
  const [storageBytes, setStorageBytes] = useState<number | null>(null);
  const [cachedCount, setCachedCount] = useState<number | null>(null);

  const refreshStorage = () => {
    estimateCacheBytes().then(setStorageBytes);
    countCachedMedia().then(setCachedCount);
  };

  useEffect(() => { if (!open) setConfirming(false); }, [open]);
  useEffect(() => {
    if (!open) return;
    refreshStorage();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] max-w-md overflow-y-auto rounded-t-3xl bg-(--color-surface) p-6 shadow-(--shadow-pop)"
          >
            <div className="mx-auto h-1 w-12 rounded-full bg-(--color-line)" aria-hidden />
            <h2 className="mt-4 font-display text-2xl">Settings</h2>

            <Section title="Mode">
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-(--color-line) bg-(--color-bg) px-4 py-3">
                <div className="min-w-0">
                  <div className="font-medium">Freeplay mode</div>
                  <div className="text-xs text-(--color-ink-soft)">Hearts don't deplete; lessons can't fail.</div>
                </div>
                <input
                  type="checkbox"
                  checked={freeplay}
                  onChange={(e) => setFreeplay(e.target.checked)}
                  className="h-5 w-5 accent-(--color-moss-500)"
                />
              </label>
            </Section>

            <Section title="Stats">
              <dl className="grid grid-cols-2 gap-3">
                <Stat label="XP" value={xp} />
                <Stat label="Day streak" value={streakDays} />
                <Stat label="Lessons done" value={completedCount} />
                <Stat label="Species heard" value={speciesSeen} />
              </dl>
            </Section>

            <Section title="Offline">
              {!("serviceWorker" in navigator) || import.meta.env.DEV ? (
                <p className="text-sm text-(--color-ink-soft)">
                  Offline mode is only available on the deployed site, not in dev.
                </p>
              ) : (
                <>
                  <p className="text-sm text-(--color-ink-soft)">
                    Lessons you've already played are cached automatically. Tap below
                    to pre-download every clip and image so the app works on the trail.
                  </p>
                  {(cachedCount !== null || storageBytes !== null) && (
                    <p className="mt-2 text-xs text-(--color-ink-soft)">
                      {cachedCount !== null && <>{cachedCount} clips/images cached</>}
                      {cachedCount !== null && storageBytes !== null && " · "}
                      {storageBytes !== null && (
                        <>
                          ~{formatBytes(storageBytes)}{" "}
                          <span title="Browsers pad cross-origin (no-cors) cache entries to ~7 MB each as a side-channel defense, so this number can be much larger than actual disk use.">
                            (padded)
                          </span>
                        </>
                      )}
                    </p>
                  )}
                  {offline.kind === "idle" && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        onClick={startDownload}
                        className="tap-target rounded-full bg-(--color-moss-500) px-4 py-3 text-sm font-semibold text-white shadow-(--shadow-pop) hover:bg-(--color-moss-600) cursor-pointer"
                      >
                        Download for offline
                      </button>
                      <button
                        onClick={wipeMedia}
                        className="tap-target rounded-full border-2 border-(--color-line) px-4 py-3 text-sm font-semibold text-(--color-ink-soft) hover:border-(--color-ink-soft) cursor-pointer"
                      >
                        Clear media cache
                      </button>
                    </div>
                  )}
                  {offline.kind === "downloading" && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-(--color-ink-soft)">
                        <span>Downloading…</span>
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

            <Section title="Reset">
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
                    Wipes XP, streak, lesson completions, and per-species stats. Cannot be undone.
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

            <button
              onClick={onClose}
              className="mt-6 w-full text-center text-sm text-(--color-ink-soft) hover:text-(--color-ink) cursor-pointer"
            >
              Close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-(--color-ink-soft)">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
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

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(0)} KB`;
  if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
  return `${(b / 1024 ** 3).toFixed(2)} GB`;
}
