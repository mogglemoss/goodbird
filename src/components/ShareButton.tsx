import { useEffect, useState } from "react";
import { tryShare, type ShareData } from "@/lib/share";
import { cn } from "@/lib/cn";

interface Props {
  data: ShareData;
  /** "pill" = full-width text button (Results CTA). "icon" = round icon (page headers). */
  variant?: "pill" | "icon";
  className?: string;
  label?: string;
}

export function ShareButton({ data, variant = "pill", className, label = "Share with a friend" }: Props) {
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 2000);
    return () => clearTimeout(t);
  }, [feedback]);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const r = await tryShare(data);
    if (r === "copied") setFeedback("Link copied");
    else if (r === "failed") setFeedback("Couldn't share");
  };

  if (variant === "icon") {
    return (
      <div className={cn("relative", className)}>
        <button
          onClick={onClick}
          aria-label="Share"
          className="grid h-10 w-10 place-items-center rounded-full text-(--color-ink-soft) hover:bg-(--color-line) cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>
        {feedback && <Toast text={feedback} placement="left" />}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "tap-target relative w-full rounded-full border-2 border-(--color-line) bg-(--color-surface) px-6 py-3 text-center font-semibold text-(--color-ink) transition-colors hover:border-(--color-moss-300)",
        className,
      )}
    >
      <span className="inline-flex items-center justify-center gap-2">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        {feedback ?? label}
      </span>
    </button>
  );
}

function Toast({ text, placement }: { text: string; placement: "left" | "above" }) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none absolute z-10 whitespace-nowrap rounded-full bg-(--color-ink) px-3 py-1 text-xs font-medium text-white shadow-(--shadow-pop)",
        placement === "left" && "right-full top-1/2 mr-2 -translate-y-1/2",
        placement === "above" && "bottom-full left-1/2 mb-2 -translate-x-1/2",
      )}
    >
      {text}
    </span>
  );
}
