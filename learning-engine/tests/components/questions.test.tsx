import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuizQuestionView } from "@/components/questions/QuizQuestionView";
import { FlashcardQuestionView } from "@/components/questions/FlashcardQuestionView";
import { MindMapQuestionView } from "@/components/questions/MindMapQuestionView";
import type { QuestionAttemptState } from "@/domain/entities/question";
import { mixedQuestions } from "@/tests/fixtures/questions";

const baseAttempt: QuestionAttemptState = {
  questionId: "question-a",
  levelAttemptId: "attempt",
  sequencePosition: 0,
  status: "active",
  errorCount: 0,
  selectedAnswerIds: [],
  eventuallyCorrect: false,
  firstAnsweredAt: null,
  completedAt: null,
  revealedAnswerId: null,
  flashcardRevealed: false,
  encounters: 1
};

describe("question interfaces", () => {
  it("renders quiz choices and sends answers", () => {
    const onAnswer = vi.fn();
    const question = mixedQuestions[0];
    if (question.type !== "quiz") throw new Error("Fixture mismatch");
    render(<QuizQuestionView question={question} attempt={baseAttempt} disabled={false} onAnswer={onAnswer} />);
    fireEvent.click(screen.getByRole("button", { name: "Choice 1" }));
    expect(onAnswer).toHaveBeenCalledWith("choice-1");
  });

  it("reveals flashcard controls", () => {
    const question = mixedQuestions[1];
    if (question.type !== "flashcard") throw new Error("Fixture mismatch");
    render(<FlashcardQuestionView question={question} attempt={{ ...baseAttempt, flashcardRevealed: true }} disabled={false} onReveal={vi.fn()} onKnown={vi.fn()} onReview={vi.fn()} />);
    expect(screen.getByRole("button", { name: "I knew it" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Review again" })).toBeInTheDocument();
  });

  it("renders mind-map target insertion after completion", () => {
    const question = mixedQuestions[2];
    if (question.type !== "mind_map") throw new Error("Fixture mismatch");
    render(<MindMapQuestionView question={question} attempt={{ ...baseAttempt, eventuallyCorrect: true, status: "completed" }} disabled={false} onAnswer={vi.fn()} />);
    expect(screen.getAllByText("Correct choice").length).toBeGreaterThan(0);
  });
});
