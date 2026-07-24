import rawContent from "@/content/sonar-products-learning.json";
import type { LearningQuestion, MindMapChoice, MindMapNode, QuizChoice } from "@/domain/entities/question";
import { importedContentSchema, type ImportedContent } from "@/lib/contentSchema";

export interface StaticLevelSummary {
  id: string;
  title: string;
  description: string | null;
  topics: string[];
  questionCount: number;
}

export interface StaticLevelContent {
  id: string;
  title: string;
  topics: string[];
  questions: LearningQuestion[];
}

const content = importedContentSchema.parse(rawContent);
const topicTitles = new Map(content.topics.map((topic) => [topic.slug, topic.title]));

export function listStaticLevels(): StaticLevelSummary[] {
  return content.levels.map((level) => ({
    id: level.slug,
    title: level.title,
    description: level.description ?? null,
    topics: level.topicSlugs.map((slug) => topicTitles.get(slug) ?? slug),
    questionCount: level.questions.length
  }));
}

export function getStaticLevelContent(levelId: string): StaticLevelContent | null {
  const level = content.levels.find((item) => item.slug === levelId);
  if (!level) return null;

  return {
    id: level.slug,
    title: level.title,
    topics: level.topicSlugs.map((slug) => topicTitles.get(slug) ?? slug),
    questions: level.questions.map((question) => mapQuestion(level.slug, question))
  };
}

function mapQuestion(levelSlug: string, question: ImportedContent["levels"][number]["questions"][number]): LearningQuestion {
  const questionId = `${levelSlug}:${question.key}`;
  if (question.type === "quiz") {
    const choices = question.choices.map((choice) => ({
      id: `${questionId}:${choice.key}`,
      label: choice.label,
      isCorrect: choice.isCorrect
    })) as [QuizChoice, QuizChoice, QuizChoice];
    return { id: questionId, type: "quiz", prompt: question.prompt, choices };
  }

  if (question.type === "flashcard") {
    return { id: questionId, type: "flashcard", prompt: question.prompt, front: question.front, back: question.back };
  }

  const nodes: MindMapNode[] = question.nodes.map((node) => ({
    id: `${questionId}:${node.key}`,
    parentId: node.parentKey ? `${questionId}:${node.parentKey}` : null,
    label: node.label,
    isTarget: node.isTarget
  }));
  const choices = question.choices.map((choice) => ({
    id: `${questionId}:${choice.key}`,
    label: choice.label,
    isCorrect: choice.isCorrect
  })) as [MindMapChoice, MindMapChoice, MindMapChoice];
  return { id: questionId, type: "mind_map", prompt: question.prompt, nodes, choices };
}
