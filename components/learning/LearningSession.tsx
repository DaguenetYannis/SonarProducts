"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LearningQuestion, LevelResult, LevelSessionSnapshot } from "@/domain/entities/question";
import { LevelSessionService } from "@/domain/services/LevelSessionService";
import { DeterministicQuestionOrderingService } from "@/domain/services/QuestionOrderingService";
import { transitionConfig } from "@/lib/transitionConfig";
import { ProgressHeader } from "@/components/learning/ProgressHeader";
import { ResultScreen } from "@/components/learning/ResultScreen";
import { QuizQuestionView } from "@/components/questions/QuizQuestionView";
import { FlashcardQuestionView } from "@/components/questions/FlashcardQuestionView";
import { MindMapQuestionView } from "@/components/questions/MindMapQuestionView";

export function LearningSession({ levelId, title, topics, questions }: { levelId: string; title: string; topics: string[]; questions: LearningQuestion[] }) {
  const [retrySeed, setRetrySeed] = useState(1);
  const service = useMemo(() => new LevelSessionService({
    levelAttemptId: `local-${retrySeed}`,
    levelId,
    title,
    topics,
    questions,
    previousOrders: []
  }, new DeterministicQuestionOrderingService(retrySeed)), [levelId, questions, retrySeed, title, topics]);
  const [snapshot, setSnapshot] = useState<LevelSessionSnapshot>(service.getSnapshot());
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => clearPendingTimer(timerRef), []);

  const question = service.currentQuestion();
  const attempt = question ? snapshot.attempts[question.id] : null;

  function sync(next: LevelSessionSnapshot) {
    setSnapshot(next);
  }

  function objectiveAnswer(answerId: string) {
    if (locked) return;
    const beforeQuestion = service.currentQuestion();
    const next = service.answerObjective(answerId);
    sync(next);
    const afterAttempt = beforeQuestion ? next.attempts[beforeQuestion.id] : null;
    if (afterAttempt?.status === "completed") {
      const delay = beforeQuestion?.type === "mind_map" && afterAttempt.eventuallyCorrect
        ? transitionConfig.mindMapCorrectHoldMs
        : afterAttempt.eventuallyCorrect
          ? transitionConfig.standardCorrectFeedbackMs
          : transitionConfig.failedAnswerRevealMs;
      runLockedDelay(delay);
    }
  }

  function runLockedDelay(delay: number) {
    setLocked(true);
    clearPendingTimer(timerRef);
    timerRef.current = globalThis.setTimeout(() => {
      sync(service.next());
      setLocked(false);
    }, delay);
  }

  function goPrevious() {
    clearPendingTimer(timerRef);
    setLocked(false);
    sync(service.previous());
  }

  function retry() {
    clearPendingTimer(timerRef);
    setLocked(false);
    setRetrySeed((seed) => seed + 1);
  }

  const result: LevelResult | null = snapshot.completed ? service.result() : null;

  return (
    <main className="min-h-dvh pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:py-8">
      <div className="mx-auto grid max-w-2xl gap-5 sm:gap-6">
        <ProgressHeader title={title} topics={topics} current={Math.min(snapshot.currentIndex + 1, snapshot.order.length)} total={snapshot.order.length} />
        {result ? <ResultScreen result={result} onRetry={retry} /> : null}
        {!result && question && attempt ? (
          <div className="rounded-lg border border-line bg-panel p-4 sm:p-5">
            {question.type === "quiz" ? <QuizQuestionView question={question} attempt={attempt} disabled={locked} onAnswer={objectiveAnswer} /> : null}
            {question.type === "flashcard" ? (
              <FlashcardQuestionView
                question={question}
                attempt={attempt}
                disabled={locked}
                onReveal={() => sync(service.revealFlashcard())}
                onKnown={() => {
                  sync(service.markFlashcardKnown());
                  runLockedDelay(transitionConfig.standardCorrectFeedbackMs);
                }}
                onReview={() => {
                  const next = service.reviewFlashcardAgain();
                  sync(next);
                  if (next.completed || attempt.errorCount > 0) runLockedDelay(transitionConfig.failedAnswerRevealMs);
                }}
              />
            ) : null}
            {question.type === "mind_map" ? <MindMapQuestionView question={question} attempt={attempt} disabled={locked} onAnswer={objectiveAnswer} /> : null}
          </div>
        ) : null}
        {!result ? (
          <nav className="flex justify-between">
            <button type="button" disabled={snapshot.currentIndex === 0} onClick={goPrevious} className="min-h-12 rounded-lg border border-line bg-ink px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
          </nav>
        ) : null}
      </div>
    </main>
  );
}

function clearPendingTimer(timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>) {
  if (timerRef.current) {
    globalThis.clearTimeout(timerRef.current);
    timerRef.current = null;
  }
}
