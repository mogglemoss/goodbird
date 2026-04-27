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
  emerald: {
    label: "text-emerald-800",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    doneBg: "bg-emerald-50",
    doneBorder: "border-emerald-500",
    doneBadgeBg: "bg-emerald-500",
    unlockedBorder: "border-emerald-300",
    unlockedHover: "hover:border-emerald-500",
  },
  violet: {
    label: "text-violet-800",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-800",
    doneBg: "bg-violet-50",
    doneBorder: "border-violet-500",
    doneBadgeBg: "bg-violet-500",
    unlockedBorder: "border-violet-300",
    unlockedHover: "hover:border-violet-500",
  },
  slate: {
    label: "text-slate-700",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    doneBg: "bg-slate-50",
    doneBorder: "border-slate-500",
    doneBadgeBg: "bg-slate-500",
    unlockedBorder: "border-slate-300",
    unlockedHover: "hover:border-slate-500",
  },
  teal: {
    label: "text-teal-800",
    badgeBg: "bg-teal-100",
    badgeText: "text-teal-800",
    doneBg: "bg-teal-50",
    doneBorder: "border-teal-500",
    doneBadgeBg: "bg-teal-500",
    unlockedBorder: "border-teal-300",
    unlockedHover: "hover:border-teal-500",
  },
  orange: {
    label: "text-orange-800",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-800",
    doneBg: "bg-orange-50",
    doneBorder: "border-orange-500",
    doneBadgeBg: "bg-orange-500",
    unlockedBorder: "border-orange-300",
    unlockedHover: "hover:border-orange-500",
  },
  fuchsia: {
    label: "text-fuchsia-800",
    badgeBg: "bg-fuchsia-100",
    badgeText: "text-fuchsia-800",
    doneBg: "bg-fuchsia-50",
    doneBorder: "border-fuchsia-500",
    doneBadgeBg: "bg-fuchsia-500",
    unlockedBorder: "border-fuchsia-300",
    unlockedHover: "hover:border-fuchsia-500",
  },
};
