import { readFile } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve } from "node:path";
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

type ParsedContent = z.infer<typeof contentSchema>;
type ParsedLevel = ParsedContent["levels"][number];
type ParsedQuestion = ParsedLevel["questions"][number];
type ParsedQuiz = Extract<ParsedQuestion, { type: "quiz" }>;

export interface ValidationResult {
  totalQuestions: number;
  levelSummaries: Array<{ slug: string; quizzes: number; flashcards: number }>;
}

export function validateSonarContent(raw: unknown): ValidationResult {
  const content = contentSchema.parse(raw);
  const errors: string[] = [];
  const topicSlugs = new Set(content.topics.map((topic) => topic.slug));

  validateTopics(content, errors);
  if (content.levels.length !== 3) errors.push(`Expected exactly 3 levels, found ${content.levels.length}.`);

  const questionKeys = new Set<string>();
  const levelSummaries = content.levels.map((level) => validateLevel(level, topicSlugs, questionKeys, errors));
  const totalQuestions = content.levels.reduce((sum, level) => sum + level.questions.length, 0);

  if (totalQuestions !== 54) errors.push(`Expected exactly 54 questions overall, found ${totalQuestions}.`);
  if (errors.length > 0) throw new Error(errors.join("\n"));
  return { totalQuestions, levelSummaries };
}

function validateTopics(content: ParsedContent, errors: string[]) {
  for (const topic of content.topics) {
    if (!kebabCase.test(topic.slug)) errors.push(`Topic slug is not kebab-case: ${topic.slug}`);
  }
}

function validateLevel(level: ParsedLevel, topicSlugs: Set<string>, questionKeys: Set<string>, errors: string[]) {
  if (!kebabCase.test(level.slug)) errors.push(`Level slug is not kebab-case: ${level.slug}`);
  for (const topicSlug of level.topicSlugs) {
    if (!topicSlugs.has(topicSlug)) errors.push(`Level ${level.slug} references unknown topic slug ${topicSlug}.`);
  }

  const quizzes = level.questions.filter((question) => question.type === "quiz").length;
  const flashcards = level.questions.filter((question) => question.type === "flashcard").length;
  validateLevelShape(level, quizzes, flashcards, errors);

  for (const question of level.questions) {
    validateQuestion(question, questionKeys, errors);
  }

  return { slug: level.slug, quizzes, flashcards };
}

function validateLevelShape(level: ParsedLevel, quizzes: number, flashcards: number, errors: string[]) {
  if (level.questions.length !== 18) errors.push(`Level ${level.slug} must have 18 questions, found ${level.questions.length}.`);
  if (quizzes !== 10) errors.push(`Level ${level.slug} must have 10 quizzes, found ${quizzes}.`);
  if (flashcards !== 8) errors.push(`Level ${level.slug} must have 8 flashcards, found ${flashcards}.`);
  if (isGrouped(level.questions.map((question) => question.type))) {
    errors.push(`Level ${level.slug} groups question types instead of mixing them.`);
  }
}

function validateQuestion(question: ParsedQuestion, questionKeys: Set<string>, errors: string[]) {
  if (!kebabCase.test(question.key)) errors.push(`Question key is not kebab-case: ${question.key}`);
  if (questionKeys.has(question.key)) errors.push(`Duplicated question key: ${question.key}`);
  questionKeys.add(question.key);
  if (question.type === "quiz") validateQuiz(question, errors);
}

function validateQuiz(question: ParsedQuiz, errors: string[]) {
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
}

export async function validateSonarContentFile(filePath: string): Promise<ValidationResult> {
  let parsed: unknown;
  const safePath = resolveContentPath(filePath);
  try {
    parsed = JSON.parse(await readFile(safePath, "utf8")) as unknown;
  } catch (error) {
    throw new Error(`JSON cannot be parsed: ${error instanceof Error ? error.message : String(error)}`);
  }
  return validateSonarContent(parsed);
}

function resolveContentPath(inputPath: string): string {
  const workspaceRoot = resolve(".");
  const contentPath = resolve(inputPath);

  if (extname(contentPath) !== ".json") {
    throw new Error("Content validation only accepts .json files.");
  }

  const relativePath = relative(workspaceRoot, contentPath);
  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    throw new Error("Content validation must stay inside the repository.");
  }

  return contentPath;
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
  try {
    const result = await validateSonarContentFile(filePath);
    console.log(`Valid Sonar content: ${result.totalQuestions} questions.`);
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
