"use client";

import type { FlashcardQuestion, QuestionAttemptState } from "@/domain/entities/question";

export function FlashcardQuestionView({ question, attempt, disabled, onReveal, onKnown, onReview }: {
  question: FlashcardQuestion;
  attempt: QuestionAttemptState;
  disabled: boolean;
  onReveal: () => void;
  onKnown: () => void;
  onReview: () => void;
}) {
  return (
    <section className="grid gap-5" aria-labelledby="flashcard-prompt">
      <h2 id="flashcard-prompt" className="text-2xl font-semibold leading-tight">{question.prompt}</h2>
      <button
        type="button"
        disabled={disabled || attempt.status === "completed"}
        onClick={onReveal}
        className="min-h-48 rounded-lg border border-line bg-ink p-5 text-center text-xl leading-8 transition hover:border-good active:border-good disabled:cursor-not-allowed disabled:opacity-80 sm:p-6"
      >
        {attempt.flashcardRevealed || attempt.status === "completed" ? question.back : question.front}
      </button>
      {attempt.flashcardRevealed && attempt.status !== "completed" ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button type="button" disabled={disabled} onClick={onKnown} className="min-h-12 rounded-lg border border-good bg-good/10 px-4 py-3 font-medium">I knew it</button>
          <button type="button" disabled={disabled} onClick={onReview} className="min-h-12 rounded-lg border border-warn bg-warn/10 px-4 py-3 font-medium">Review again</button>
        </div>
      ) : null}
      <p role="status" className="text-sm text-slate-300">{attempt.errorCount > 0 ? "Marked for review." : " "}</p>
    </section>
  );
}
