import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import { getHowl } from "@/lib/audio";
import { cn } from "@/lib/cn";

interface Props {
  url: string;
  label?: string;
  size?: "lg" | "md";
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
}

export function AudioPlayer({ url, label = "Play call", size = "lg", autoPlay = false, onEnded, className }: Props) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [nudge, setNudge] = useState(false); // pulses the play button if autoplay was blocked
  const howlRef = useRef<Howl | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const h = getHowl(url);
    howlRef.current = h;
    const onPlay = () => { setPlaying(true); setNudge(false); };
    const onStop = () => setPlaying(false);
    const onEnd = () => { setPlaying(false); setProgress(0); onEnded?.(); };
    const onPlayError = () => {
      // iOS Safari blocks autoplay without a user gesture in scope.
      // Pulse the play button so the user knows to tap.
      setPlaying(false);
      setNudge(true);
    };
    h.on("play", onPlay);
    h.on("pause", onStop);
    h.on("stop", onStop);
    h.on("end", onEnd);
    h.on("playerror", onPlayError);
    if (autoPlay && !h.playing()) {
      // h.play() returns a sound id; if the underlying audio.play() rejects,
      // Howler emits "playerror" (handled above).
      h.play();
    }
    return () => {
      h.off("play", onPlay);
      h.off("pause", onStop);
      h.off("stop", onStop);
      h.off("end", onEnd);
      h.off("playerror", onPlayError);
      h.stop();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [url, autoPlay, onEnded]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = () => {
      const h = howlRef.current;
      if (!h) return;
      const dur = h.duration() || 1;
      setProgress(Math.min(1, (h.seek() as number) / dur));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing]);

  const toggle = () => {
    const h = howlRef.current;
    if (!h) return;
    if (h.playing()) {
      h.stop();
    } else {
      h.seek(0);
      h.play();
    }
  };

  const dim = size === "lg" ? "h-28 w-28" : "h-20 w-20";

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        className={cn(
          "relative rounded-full bg-(--color-moss-500) text-white shadow-(--shadow-pop) transition-transform active:scale-95 cursor-pointer",
          "hover:bg-(--color-moss-600) focus:outline-none focus-visible:ring-4 focus-visible:ring-(--color-moss-300)",
          dim,
        )}
      >
        {(playing || nudge) && (
          <span className={cn("absolute inset-0 rounded-full bg-(--color-moss-500) pointer-events-none", nudge ? "opacity-60 pulse-ring" : "opacity-40 pulse-ring")} />
        )}
        <PlayPauseIcon playing={playing} />
        {/* Progress ring */}
        <svg className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
          <circle
            cx="50" cy="50" r="46" fill="none"
            stroke="white" strokeWidth="3"
            strokeDasharray={2 * Math.PI * 46}
            strokeDashoffset={2 * Math.PI * 46 * (1 - progress)}
            strokeLinecap="round"
            style={{ transition: playing ? "none" : "stroke-dashoffset 200ms ease" }}
          />
        </svg>
      </button>
      <Bars active={playing} />
    </div>
  );
}

function PlayPauseIcon({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="absolute inset-0 m-auto h-10 w-10" fill="currentColor">
      {playing ? (
        <>
          <rect x="7" y="6" width="3.5" height="12" rx="1" />
          <rect x="13.5" y="6" width="3.5" height="12" rx="1" />
        </>
      ) : (
        <path d="M8 5.5v13a.5.5 0 0 0 .76.43l11-6.5a.5.5 0 0 0 0-.86l-11-6.5A.5.5 0 0 0 8 5.5z" />
      )}
    </svg>
  );
}

function Bars({ active }: { active: boolean }) {
  const N = 18;
  return (
    <div className="flex h-8 items-end gap-[3px]" aria-hidden>
      {Array.from({ length: N }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-(--color-moss-500)"
          animate={
            active
              ? { height: [`${20 + (i % 5) * 8}%`, `${50 + ((i * 7) % 50)}%`, `${20 + (i % 5) * 8}%`] }
              : { height: "18%" }
          }
          transition={
            active
              ? { duration: 0.6 + (i % 4) * 0.12, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
          style={{ height: "18%" }}
        />
      ))}
    </div>
  );
}
