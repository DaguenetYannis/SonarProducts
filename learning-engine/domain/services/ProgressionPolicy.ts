import type { LevelResult, QuestionAttemptState } from "@/domain/entities/question";

export class ProgressionPolicy {
  calculateResult(attempts: QuestionAttemptState[]): LevelResult {
    const totalQuestions = attempts.length;
    const correctWithoutError = attempts.filter((attempt) => attempt.status === "completed" && attempt.eventuallyCorrect && attempt.errorCount === 0).length;
    const correctAfterOneError = attempts.filter((attempt) => attempt.status === "completed" && attempt.eventuallyCorrect && attempt.errorCount > 0).length;
    const failed = attempts.filter((attempt) => attempt.status === "completed" && !attempt.eventuallyCorrect).length;
    const totalErrors = attempts.reduce((sum, attempt) => sum + attempt.errorCount, 0);
    const completionPercentage = totalQuestions === 0 ? 0 : Math.round(((correctWithoutError + correctAfterOneError) / totalQuestions) * 100);

    return { totalQuestions, correctWithoutError, correctAfterOneError, failed, totalErrors, completionPercentage };
  }
}
