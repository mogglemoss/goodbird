import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExerciseRunner } from "@/components/ExerciseRunner";
import { HeartsBar } from "@/components/HeartsBar";
import { useGame } from "@/game/store";
import { STARTING_HEARTS } from "@/game/scoring";

export function LessonRoute() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const active = useGame((s) => s.active);
  const startLesson = useGame((s) => s.startLesson);
  const answer = useGame((s) => s.answer);
  const next = useGame((s) => s.nextExercise);
  const abandon = useGame((s) => s.abandonLesson);

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

  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-2xl flex-col bg-(--color-bg)">
      <HeartsBar
        hearts={active.hearts}
        max={STARTING_HEARTS}
        progress={progress}
        onExit={() => { abandon(); nav("/"); }}
      />
      <div className="flex-1 min-h-0">
        <ExerciseRunner
          exercise={ex}
          exerciseIndex={active.index}
          onAnswered={(correct, speciesId) => answer(correct, speciesId)}
          onContinue={next}
        />
      </div>
    </div>
  );
}
