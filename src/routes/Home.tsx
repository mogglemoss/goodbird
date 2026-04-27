import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { units, getLessonsForUnit, getSpecies, allLessons } from "@/lib/manifest";
import type { Species, Unit } from "@/lib/types";
import { useGame } from "@/game/store";
import { ACCENTS } from "@/lib/theme";
import { cn } from "@/lib/cn";
import { SettingsSheet } from "@/components/SettingsSheet";
import { OnboardingCard } from "@/components/OnboardingCard";
import { Hero } from "@/components/Hero";
import { StickyTopBar } from "@/components/StickyTopBar";
import { HabitatGlyph } from "@/components/brand/HabitatGlyph";
import { CompletionSeal } from "@/components/brand/CompletionSeal";
import { BirdOfTheDay } from "@/components/BirdOfTheDay";
import { InstallHint } from "@/components/InstallHint";
import { DailyReviewCard } from "@/components/DailyReviewCard";
import { SpeciesSearch, useSearchHotkey } from "@/components/SpeciesSearch";
import { FieldMasterBanner } from "@/components/FieldMasterBanner";

export function HomeRoute() {
  const xp = useGame((s) => s.xp);
  const streak = useGame((s) => s.streak);
  const completed = useGame((s) => s.completedLessons);
  const favorites = useGame((s) => s.favorites);
  const dailyGoal = useGame((s) => s.dailyGoal);
  const xpToday = useGame((s) => s.xpToday);
  const xpTodayDay = useGame((s) => s.xpTodayDay);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useSearchHotkey(setSearchOpen);

  const todayXp = useMemo(() => {
    const t = (() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; })();
    return xpTodayDay === t ? xpToday : 0;
  }, [xpToday, xpTodayDay]);

  const favoriteSpecies = useMemo<Species[]>(() => {
    const ids = Object.keys(favorites);
    return ids.map((id) => { try { return getSpecies(id); } catch { return null; } }).filter((s): s is Species => !!s);
  }, [favorites]);

  // True once every lesson in every unit has been completed at least once.
  // Drives the FieldMasterBanner + variant copy on Results.
  const allUnitsComplete = useMemo(() => {
    if (units.length === 0) return false;
    return units.every((u) =>
      getLessonsForUnit(u.id).every((l) => completed[l.id]),
    );
  }, [completed]);

  const continueTarget = (() => {
    let bestAt = 0;
    let target: { unitSlug: string; unitTitle: string; accent: Unit["accent"] } | null = null;
    for (const [lessonId, info] of Object.entries(completed)) {
      if (!info.lastPlayedAt || info.lastPlayedAt <= bestAt) continue;
      const lesson = allLessons.find((l) => l.id === lessonId);
      if (!lesson) continue;
      const unit = units.find((u) => u.id === lesson.unitId);
      if (!unit) continue;
      bestAt = info.lastPlayedAt;
      target = { unitSlug: unit.id, unitTitle: unit.title, accent: unit.accent };
    }
    return target;
  })();

  const headerControls = (
    <HeaderControls
      xp={xp}
      streakDays={streak.days}
      xpToday={todayXp}
      dailyGoal={dailyGoal}
      onSearch={() => setSearchOpen(true)}
      onSettings={() => setSettingsOpen(true)}
    />
  );

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-24 sm:max-w-2xl lg:max-w-4xl">
      <StickyTopBar controls={headerControls} />
      <Hero />
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <SpeciesSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      <OnboardingCard />

      <InstallHint />

      <BirdOfTheDay />

      <DailyReviewCard />

      {allUnitsComplete && <FieldMasterBanner />}

      {continueTarget && (
        <ContinueChip target={continueTarget} />
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {units.map((unit, i) => (
          <HabitatCard key={unit.id} unit={unit} index={i} completed={completed} />
        ))}
      </div>

      {favoriteSpecies.length > 0 && (
        <section className="mt-12">
          <div className="flex items-baseline justify-between">
            <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-(--color-ink-soft)">
              Favorites
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-(--color-ink-soft)">
              {favoriteSpecies.length} {favoriteSpecies.length === 1 ? "bird" : "birds"}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {favoriteSpecies.map((sp) => (
              <Link
                key={sp.id}
                to={`/species/${sp.id}`}
                className="group flex flex-col items-center gap-1.5 rounded-(--radius-card) border-2 border-(--color-line) bg-(--color-surface) p-2 shadow-(--shadow-soft) transition-colors hover:border-(--color-moss-300)"
              >
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-(--color-sand-50)">
                  {sp.imageUrl ? (
                    <img
                      src={sp.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      style={{ objectPosition: sp.imagePosition ?? "top" }}
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-2xl">🪶</div>
                  )}
                </div>
                <div className="line-clamp-2 w-full text-center text-xs font-medium leading-tight">
                  {sp.commonName}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function HeaderControls({
  xp,
  streakDays,
  xpToday,
  dailyGoal,
  onSearch,
  onSettings,
}: {
  xp: number;
  streakDays: number;
  xpToday: number;
  dailyGoal: number;
  onSearch: () => void;
  onSettings: () => void;
}) {
  const goalReached = xpToday >= dailyGoal;
  return (
    <div className="flex items-center gap-1.5">
      <DailyGoalRing xpToday={xpToday} dailyGoal={dailyGoal} />
      <Pill icon="🔥" value={streakDays} label="day streak" muted={streakDays === 0 && !goalReached} />
      <Pill icon="✦" value={xp} label="xp" muted={xp === 0} />
      <button
        onClick={onSearch}
        aria-label="Search species"
        title="Search (⌘K)"
        className="ml-0.5 grid h-9 w-9 place-items-center rounded-full border-2 border-(--color-line) bg-(--color-surface) text-(--color-ink-soft) hover:border-(--color-moss-300) cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <line x1="20" y1="20" x2="16.5" y2="16.5" />
        </svg>
      </button>
      <button
        onClick={onSettings}
        aria-label="Settings"
        className="grid h-9 w-9 place-items-center rounded-full border-2 border-(--color-line) bg-(--color-surface) text-(--color-ink-soft) hover:border-(--color-moss-300) cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>
    </div>
  );
}

function DailyGoalRing({ xpToday, dailyGoal }: { xpToday: number; dailyGoal: number }) {
  const pct = Math.min(1, xpToday / dailyGoal);
  const r = 14;
  const circ = 2 * Math.PI * r;
  const reached = xpToday >= dailyGoal;
  return (
    <div
      className="relative grid h-9 w-9 place-items-center"
      title={`Today: ${Math.min(xpToday, dailyGoal)}/${dailyGoal} XP`}
    >
      <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--color-line)" strokeWidth="3" />
        <circle
          cx="18" cy="18" r={r} fill="none"
          stroke={reached ? "var(--color-moss-500)" : "var(--color-moss-300)"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <span className="text-xs">{reached ? "✓" : "🎯"}</span>
    </div>
  );
}

function Pill({ icon, value, label, muted }: { icon: string; value: number; label: string; muted?: boolean }) {
  return (
    <div
      title={label}
      className={cn(
        "flex items-center gap-1 rounded-full border-2 border-(--color-line) bg-(--color-surface) px-3 py-1 text-sm font-semibold",
        muted && "opacity-60",
      )}
    >
      <span aria-hidden>{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function ContinueChip({ target }: { target: { unitSlug: string; unitTitle: string; accent: Unit["accent"] } }) {
  const accent = ACCENTS[target.accent];
  return (
    <Link
      to={`/unit/${target.unitSlug}`}
      className={cn(
        "mt-6 flex items-center justify-between gap-3 rounded-(--radius-card) border-2 px-5 py-3 shadow-(--shadow-soft) transition-colors",
        accent.unlockedBorder,
        accent.doneBg,
        accent.unlockedHover,
      )}
    >
      <div className="min-w-0">
        <div className={cn("font-mono text-[10px] font-medium uppercase tracking-[0.2em]", accent.label)}>
          Continue
        </div>
        <div className="truncate font-display text-base">{target.unitTitle}</div>
      </div>
      <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full text-white", accent.doneBadgeBg)}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>
    </Link>
  );
}

interface HabitatCardProps {
  unit: Unit;
  index: number;
  completed: Record<string, { bestAccuracy: number }>;
}

function HabitatCard({ unit, index, completed }: HabitatCardProps) {
  const lessons = getLessonsForUnit(unit.id);
  const speciesCount = new Set(lessons.flatMap((l) => l.speciesIds)).size;
  const lessonsDone = lessons.filter((l) => completed[l.id]).length;
  const totalLessons = lessons.length;
  const progress = totalLessons === 0 ? 0 : lessonsDone / totalLessons;
  const isComplete = totalLessons > 0 && lessonsDone === totalLessons;
  const accent = ACCENTS[unit.accent];

  const sampleSpecies = Array.from(new Set(lessons.flatMap((l) => l.speciesIds)))
    .slice(0, 3)
    .map((id) => getSpecies(id));

  const num = String(index + 1).padStart(2, "0");

  return (
    <Link to={`/unit/${unit.id}`} className="block">
      <motion.article
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-(--radius-card) border-2 p-4 shadow-(--shadow-soft) transition-colors",
          accent.unlockedBorder,
          accent.doneBg, // subtle accent wash on every card
          accent.unlockedHover,
        )}
      >
        {/* Top row: number + glyph */}
        <header className="flex items-start justify-between">
          <div className={cn("font-display text-2xl leading-none tabular-nums sm:text-3xl", accent.label)}>
            {num}
          </div>
          <div className="flex items-center gap-1.5">
            {isComplete && <CompletionSeal bgClass={accent.doneBadgeBg} />}
            <div className={accent.label}>
              <HabitatGlyph accent={unit.accent} />
            </div>
          </div>
        </header>

        {/* Region label */}
        <p className={cn("mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em]", accent.label)}>
          {unit.habitat}
        </p>

        {/* Title */}
        <h2 className="mt-1 font-display text-lg leading-tight sm:text-xl">{unit.title}</h2>

        {/* Italic narrative */}
        {unit.tagline && (
          <p className="mt-1.5 font-display text-xs italic leading-snug text-(--color-ink-soft) sm:text-sm">
            {unit.tagline}
          </p>
        )}

        {/* Spacer to push thumbs to bottom */}
        <div className="flex-1" />

        {/* Bottom row: thumbnails + bird count */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex -space-x-1.5">
            {sampleSpecies.map((s) => (
              <div
                key={s.id}
                className="h-7 w-7 overflow-hidden rounded-full border-2 border-(--color-surface) bg-(--color-sand-50)"
                title={s.commonName}
              >
                {s.imageUrl ? (
                  <img
                    src={s.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ objectPosition: s.imagePosition ?? "top" }}
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-sm">🪶</div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-baseline gap-1 font-mono text-[10px] text-(--color-ink-soft)">
            <span className="font-display text-base font-medium text-(--color-ink) tabular-nums">{speciesCount}</span>
            <span className="hidden sm:inline">birds</span>
          </div>
        </div>

        {/* Progress bar — only when there's progress */}
        {lessonsDone > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-(--color-line)">
              <motion.div
                className={cn("h-full rounded-full", accent.doneBadgeBg)}
                initial={false}
                animate={{ width: `${Math.max(progress * 100, 8)}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              />
            </div>
            <span className="font-mono text-[10px] tabular-nums text-(--color-ink-soft)">
              {lessonsDone}/{totalLessons}
            </span>
          </div>
        )}
      </motion.article>
    </Link>
  );
}
