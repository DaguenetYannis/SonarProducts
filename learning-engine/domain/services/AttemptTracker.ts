import type { QuestionAttemptState } from "@/domain/entities/question";

export interface AttemptTracker {
  recordSelection(attempt: QuestionAttemptState, answerId: string, now?: Date): QuestionAttemptState;
  markCompleted(attempt: QuestionAttemptState, eventuallyCorrect: boolean, revealedAnswerId: string | null, now?: Date): QuestionAttemptState;
}

export class InMemoryAttemptTracker implements AttemptTracker {
  recordSelection(attempt: QuestionAttemptState, answerId: string, now: Date = new Date()): QuestionAttemptState {
    if (attempt.selectedAnswerIds.includes(answerId)) {
      return attempt;
    }

    return {
      ...attempt,
      selectedAnswerIds: [...attempt.selectedAnswerIds, answerId],
      firstAnsweredAt: attempt.firstAnsweredAt ?? now
    };
  }

  markCompleted(attempt: QuestionAttemptState, eventuallyCorrect: boolean, revealedAnswerId: string | null, now: Date = new Date()): QuestionAttemptState {
    return {
      ...attempt,
      status: "completed",
      eventuallyCorrect,
      revealedAnswerId,
      completedAt: now
    };
  }
}
