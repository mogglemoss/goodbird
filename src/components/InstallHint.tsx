import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/game/store";

/**
 * Add-to-Home-Screen hint, dismissible.
 *
 * Two paths because the platforms diverge:
 * - Android Chrome / Edge / Brave: catch the `beforeinstallprompt` event,
 *   prevent the default mini-bar, and surface a button that calls
 *   prompt() ourselves (cleaner than the browser's prompt).
 * - iOS Safari: no install API. Show a static "tap Share → Add to Home
 *   Screen" instruction with the iOS share-icon glyph.
 *
 * Hides itself when the app is already running standalone or the user
 * has dismissed the hint.
 */

// Caught at module load so an event arriving before the component mounts isn't lost.
let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    for (const fn of listeners) fn();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    for (const fn of listeners) fn();
  });
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
  // iOS legacy
  if ((navigator as { standalone?: boolean }).standalone === true) return true;
  return false;
}

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua);
  const isWebKit = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isIos && isWebKit;
}

export function InstallHint() {
  const dismissed = useGame((s) => s.dismissedInstallHint);
  const dismiss = useGame((s) => s.dismissInstallHint);
  const [, force] = useState(0);

  useEffect(() => {
    const fn = () => force((n) => n + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  if (dismissed) return null;
  if (isStandalone()) return null;

  // Android-Chrome path — install prompt available
  if (deferredPrompt) {
    const onInstall = async () => {
      const e = deferredPrompt;
      if (!e) return;
      deferredPrompt = null;
      for (const fn of listeners) fn();
      await e.prompt();
      const { outcome } = await e.userChoice;
      if (outcome === "accepted" || outcome === "dismissed") dismiss();
    };
    return (
      <Card onDismiss={dismiss}>
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-(--color-moss-700)">
            Install
          </p>
          <p className="mt-1 font-display text-base leading-tight">
            Add goodbird to your home screen
          </p>
          <p className="mt-0.5 text-xs text-(--color-ink-soft)">
            Faster to launch · works offline
          </p>
        </div>
        <button
          onClick={onInstall}
          className="shrink-0 rounded-full bg-(--color-moss-500) px-4 py-2 text-sm font-semibold text-white shadow-(--shadow-soft) hover:bg-(--color-moss-600) cursor-pointer"
        >
          Install
        </button>
      </Card>
    );
  }

  // iOS Safari path — manual instructions
  if (isIosSafari()) {
    return (
      <Card onDismiss={dismiss}>
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-(--color-moss-700)">
            Add to home screen
          </p>
          <p className="mt-1 font-display text-base leading-tight">
            Get goodbird as a real app
          </p>
          <p className="mt-1 text-xs leading-snug text-(--color-ink-soft)">
            Tap{" "}
            <ShareGlyph />{" "}
            in Safari, then{" "}
            <strong className="text-(--color-ink)">Add to Home Screen</strong>.
          </p>
        </div>
      </Card>
    );
  }

  return null;
}

function Card({ onDismiss, children }: { onDismiss: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto mt-6 flex max-w-md items-start gap-3 rounded-(--radius-card) border-2 border-(--color-moss-300) bg-(--color-moss-50) px-4 py-3 shadow-(--shadow-soft)"
    >
      {children}
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-(--color-ink-soft) hover:bg-(--color-surface)/60 cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </motion.div>
  );
}

/** iOS Safari "Share" icon — square with up-arrow inside. */
function ShareGlyph() {
  return (
    <span className="inline-flex translate-y-[3px] align-baseline">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 8H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="14" />
      </svg>
    </span>
  );
}
