import { readFile } from "node:fs/promises";
import { z } from "zod";

const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const quizChoiceSchema = z.object({
  key: z.string(),
  label: z.string(),
  isCorrect: z.boolean()
}).strict();

const quizSchema = z.object({
  type: z.literal("quiz"),
  key: z.string(),
  prompt: z.string(),
  choices: z.array(quizChoiceSchema)
}).strict();

const flashcardSchema = z.object({
  type: z.literal("flashcard"),
  key: z.string(),
  prompt: z.string(),
  front: z.string(),
  back: z.string()
}).strict();

const contentSchema = z.object({
  topics: z.array(z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string().optional()
  }).strict()),
  levels: z.array(z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string().optional(),
    topicSlugs: z.array(z.string()),
    questions: z.array(z.union([quizSchema, flashcardSchema]))
  }).strict())
}).strict();

export interface ValidationResult {
  totalQuestions: number;
  levelSummaries: Array<{ slug: string; quizzes: number; flashcards: number }>;
}

export function validateSonarContent(raw: unknown): ValidationResult {
  const content = contentSchema.parse(raw);
  const errors: string[] = [];
  const topicSlugs = new Set(content.topics.map((topic) => topic.slug));
  const questionKeys = new Set<string>();
  let totalQuestions = 0;

  for (const topic of content.topics) {
    if (!kebabCase.test(topic.slug)) errors.push(`Topic slug is not kebab-case: ${topic.slug}`);
  }

  if (content.levels.length !== 3) errors.push(`Expected exactly 3 levels, found ${content.levels.length}.`);

  const levelSummaries = content.levels.map((level) => {
    if (!kebabCase.test(level.slug)) errors.push(`Level slug is not kebab-case: ${level.slug}`);
    for (const topicSlug of level.topicSlugs) {
      if (!topicSlugs.has(topicSlug)) errors.push(`Level ${level.slug} references unknown topic slug ${topicSlug}.`);
    }

    const quizzes = level.questions.filter((question) => question.type === "quiz").length;
    const flashcards = level.questions.filter((question) => question.type === "flashcard").length;
    totalQuestions += level.questions.length;

    if (level.questions.length !== 18) errors.push(`Level ${level.slug} must have 18 questions, found ${level.questions.length}.`);
    if (quizzes !== 10) errors.push(`Level ${level.slug} must have 10 quizzes, found ${quizzes}.`);
    if (flashcards !== 8) errors.push(`Level ${level.slug} must have 8 flashcards, found ${flashcards}.`);
    if (isGrouped(level.questions.map((question) => question.type))) {
      errors.push(`Level ${level.slug} groups question types instead of mixing them.`);
    }

    for (const question of level.questions) {
      if (!kebabCase.test(question.key)) errors.push(`Question key is not kebab-case: ${question.key}`);
      if (questionKeys.has(question.key)) errors.push(`Duplicated question key: ${question.key}`);
      questionKeys.add(question.key);
      if (question.type === "quiz") {
        if (question.choices.length !== 3) errors.push(`Quiz ${question.key} must have exactly 3 choices.`);
        if (question.choices.filter((choice) => choice.isCorrect).length !== 1) {
          errors.push(`Quiz ${question.key} must have exactly 1 correct choice.`);
        }
        const choiceKeys = new Set<string>();
        for (const choice of question.choices) {
          if (!kebabCase.test(choice.key)) errors.push(`Choice key is not kebab-case: ${question.key}.${choice.key}`);
          if (choiceKeys.has(choice.key)) errors.push(`Duplicated choice key in ${question.key}: ${choice.key}`);
          choiceKeys.add(choice.key);
        }
      } else if ("choices" in question) {
        errors.push(`Flashcard ${question.key} must not contain choices.`);
      }
    }

    return { slug: level.slug, quizzes, flashcards };
  });

  if (totalQuestions !== 54) errors.push(`Expected exactly 54 questions overall, found ${totalQuestions}.`);
  if (errors.length > 0) throw new Error(errors.join("\n"));
  return { totalQuestions, levelSummaries };
}

export async function validateSonarContentFile(filePath: string): Promise<ValidationResult> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await readFile(filePath, "utf8")) as unknown;
  } catch (error) {
    throw new Error(`JSON cannot be parsed: ${error instanceof Error ? error.message : String(error)}`);
  }
  return validateSonarContent(parsed);
}

function isGrouped(types: string[]): boolean {
  if (types.length < 3) return true;
  let transitions = 0;
  for (let index = 1; index < types.length; index += 1) {
    if (types[index] !== types[index - 1]) transitions += 1;
  }
  return transitions < 6;
}

if (process.argv[1]?.endsWith("validate-sonar-content.ts")) {
  const filePath = process.argv[2] ?? "content/sonar-products-learning.json";
  validateSonarContentFile(filePath)
    .then((result) => {
      console.log(`Valid Sonar content: ${result.totalQuestions} questions.`);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
}
