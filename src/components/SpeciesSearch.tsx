import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { allSpeciesWithRecordings } from "@/lib/manifest";
import { cn } from "@/lib/cn";

/**
 * Type-anywhere species finder. Opens with Cmd/Ctrl-K or by tapping the
 * search button in the sticky bar. Filters across common name, scientific
 * name, mnemonic, and field note. Tap a result → /species/:id.
 */

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SpeciesSearch({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      // Tiny delay so the sheet has mounted before focusing.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const all = allSpeciesWithRecordings();
    if (!q.trim()) return all.slice(0, 30);
    const needle = q.toLowerCase().trim();
    const scored = all
      .map((s) => {
        const name = s.commonName.toLowerCase();
        const sci = s.scientificName.toLowerCase();
        const mn = (s.mnemonic ?? "").toLowerCase();
        const field = (s.field ?? "").toLowerCase();
        let score = 0;
        if (name.startsWith(needle)) score += 100;
        else if (name.includes(needle)) score += 60;
        if (sci.includes(needle)) score += 30;
        if (mn.includes(needle)) score += 15;
        if (field.includes(needle)) score += 8;
        return { s, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 40).map((x) => x.s);
  }, [q]);

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
            className="fixed inset-0 z-[55] bg-(--color-ink)/45 backdrop-blur-[2px]"
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-label="Find a species"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-4 z-[56] mx-auto max-w-md overflow-hidden rounded-3xl border-2 border-(--color-line) bg-(--color-surface) shadow-(--shadow-pop) sm:max-w-lg"
          >
            <div className="flex items-center gap-2 border-b border-(--color-line) px-4 py-3">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-(--color-ink-soft)" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <line x1="20" y1="20" x2="16.5" y2="16.5" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search species…"
                className="flex-1 bg-transparent text-base outline-none placeholder:text-(--color-ink-soft)"
                aria-label="Search species"
              />
              <button
                onClick={onClose}
                aria-label="Close search"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-(--color-ink-soft) hover:bg-(--color-line) cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <ul className="max-h-[60dvh] overflow-y-auto overscroll-contain p-2">
              {results.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-(--color-ink-soft)">
                  No matches.
                </li>
              ) : (
                results.map((sp) => (
                  <li key={sp.id}>
                    <Link
                      to={`/species/${sp.id}`}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-(--color-bg)",
                      )}
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-(--color-sand-50)">
                        {sp.imageUrl ? (
                          <img
                            src={sp.imageUrl}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                            style={{ objectPosition: sp.imagePosition ?? "top" }}
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-lg">🪶</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{sp.commonName}</div>
                        <div className="truncate text-xs italic text-(--color-ink-soft)">
                          {sp.scientificName}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Hook: open the search modal on ⌘K / Ctrl-K. */
export function useSearchHotkey(setOpen: (v: boolean) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);
}
