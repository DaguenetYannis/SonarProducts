import type { QuestionAttemptState } from "@/domain/entities/question";

export class FlashcardTransitionPolicy {
  reveal(attempt: QuestionAttemptState): QuestionAttemptState {
    return { ...attempt, flashcardRevealed: true, status: "active" };
  }

  knewIt(attempt: QuestionAttemptState, now: Date = new Date()): QuestionAttemptState {
    return {
      ...attempt,
      status: "completed",
      eventuallyCorrect: true,
      completedAt: now,
      firstAnsweredAt: attempt.firstAnsweredAt ?? now
    };
  }

  reviewAgain(attempt: QuestionAttemptState, now: Date = new Date()): { attempt: QuestionAttemptState; shouldRequeue: boolean } {
    const nextErrors = attempt.errorCount + 1;
    if (nextErrors === 1) {
      return {
        attempt: {
          ...attempt,
          status: "first_error",
          errorCount: 1,
          flashcardRevealed: false,
          encounters: attempt.encounters + 1,
          firstAnsweredAt: attempt.firstAnsweredAt ?? now
        },
        shouldRequeue: true
      };
    }

    return {
      attempt: {
        ...attempt,
        status: "completed",
        errorCount: nextErrors,
        eventuallyCorrect: false,
        revealedAnswerId: "flashcard-back",
        completedAt: now,
        firstAnsweredAt: attempt.firstAnsweredAt ?? now
      },
      shouldRequeue: false
    };
  }
}
