import type { Prisma, PrismaClient } from "@prisma/client";
import { importedContentSchema, type ImportedContent } from "@/lib/contentSchema";

type ContentTopic = ImportedContent["topics"][number];
type ContentLevel = ImportedContent["levels"][number];
type ContentQuestion = ContentLevel["questions"][number];
type ImportCounts = { topics: number; levels: number; questions: number };
type ImportTransaction = Prisma.TransactionClient;

export class ContentImportService {
  constructor(private readonly db: PrismaClient) {}

  async import(raw: unknown): Promise<ImportCounts> {
    const content = importedContentSchema.parse(raw);
    return this.persist(content);
  }

  private async persist(content: ImportedContent): Promise<ImportCounts> {
    let questionCount = 0;
    await this.db.$transaction(async (tx) => {
      for (const topic of content.topics) {
        await upsertTopic(tx, topic);
      }
      for (const [levelIndex, level] of content.levels.entries()) {
        questionCount += await importLevel(tx, level, levelIndex);
      }
    });
    return { topics: content.topics.length, levels: content.levels.length, questions: questionCount };
  }
}

async function upsertTopic(tx: ImportTransaction, topic: ContentTopic) {
  await tx.topic.upsert({ where: { slug: topic.slug }, create: topic, update: topic });
}

async function importLevel(tx: ImportTransaction, level: ContentLevel, levelIndex: number) {
  const savedLevel = await tx.level.upsert({
    where: { slug: level.slug },
    create: { slug: level.slug, title: level.title, description: level.description, sortOrder: levelIndex },
    update: { title: level.title, description: level.description, sortOrder: levelIndex }
  });

  await clearLevelContent(tx, savedLevel.id);
  await linkLevelTopics(tx, savedLevel.id, level.topicSlugs);

  for (const [questionIndex, question] of level.questions.entries()) {
    await createLevelQuestion(tx, savedLevel.id, question, questionIndex);
  }

  return level.questions.length;
}

async function clearLevelContent(tx: ImportTransaction, levelId: string) {
  const existingLevelQuestions = await tx.levelQuestion.findMany({
    where: { levelId },
    select: { questionId: true }
  });
  await tx.learnerProgress.deleteMany({ where: { levelId } });
  await tx.levelAttempt.deleteMany({ where: { levelId } });
  await tx.levelQuestion.deleteMany({ where: { levelId } });
  await tx.levelTopic.deleteMany({ where: { levelId } });
  if (existingLevelQuestions.length > 0) {
    await tx.question.deleteMany({
      where: { id: { in: existingLevelQuestions.map((item) => item.questionId) } }
    });
  }
}

async function linkLevelTopics(tx: ImportTransaction, levelId: string, topicSlugs: string[]) {
  for (const topicSlug of topicSlugs) {
    const topic = await tx.topic.findUniqueOrThrow({ where: { slug: topicSlug } });
    await tx.levelTopic.upsert({
      where: { levelId_topicId: { levelId, topicId: topic.id } },
      create: { levelId, topicId: topic.id },
      update: {}
    });
  }
}

async function createLevelQuestion(tx: ImportTransaction, levelId: string, question: ContentQuestion, questionIndex: number) {
  const savedQuestion = await tx.question.create({ data: { prompt: question.prompt, type: toDbQuestionType(question.type) } });
  await tx.levelQuestion.create({ data: { levelId, questionId: savedQuestion.id, sortOrder: questionIndex } });

  if (question.type === "quiz") {
    await tx.quizQuestion.create({ data: { questionId: savedQuestion.id, choices: { create: question.choices.map(toChoiceData) } } });
  } else if (question.type === "flashcard") {
    await tx.flashcardQuestion.create({ data: { questionId: savedQuestion.id, front: question.front, back: question.back } });
  } else {
    await tx.mindMapQuestion.create({
      data: {
        questionId: savedQuestion.id,
        layoutMetadata: question.layoutMetadata ? JSON.stringify(question.layoutMetadata) : undefined,
        nodes: { create: question.nodes.map((node, index) => ({ label: node.label, parentNodeId: node.parentKey, isTarget: node.isTarget, sortOrder: index })) },
        choices: { create: question.choices.map(toChoiceData) }
      }
    });
  }
}

function toChoiceData(choice: { label: string; isCorrect: boolean }, index: number) {
  return { label: choice.label, isCorrect: choice.isCorrect, sortOrder: index };
}

function toDbQuestionType(type: ContentQuestion["type"]) {
  if (type === "quiz") return "QUIZ";
  if (type === "flashcard") return "FLASHCARD";
  return "MIND_MAP";
}
