import type { PrismaClient } from "@prisma/client";
import { importedContentSchema, type ImportedContent } from "@/lib/contentSchema";

export class ContentImportService {
  constructor(private readonly db: PrismaClient) {}

  async import(raw: unknown): Promise<{ topics: number; levels: number; questions: number }> {
    const content = importedContentSchema.parse(raw);
    return this.persist(content);
  }

  private async persist(content: ImportedContent): Promise<{ topics: number; levels: number; questions: number }> {
    let questionCount = 0;
    await this.db.$transaction(async (tx) => {
      for (const topic of content.topics) {
        await tx.topic.upsert({ where: { slug: topic.slug }, create: topic, update: topic });
      }
      for (const [levelIndex, level] of content.levels.entries()) {
        const savedLevel = await tx.level.upsert({
          where: { slug: level.slug },
          create: { slug: level.slug, title: level.title, description: level.description, sortOrder: levelIndex },
          update: { title: level.title, description: level.description, sortOrder: levelIndex }
        });
        const existingLevelQuestions = await tx.levelQuestion.findMany({
          where: { levelId: savedLevel.id },
          select: { questionId: true }
        });
        await tx.learnerProgress.deleteMany({ where: { levelId: savedLevel.id } });
        await tx.levelAttempt.deleteMany({ where: { levelId: savedLevel.id } });
        await tx.levelQuestion.deleteMany({ where: { levelId: savedLevel.id } });
        await tx.levelTopic.deleteMany({ where: { levelId: savedLevel.id } });
        if (existingLevelQuestions.length > 0) {
          await tx.question.deleteMany({
            where: { id: { in: existingLevelQuestions.map((item) => item.questionId) } }
          });
        }
        for (const topicSlug of level.topicSlugs) {
          const topic = await tx.topic.findUniqueOrThrow({ where: { slug: topicSlug } });
          await tx.levelTopic.upsert({
            where: { levelId_topicId: { levelId: savedLevel.id, topicId: topic.id } },
            create: { levelId: savedLevel.id, topicId: topic.id },
            update: {}
          });
        }
        for (const [questionIndex, question] of level.questions.entries()) {
          const savedQuestion = await tx.question.create({ data: { prompt: question.prompt, type: toDbQuestionType(question.type) } });
          await tx.levelQuestion.create({ data: { levelId: savedLevel.id, questionId: savedQuestion.id, sortOrder: questionIndex } });
          questionCount += 1;
          if (question.type === "quiz") {
            await tx.quizQuestion.create({ data: { questionId: savedQuestion.id, choices: { create: question.choices.map((choice, index) => ({ label: choice.label, isCorrect: choice.isCorrect, sortOrder: index })) } } });
          } else if (question.type === "flashcard") {
            await tx.flashcardQuestion.create({ data: { questionId: savedQuestion.id, front: question.front, back: question.back } });
          } else {
            await tx.mindMapQuestion.create({
              data: {
                questionId: savedQuestion.id,
                layoutMetadata: question.layoutMetadata ? JSON.stringify(question.layoutMetadata) : undefined,
                nodes: { create: question.nodes.map((node, index) => ({ label: node.label, parentNodeId: node.parentKey, isTarget: node.isTarget, sortOrder: index })) },
                choices: { create: question.choices.map((choice, index) => ({ label: choice.label, isCorrect: choice.isCorrect, sortOrder: index })) }
              }
            });
          }
        }
      }
    });
    return { topics: content.topics.length, levels: content.levels.length, questions: questionCount };
  }
}

function toDbQuestionType(type: ImportedContent["levels"][number]["questions"][number]["type"]) {
  if (type === "quiz") return "QUIZ";
  if (type === "flashcard") return "FLASHCARD";
  return "MIND_MAP";
}
