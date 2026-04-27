import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { getRouteHistory } from "@/lib/route-history";
import { useGame } from "@/game/store";

/**
 * Formspree form ID — the path segment from formspree.io/f/<this-bit>.
 * Maintained by the goodbird owner; rotate by creating a new form at
 * formspree.io and pasting its ID here.
 */
const FORMSPREE_FORM_ID = "xojyzwzn";

interface Props {
  open: boolean;
  onClose: () => void;
}

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

export function FeedbackDialog({ open, onClose }: Props) {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ kind: "idle" });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!FORMSPREE_FORM_ID) return;
    setState({ kind: "submitting" });
    const form = e.currentTarget;
    const data = new FormData(form);
    // Auto-attach diagnostic info so bug reports include something useful.
    // The user's last few routes are more useful than just the current one —
    // they may have navigated home (or anywhere) before tapping Settings → Send.
    data.set("_subject", `goodbird feedback (v${__APP_VERSION__})`);
    data.set("app_version", __APP_VERSION__);
    data.set("user_agent", navigator.userAgent);
    data.set("page", window.location.pathname);
    const trail = getRouteHistory();
    data.set("recent_routes", trail.length ? trail.slice(-6).join(" → ") : "(none)");
    data.set("viewport", `${window.innerWidth}×${window.innerHeight}`);
    data.set("online", String(navigator.onLine));
    // Snapshot of the user's local state — useful for "0 XP fresh user" vs
    // "user with progress" context. No PII.
    try {
      const s = useGame.getState();
      data.set(
        "state",
        JSON.stringify({
          xp: s.xp,
          streak: s.streak.days,
          completed: Object.keys(s.completedLessons).length,
          species_seen: Object.keys(s.speciesStats).length,
          favorites: Object.keys(s.favorites).length,
          freeplay: s.freeplay,
          daily_goal: s.dailyGoal,
          xp_today: s.xpToday,
          onboarded: s.hasOnboarded,
        }),
      );
    } catch { /* ignore */ }
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setState({ kind: "ok" });
      } else {
        const body = await res.json().catch(() => ({}));
        setState({ kind: "error", message: body?.error || "Couldn't send. Try again?" });
      }
    } catch {
      setState({ kind: "error", message: "Couldn't send. Check your connection?" });
    }
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
            className="fixed inset-0 z-[60] bg-(--color-ink)/45 backdrop-blur-[2px]"
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-label="Send feedback"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 z-[61] mx-auto max-h-[88dvh] max-w-md overflow-y-auto overscroll-contain rounded-t-3xl bg-(--color-surface) px-6 pb-8 pt-6 shadow-(--shadow-pop)"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-(--color-ink-soft)">
                  Field report
                </p>
                <h2 className="mt-1 font-display text-3xl">Send feedback</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-(--color-ink-soft) hover:bg-(--color-line) cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {!FORMSPREE_FORM_ID ? (
              <p className="mt-6 rounded-2xl border-2 border-(--color-line) bg-(--color-bg) px-4 py-3 text-sm leading-snug text-(--color-ink-soft)">
                Feedback isn't set up yet. The maintainer needs to paste a
                Formspree form ID into{" "}
                <code className="font-mono text-xs text-(--color-ink)">
                  src/components/FeedbackDialog.tsx
                </code>
                .
              </p>
            ) : state.kind === "ok" ? (
              <div role="status" aria-live="polite" className="mt-6 space-y-3 text-center">
                <p className="font-display text-xl text-(--color-moss-700)">Got it. Thanks.</p>
                <p className="text-sm text-(--color-ink-soft)">
                  Your note went through. The maintainer reads them all.
                </p>
                <button
                  onClick={onClose}
                  className="tap-target mt-3 w-full rounded-full bg-(--color-moss-500) px-6 py-3 font-semibold text-white shadow-(--shadow-pop) hover:bg-(--color-moss-600) cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-3">
                <p className="text-sm leading-snug text-(--color-ink-soft)">
                  What broke, what's confusing, what could be better. Your
                  recent pages, app version, and device are auto-attached so
                  you don't have to describe them.
                </p>
                <label className="block">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-(--color-ink-soft)">
                    Email (optional)
                  </span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="so we can reply"
                    className="mt-1 w-full rounded-2xl border-2 border-(--color-line) bg-(--color-surface) px-4 py-2.5 text-sm focus:border-(--color-moss-500) focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-(--color-ink-soft)">
                    Message
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Type away."
                    className="mt-1 w-full rounded-2xl border-2 border-(--color-line) bg-(--color-surface) px-4 py-2.5 text-sm focus:border-(--color-moss-500) focus:outline-none"
                  />
                </label>
                {state.kind === "error" && (
                  <p role="alert" className="text-sm text-(--color-wrong)">{state.message}</p>
                )}
                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="tap-target rounded-full border-2 border-(--color-line) px-5 py-3 font-semibold text-(--color-ink-soft) hover:border-(--color-ink-soft) cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={state.kind === "submitting"}
                    className={cn(
                      "tap-target rounded-full bg-(--color-moss-500) px-6 py-3 font-semibold text-white shadow-(--shadow-pop) transition hover:bg-(--color-moss-600) cursor-pointer",
                      state.kind === "submitting" && "opacity-70 cursor-default",
                    )}
                  >
                    {state.kind === "submitting" ? "Sending…" : "Send"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
