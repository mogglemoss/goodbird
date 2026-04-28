import { useEffect } from "react";

/**
 * Open the species search modal on ⌘K / Ctrl-K.
 * Lives in lib/ (not in SpeciesSearch.tsx) so the component file only exports
 * components — Vite Fast Refresh won't bail when SpeciesSearch.tsx changes.
 */
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
