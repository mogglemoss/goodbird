import type { UnitAccent } from "./types";

interface AccentTheme {
  label: string;          // ALL CAPS habitat label color
  badgeBg: string;        // unlocked badge background
  badgeText: string;      // unlocked badge icon color
  doneBg: string;         // completed lesson tint
  doneBorder: string;
  doneBadgeBg: string;    // filled "done" badge background
  unlockedBorder: string;
  unlockedHover: string;
}

export const ACCENTS: Record<UnitAccent, AccentTheme> = {
  moss: {
    label: "text-(--color-moss-700)",
    badgeBg: "bg-(--color-moss-100)",
    badgeText: "text-(--color-moss-700)",
    doneBg: "bg-(--color-moss-50)",
    doneBorder: "border-(--color-moss-500)",
    doneBadgeBg: "bg-(--color-moss-500)",
    unlockedBorder: "border-(--color-moss-300)",
    unlockedHover: "hover:border-(--color-moss-500)",
  },
  amber: {
    label: "text-amber-800",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    doneBg: "bg-amber-50",
    doneBorder: "border-amber-500",
    doneBadgeBg: "bg-amber-500",
    unlockedBorder: "border-amber-300",
    unlockedHover: "hover:border-amber-500",
  },
  sky: {
    label: "text-sky-800",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-800",
    doneBg: "bg-sky-50",
    doneBorder: "border-sky-500",
    doneBadgeBg: "bg-sky-500",
    unlockedBorder: "border-sky-300",
    unlockedHover: "hover:border-sky-500",
  },
  indigo: {
    label: "text-indigo-800",
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-800",
    doneBg: "bg-indigo-50",
    doneBorder: "border-indigo-500",
    doneBadgeBg: "bg-indigo-500",
    unlockedBorder: "border-indigo-300",
    unlockedHover: "hover:border-indigo-500",
  },
  rose: {
    label: "text-rose-800",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-800",
    doneBg: "bg-rose-50",
    doneBorder: "border-rose-500",
    doneBadgeBg: "bg-rose-500",
    unlockedBorder: "border-rose-300",
    unlockedHover: "hover:border-rose-500",
  },
  sand: {
    label: "text-stone-700",
    badgeBg: "bg-stone-200",
    badgeText: "text-stone-700",
    doneBg: "bg-stone-100",
    doneBorder: "border-stone-500",
    doneBadgeBg: "bg-stone-500",
    unlockedBorder: "border-stone-300",
    unlockedHover: "hover:border-stone-500",
  },
};
