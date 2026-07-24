import type { LearningRepository, LevelContent, LevelSummary } from "@/domain/repositories/LearningRepository";
import type { LearningQuestion, LevelSessionSnapshot, MindMapChoice, QuizChoice, QuestionAttemptState } from "@/domain/entities/question";
import { prisma } from "@/infrastructure/database/prisma";

export class PrismaLearningRepository implements LearningRepository {
  async listLevels(): Promise<LevelSummary[]> {
    const levels = await prisma.level.findMany({
      orderBy: { sortOrder: "asc" },
      include: { levelTopics: { include: { topic: true } }, levelQuestions: true }
    });
    return levels.map((level) => ({
      id: level.id,
      title: level.title,
      description: level.description,
      topics: level.levelTopics.map((item) => item.topic.title),
      questionCount: level.levelQuestions.length
    }));
  }

  async getLevelContent(levelId: string): Promise<LevelContent | null> {
    const level = await prisma.level.findUnique({
      where: { id: levelId },
      include: {
        levelTopics: { include: { topic: true } },
        levelQuestions: {
          orderBy: { sortOrder: "asc" },
          include: {
            question: {
              include: {
                quizQuestion: { include: { choices: { orderBy: { sortOrder: "asc" } } } },
                flashcard: true,
                mindMap: { include: { nodes: { orderBy: { sortOrder: "asc" } }, choices: { orderBy: { sortOrder: "asc" } } } }
              }
            }
          }
        }
      }
    });
    if (!level) return null;
    return {
      id: level.id,
      title: level.title,
      topics: level.levelTopics.map((item) => item.topic.title),
      questions: level.levelQuestions.map(({ question }) => mapQuestion(question))
    };
  }

  async createLevelAttempt(levelId: string, learnerProfileId: string, questionOrder: string[]): Promise<string> {
    const attempt = await prisma.levelAttempt.create({ data: { levelId, learnerProfileId, questionOrder: JSON.stringify(questionOrder) } });
    return attempt.id;
  }

  async loadPreviousOrders(levelId: string, learnerProfileId: string): Promise<string[][]> {
    const attempts = await prisma.levelAttempt.findMany({ where: { levelId, learnerProfileId }, select: { questionOrder: true } });
    return attempts.map((attempt) => parseQuestionOrder(attempt.questionOrder));
  }

  async persistQuestionAttempt(levelAttemptId: string, attempt: QuestionAttemptState): Promise<void> {
    await prisma.questionAttempt.upsert({
      where: { levelAttemptId_questionId: { levelAttemptId, questionId: attempt.questionId } },
      create: {
        levelAttemptId,
        questionId: attempt.questionId,
        status: toDbQuestionStatus(attempt.status),
        finalStatus: toDbFinalStatus(attempt),
        errorCount: attempt.errorCount,
        eventuallyCorrect: attempt.eventuallyCorrect,
        sequencePosition: attempt.sequencePosition,
        firstAnsweredAt: attempt.firstAnsweredAt,
        completedAt: attempt.completedAt
      },
      update: {
        status: toDbQuestionStatus(attempt.status),
        finalStatus: toDbFinalStatus(attempt),
        errorCount: attempt.errorCount,
        eventuallyCorrect: attempt.eventuallyCorrect,
        sequencePosition: attempt.sequencePosition,
        firstAnsweredAt: attempt.firstAnsweredAt,
        completedAt: attempt.completedAt
      }
    });
  }

  async completeLevelAttempt(snapshot: LevelSessionSnapshot): Promise<void> {
    await prisma.levelAttempt.update({
      where: { id: snapshot.levelAttemptId },
      data: { status: "COMPLETED", completedAt: new Date(), questionOrder: JSON.stringify(snapshot.order) }
    });
  }
}

type RepositoryQuestion = Awaited<ReturnType<typeof prisma.question.findFirstOrThrow>> & {
  quizQuestion?: { choices: Array<{ id: string; label: string; isCorrect: boolean }> } | null;
  flashcard?: { front: string; back: string } | null;
  mindMap?: {
    nodes: Array<{ id: string; parentNodeId: string | null; label: string | null; isTarget: boolean }>;
    choices: Array<{ id: string; label: string; isCorrect: boolean }>;
  } | null;
};

function mapQuestion(question: RepositoryQuestion): LearningQuestion {
  if (question.type === "QUIZ" && question.quizQuestion) {
    const choices: QuizChoice[] = question.quizQuestion.choices.map((choice) => ({ id: choice.id, label: choice.label, isCorrect: choice.isCorrect }));
    if (choices.length !== 3) throw new Error(`Quiz question ${question.id} must have exactly three choices.`);
    return { id: question.id, type: "quiz", prompt: question.prompt, choices: choices as [QuizChoice, QuizChoice, QuizChoice] };
  }
  if (question.type === "FLASHCARD" && question.flashcard) {
    return { id: question.id, type: "flashcard", prompt: question.prompt, front: question.flashcard.front, back: question.flashcard.back };
  }
  if (question.type === "MIND_MAP" && question.mindMap) {
    const choices: MindMapChoice[] = question.mindMap.choices.map((choice) => ({ id: choice.id, label: choice.label, isCorrect: choice.isCorrect }));
    if (choices.length !== 3) throw new Error(`Mind-map question ${question.id} must have exactly three choices.`);
    return {
      id: question.id,
      type: "mind_map",
      prompt: question.prompt,
      nodes: question.mindMap.nodes.map((node) => ({ id: node.id, parentId: node.parentNodeId, label: node.label, isTarget: node.isTarget })),
      choices: choices as [MindMapChoice, MindMapChoice, MindMapChoice]
    };
  }
  throw new Error(`Question ${question.id} is missing subtype content.`);
}

function parseQuestionOrder(value: string): string[] {
  const parsed = JSON.parse(value) as unknown;
  return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
}

function toDbQuestionStatus(status: QuestionAttemptState["status"]) {
  return status.toUpperCase() as "UNANSWERED" | "ACTIVE" | "FIRST_ERROR" | "CORRECT" | "FAILED" | "REVEALING_ANSWER" | "COMPLETED";
}

function toDbFinalStatus(attempt: QuestionAttemptState) {
  if (attempt.status !== "completed") return "IN_PROGRESS";
  if (!attempt.eventuallyCorrect) return "FAILED";
  return attempt.errorCount > 0 ? "CORRECT_AFTER_ERROR" : "CORRECT";
}
