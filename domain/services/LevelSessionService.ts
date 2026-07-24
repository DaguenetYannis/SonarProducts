import type { LearningQuestion, LevelResult, LevelSessionSnapshot, QuestionAttemptState } from "@/domain/entities/question";
import { InMemoryAttemptTracker } from "@/domain/services/AttemptTracker";
import { ObjectiveAnswerEvaluator } from "@/domain/services/AnswerEvaluator";
import { FlashcardTransitionPolicy } from "@/domain/services/FlashcardTransitionPolicy";
import { ProgressionPolicy } from "@/domain/services/ProgressionPolicy";
import type { QuestionOrderingService } from "@/domain/services/QuestionOrderingService";

export interface LevelSessionInput {
  levelAttemptId: string;
  levelId: string;
  title: string;
  topics: string[];
  questions: LearningQuestion[];
  previousOrders?: string[][];
}

export class LevelSessionService {
  private readonly snapshot: LevelSessionSnapshot;
  private readonly questions: Map<string, LearningQuestion>;
  private readonly evaluator = new ObjectiveAnswerEvaluator();
  private readonly tracker = new InMemoryAttemptTracker();
  private readonly flashcards = new FlashcardTransitionPolicy();
  private readonly progression = new ProgressionPolicy();

  constructor(input: LevelSessionInput, ordering: QuestionOrderingService) {
    this.questions = new Map(input.questions.map((question) => [question.id, question]));
    const order = ordering.createOrder(input.questions.map((question) => question.id), input.previousOrders);
    this.snapshot = {
      levelAttemptId: input.levelAttemptId,
      levelId: input.levelId,
      title: input.title,
      topics: input.topics,
      order,
      currentIndex: 0,
      completed: order.length === 0,
      attempts: Object.fromEntries(order.map((questionId, index) => [questionId, createAttempt(questionId, input.levelAttemptId, index)]))
    };
  }

  getSnapshot(): LevelSessionSnapshot {
    return structuredClone(this.snapshot);
  }

  currentQuestion(): LearningQuestion | null {
    return this.questions.get(this.snapshot.order[this.snapshot.currentIndex] ?? "") ?? null;
  }

  answerObjective(answerId: string): LevelSessionSnapshot {
    const question = this.requireCurrentQuestion();
    if (question.type === "flashcard") throw new Error("Use flashcard actions for flashcard questions.");
    const attempt = this.currentAttempt();
    if (attempt.status === "completed" || attempt.status === "revealing_answer") return this.getSnapshot();
    if (attempt.selectedAnswerIds.includes(answerId)) return this.getSnapshot();

    const evaluation = this.evaluator.evaluate(question, answerId);
    let nextAttempt = this.tracker.recordSelection(attempt, answerId);

    if (evaluation.isCorrect) {
      nextAttempt = this.tracker.markCompleted({ ...nextAttempt, status: "correct" }, true, null);
      this.saveAttempt(nextAttempt);
      return this.getSnapshot();
    }

    if (nextAttempt.errorCount === 0) {
      this.saveAttempt({ ...nextAttempt, errorCount: 1, status: "first_error" });
      return this.getSnapshot();
    }

    nextAttempt = this.tracker.markCompleted({ ...nextAttempt, errorCount: 2, status: "revealing_answer" }, false, evaluation.correctAnswerId);
    this.saveAttempt(nextAttempt);
    return this.getSnapshot();
  }

  revealFlashcard(): LevelSessionSnapshot {
    const question = this.requireCurrentQuestion();
    if (question.type !== "flashcard") throw new Error("Current question is not a flashcard.");
    this.saveAttempt(this.flashcards.reveal(this.currentAttempt()));
    return this.getSnapshot();
  }

  markFlashcardKnown(): LevelSessionSnapshot {
    const question = this.requireCurrentQuestion();
    if (question.type !== "flashcard") throw new Error("Current question is not a flashcard.");
    this.saveAttempt(this.flashcards.knewIt(this.currentAttempt()));
    return this.getSnapshot();
  }

  reviewFlashcardAgain(): LevelSessionSnapshot {
    const question = this.requireCurrentQuestion();
    if (question.type !== "flashcard") throw new Error("Current question is not a flashcard.");
    const { attempt, shouldRequeue } = this.flashcards.reviewAgain(this.currentAttempt());
    this.saveAttempt(attempt);
    if (shouldRequeue) {
      this.requeueCurrentLater();
      const nextAttempt = this.currentAttempt();
      if (nextAttempt.status === "unanswered") this.saveAttempt({ ...nextAttempt, status: "active" });
      return this.getSnapshot();
    }
    return this.getSnapshot();
  }

  previous(): LevelSessionSnapshot {
    this.snapshot.currentIndex = Math.max(0, this.snapshot.currentIndex - 1);
    this.snapshot.completed = false;
    return this.getSnapshot();
  }

  next(): LevelSessionSnapshot {
    this.advance();
    return this.getSnapshot();
  }

  result(): LevelResult {
    return this.progression.calculateResult(Object.values(this.snapshot.attempts));
  }

  private advance(): void {
    const nextIndex = this.snapshot.currentIndex + 1;
    if (nextIndex >= this.snapshot.order.length) {
      this.snapshot.currentIndex = this.snapshot.order.length;
      this.snapshot.completed = true;
      return;
    }
    this.snapshot.currentIndex = nextIndex;
    const nextAttempt = this.currentAttempt();
    if (nextAttempt.status === "unanswered") this.saveAttempt({ ...nextAttempt, status: "active" });
  }

  private requeueCurrentLater(): void {
    const [questionId] = this.snapshot.order.splice(this.snapshot.currentIndex, 1);
    const insertAt = Math.min(this.snapshot.order.length, this.snapshot.currentIndex + 2);
    this.snapshot.order.splice(insertAt, 0, questionId);
    this.snapshot.order.forEach((id, index) => {
      this.snapshot.attempts[id] = { ...this.snapshot.attempts[id], sequencePosition: index };
    });
  }

  private requireCurrentQuestion(): LearningQuestion {
    const question = this.currentQuestion();
    if (!question) throw new Error("No active question.");
    return question;
  }

  private currentAttempt(): QuestionAttemptState {
    const question = this.requireCurrentQuestion();
    return this.snapshot.attempts[question.id];
  }

  private saveAttempt(attempt: QuestionAttemptState): void {
    this.snapshot.attempts[attempt.questionId] = attempt;
  }
}

function createAttempt(questionId: string, levelAttemptId: string, sequencePosition: number): QuestionAttemptState {
  return {
    questionId,
    levelAttemptId,
    sequencePosition,
    status: sequencePosition === 0 ? "active" : "unanswered",
    errorCount: 0,
    selectedAnswerIds: [],
    eventuallyCorrect: false,
    firstAnsweredAt: null,
    completedAt: null,
    revealedAnswerId: null,
    flashcardRevealed: false,
    encounters: 1
  };
}
