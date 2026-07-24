import type { LearningQuestion } from "@/domain/entities/question";

export interface EvaluationResult {
  answerId: string;
  isCorrect: boolean;
  correctAnswerId: string;
}

export interface AnswerEvaluator {
  evaluate(question: LearningQuestion, answerId: string): EvaluationResult;
}

export class ObjectiveAnswerEvaluator implements AnswerEvaluator {
  evaluate(question: LearningQuestion, answerId: string): EvaluationResult {
    if (question.type === "flashcard") {
      throw new Error("Flashcards use self-assessment, not objective answer evaluation.");
    }

    const correct = question.choices.find((choice) => choice.isCorrect);
    if (!correct) {
      throw new Error(`Question ${question.id} has no correct choice.`);
    }

    const selected = question.choices.find((choice) => choice.id === answerId);
    if (!selected) {
      throw new Error(`Choice ${answerId} does not belong to question ${question.id}.`);
    }

    return { answerId, isCorrect: selected.isCorrect, correctAnswerId: correct.id };
  }
}
