import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExerciseRunner } from "@/components/ExerciseRunner";
import { HeartsBar } from "@/components/HeartsBar";
import { useGame } from "@/game/store";
import { STARTING_HEARTS } from "@/game/scoring";
import { getUnitForLesson } from "@/lib/manifest";
import { ACCENTS } from "@/lib/theme";

export function LessonRoute() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const active = useGame((s) => s.active);
  const startLesson = useGame((s) => s.startLesson);
  const answer = useGame((s) => s.answer);
  const next = useGame((s) => s.nextExercise);
  const abandon = useGame((s) => s.abandonLesson);
  const freeplay = useGame((s) => s.freeplay);

  // Start lesson if not already in this one
  useEffect(() => {
    if (!active || active.lessonId !== id) {
      startLesson(id);
    }
  }, [id, active, startLesson]);

  // When lesson ends, push to results
  useEffect(() => {
    if (active && active.outcome !== "in-progress") {
      nav(`/results/${id}`, { replace: true });
    }
  }, [active, id, nav]);

  if (!active) return null;
  const ex = active.exercises[active.index];
  if (!ex) return null;

  const progress = active.index / active.exercises.length;
  const unit = getUnitForLesson(id);
  const accent = unit ? ACCENTS[unit.accent] : null;

  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-2xl flex-col bg-(--color-bg)">
      <HeartsBar
        hearts={active.hearts}
        max={STARTING_HEARTS}
        progress={progress}
        freeplay={freeplay}
        progressFillClass={accent?.doneBadgeBg}
        onExit={() => { abandon(); nav("/"); }}
      />
      <div className="flex-1 min-h-0">
        <ExerciseRunner
          exercise={ex}
          exerciseIndex={active.index}
          previouslyAnswered={active.results[active.index] ?? null}
          accent={unit?.accent ?? null}
          onAnswered={(correct, speciesId) => answer(correct, speciesId)}
          onContinue={next}
        />
      </div>
    </div>
  );
}
