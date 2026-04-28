import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { evictHowl, getHowl, stopAll } from "@/lib/audio";
import { cn } from "@/lib/cn";

const MAX_RETRIES = 1;

/**
 * Compact icon button that plays/pauses a single audio URL with proper
 * state — the icon swaps between play/pause, and tapping while playing stops it.
 *
 * Used wherever an AudioPlayer would be too big (Results "Listen again" rows,
 * the FeedbackBar after answering, etc.).
 */
interface Props {
  url: string;
  /** Color tone — "moss" for correct/positive, "wrong" for missed answers. */
  tone?: "moss" | "wrong";
  /** Visual size. */
  size?: "sm" | "md";
  ariaLabel?: string;
  /** Per-clip volume (0..1) from scripts/normalize-audio.mjs. Default 1. */
  gain?: number;
}

const TONES = {
  moss: "bg-(--color-moss-500) hover:bg-(--color-moss-600)",
  wrong: "bg-(--color-wrong) hover:brightness-110",
};

const SIZES = {
  sm: { wrap: "h-10 w-10", icon: "h-4 w-4" },
  md: { wrap: "h-11 w-11", icon: "h-5 w-5" },
};

export function PlaySoundButton({ url, tone = "moss", size = "md", ariaLabel, gain = 1 }: Props) {
  const [playing, setPlaying] = useState(false);
  // Same retry pattern as AudioPlayer: bump tries on error to re-enter the
  // effect with a fresh (cache-evicted) Howl. Two strikes = surfaced failure.
  const [tries, setTries] = useState(0);
  const [failed, setFailed] = useState(false);
  // Reset retry/failed state when the URL prop changes. React's official
  // pattern from "You Might Not Need an Effect" — adjust state during
  // render via a tracked-previous-prop state value.
  const [prevUrl, setPrevUrl] = useState(url);
  if (prevUrl !== url) {
    setPrevUrl(url);
    setTries(0);
    setFailed(false);
  }
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    const h = getHowl(url, gain);
    howlRef.current = h;
    const onPlay = () => setPlaying(true);
    const onStop = () => setPlaying(false);
    const onError = () => {
      setPlaying(false);
      if (tries < MAX_RETRIES) setTries((t) => t + 1);
      else setFailed(true);
    };
    h.on("play", onPlay);
    h.on("pause", onStop);
    h.on("stop", onStop);
    h.on("end", onStop);
    h.on("playerror", onError);
    h.on("loaderror", onError);
    return () => {
      h.off("play", onPlay);
      h.off("pause", onStop);
      h.off("stop", onStop);
      h.off("end", onStop);
      h.off("playerror", onError);
      h.off("loaderror", onError);
    };
  }, [url, gain, tries]);

  const toggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (failed) {
      // User-initiated retry: force a fresh Howl + network attempt.
      evictHowl(url);
      setFailed(false);
      setTries((t) => t + 1);
      return;
    }
    const h = howlRef.current;
    if (!h) return;
    if (h.playing()) {
      h.stop();
    } else {
      stopAll(); // ensure only one clip plays at a time
      h.seek(0);
      h.play();
    }
  };

  const dim = SIZES[size];

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ariaLabel ?? (failed ? "Playback failed — tap to retry" : playing ? "Stop" : "Play")}
      aria-pressed={playing}
      title={failed ? "Playback failed — tap to retry" : undefined}
      className={cn(
        "grid shrink-0 place-items-center rounded-full text-white shadow-(--shadow-soft) transition-transform active:scale-95 cursor-pointer",
        failed ? "bg-(--color-ink-soft) hover:bg-(--color-ink)" : TONES[tone],
        dim.wrap,
      )}
    >
      {failed ? (
        <svg viewBox="0 0 24 24" className={dim.icon} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <polyline points="3 4 3 10 9 10" />
        </svg>
      ) : playing ? (
        <svg viewBox="0 0 24 24" className={dim.icon} fill="currentColor" aria-hidden>
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className={dim.icon} fill="currentColor" aria-hidden>
          <path d="M8 5.5v13a.5.5 0 0 0 .76.43l11-6.5a.5.5 0 0 0 0-.86l-11-6.5A.5.5 0 0 0 8 5.5z" />
        </svg>
      )}
    </button>
  );
}
