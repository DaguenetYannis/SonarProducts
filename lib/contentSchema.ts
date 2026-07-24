import { z } from "zod";

const threeChoices = z.array(z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  isCorrect: z.boolean()
})).length(3).refine((choices) => choices.filter((choice) => choice.isCorrect).length === 1, "Exactly one choice must be correct.");

export const importedContentSchema = z.object({
  topics: z.array(z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional()
  })),
  levels: z.array(z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    topicSlugs: z.array(z.string().min(1)).min(1),
    questions: z.array(z.discriminatedUnion("type", [
      z.object({ type: z.literal("quiz"), key: z.string(), prompt: z.string().min(1), choices: threeChoices }),
      z.object({ type: z.literal("flashcard"), key: z.string(), prompt: z.string().min(1), front: z.string().min(1), back: z.string().min(1) }),
      z.object({
        type: z.literal("mind_map"),
        key: z.string(),
        prompt: z.string().min(1),
        nodes: z.array(z.object({
          key: z.string().min(1),
          parentKey: z.string().nullable(),
          label: z.string().nullable(),
          isTarget: z.boolean()
        })).min(2).refine((nodes) => nodes.filter((node) => node.isTarget).length === 1, "Exactly one target blank is supported."),
        choices: threeChoices,
        layoutMetadata: z.record(z.unknown()).optional()
      })
    ])).default([])
  }))
});

export type ImportedContent = z.infer<typeof importedContentSchema>;
