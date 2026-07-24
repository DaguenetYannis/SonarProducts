import { describe, expect, it } from "vitest";
import { LevelSessionService } from "@/domain/services/LevelSessionService";
import { ProgressionPolicy } from "@/domain/services/ProgressionPolicy";
import { mixedQuestions } from "@/tests/fixtures/questions";

const ordered = { createOrder: (questionIds: string[]) => questionIds };

function session(seed = 1) {
  return new LevelSessionService({
    levelAttemptId: `attempt-${seed}`,
    levelId: "level-1",
    title: "Level",
    topics: ["Topic"],
    questions: mixedQuestions,
    previousOrders: []
  }, ordered);
}

describe("LevelSessionService", () => {
  it("keeps a question active after the first wrong answer", () => {
    const service = session();
    service.answerObjective("choice-1");
    const attempt = service.getSnapshot().attempts["question-a"];
    expect(attempt.status).toBe("first_error");
    expect(attempt.errorCount).toBe(1);
  });

  it("fails and reveals after the second wrong answer", () => {
    const service = session();
    service.answerObjective("choice-1");
    service.answerObjective("choice-3");
    const attempt = service.getSnapshot().attempts["question-a"];
    expect(attempt.status).toBe("completed");
    expect(attempt.eventuallyCorrect).toBe(false);
    expect(attempt.revealedAnswerId).toBe("choice-2");
  });

  it("preserves one error when later answered correctly", () => {
    const service = session();
    service.answerObjective("choice-1");
    service.answerObjective("choice-2");
    const attempt = service.getSnapshot().attempts["question-a"];
    expect(attempt.eventuallyCorrect).toBe(true);
    expect(attempt.errorCount).toBe(1);
  });

  it("records a clean correct answer", () => {
    const service = session();
    service.answerObjective("choice-2");
    const attempt = service.getSnapshot().attempts["question-a"];
    expect(attempt.eventuallyCorrect).toBe(true);
    expect(attempt.errorCount).toBe(0);
  });

  it("protects against double-clicking the same wrong choice", () => {
    const service = session();
    service.answerObjective("choice-1");
    service.answerObjective("choice-1");
    const attempt = service.getSnapshot().attempts["question-a"];
    expect(attempt.status).toBe("first_error");
    expect(attempt.errorCount).toBe(1);
    expect(attempt.selectedAnswerIds).toEqual(["choice-1"]);
  });

  it("reveals flashcards", () => {
    const service = session();
    service.answerObjective("choice-2");
    service.next();
    service.revealFlashcard();
    expect(service.getSnapshot().attempts["question-b"].flashcardRevealed).toBe(true);
  });

  it("requeues a flashcard after first review", () => {
    const service = session();
    service.answerObjective("choice-2");
    service.next();
    service.revealFlashcard();
    service.reviewFlashcardAgain();
    const snapshot = service.getSnapshot();
    expect(snapshot.attempts["question-b"].errorCount).toBe(1);
    expect(snapshot.order.indexOf("question-b")).toBeGreaterThan(snapshot.currentIndex);
  });

  it("fails a flashcard after second review", () => {
    const service = session();
    service.answerObjective("choice-2");
    service.next();
    service.revealFlashcard();
    service.reviewFlashcardAgain();
    service.answerObjective("map-2");
    service.next();
    service.revealFlashcard();
    service.reviewFlashcardAgain();
    const attempt = service.getSnapshot().attempts["question-b"];
    expect(attempt.eventuallyCorrect).toBe(false);
    expect(attempt.status).toBe("completed");
  });

  it("restores previous state when navigating back", () => {
    const service = session();
    service.answerObjective("choice-1");
    service.answerObjective("choice-2");
    service.next();
    service.previous();
    const attempt = service.getSnapshot().attempts["question-a"];
    expect(attempt.errorCount).toBe(1);
    expect(attempt.status).toBe("completed");
  });

  it("calculates level completion", () => {
    const result = new ProgressionPolicy().calculateResult([
      { ...session().getSnapshot().attempts["question-a"], status: "completed", eventuallyCorrect: true },
      { ...session().getSnapshot().attempts["question-b"], status: "completed", eventuallyCorrect: false, errorCount: 2 }
    ]);
    expect(result.totalQuestions).toBe(2);
    expect(result.correctWithoutError).toBe(1);
    expect(result.failed).toBe(1);
  });
});
