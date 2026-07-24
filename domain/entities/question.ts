export type QuestionType = "quiz" | "flashcard" | "mind_map";
export type QuestionStatus =
  | "unanswered"
  | "active"
  | "first_error"
  | "correct"
  | "failed"
  | "revealing_answer"
  | "completed";
export type AttemptFinalStatus = "in_progress" | "correct" | "correct_after_error" | "failed";

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
}

export interface QuizChoice {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface QuizQuestion extends BaseQuestion {
  type: "quiz";
  choices: [QuizChoice, QuizChoice, QuizChoice];
}

export interface FlashcardQuestion extends BaseQuestion {
  type: "flashcard";
  front: string;
  back: string;
}

export interface MindMapNode {
  id: string;
  label: string | null;
  parentId: string | null;
  isTarget: boolean;
}

export interface MindMapChoice {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface MindMapQuestion extends BaseQuestion {
  type: "mind_map";
  nodes: MindMapNode[];
  choices: [MindMapChoice, MindMapChoice, MindMapChoice];
}

export type LearningQuestion = QuizQuestion | FlashcardQuestion | MindMapQuestion;

export interface QuestionAttemptState {
  questionId: string;
  status: QuestionStatus;
  errorCount: number;
  selectedAnswerIds: string[];
  eventuallyCorrect: boolean;
  sequencePosition: number;
  levelAttemptId: string;
  firstAnsweredAt: Date | null;
  completedAt: Date | null;
  revealedAnswerId: string | null;
  flashcardRevealed: boolean;
  encounters: number;
}

export interface LevelSessionSnapshot {
  levelAttemptId: string;
  levelId: string;
  title: string;
  topics: string[];
  order: string[];
  currentIndex: number;
  attempts: Record<string, QuestionAttemptState>;
  completed: boolean;
}

export interface LevelResult {
  totalQuestions: number;
  correctWithoutError: number;
  correctAfterOneError: number;
  failed: number;
  totalErrors: number;
  completionPercentage: number;
}
