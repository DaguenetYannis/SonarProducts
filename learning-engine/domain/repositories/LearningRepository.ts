import type { LearningQuestion, LevelSessionSnapshot, QuestionAttemptState } from "@/domain/entities/question";

export interface LevelSummary {
  id: string;
  title: string;
  description: string | null;
  topics: string[];
  questionCount: number;
}

export interface LevelContent {
  id: string;
  title: string;
  topics: string[];
  questions: LearningQuestion[];
}

export interface LearningRepository {
  listLevels(): Promise<LevelSummary[]>;
  getLevelContent(levelId: string): Promise<LevelContent | null>;
  createLevelAttempt(levelId: string, learnerProfileId: string, questionOrder: string[]): Promise<string>;
  loadPreviousOrders(levelId: string, learnerProfileId: string): Promise<string[][]>;
  persistQuestionAttempt(levelAttemptId: string, attempt: QuestionAttemptState): Promise<void>;
  completeLevelAttempt(snapshot: LevelSessionSnapshot): Promise<void>;
}
