import type { LearningQuestion } from "@/domain/entities/question";

export const mixedQuestions: LearningQuestion[] = [
  {
    id: "question-a",
    type: "quiz",
    prompt: "Question A",
    choices: [
      { id: "choice-1", label: "Choice 1", isCorrect: false },
      { id: "choice-2", label: "Correct choice", isCorrect: true },
      { id: "choice-3", label: "Choice 3", isCorrect: false }
    ]
  },
  {
    id: "question-b",
    type: "flashcard",
    prompt: "Question B",
    front: "Front",
    back: "Back"
  },
  {
    id: "question-c",
    type: "mind_map",
    prompt: "Question C",
    nodes: [
      { id: "node-1", label: "Root", parentId: null, isTarget: false },
      { id: "node-2", label: null, parentId: "node-1", isTarget: true }
    ],
    choices: [
      { id: "map-1", label: "Choice 1", isCorrect: false },
      { id: "map-2", label: "Correct choice", isCorrect: true },
      { id: "map-3", label: "Choice 3", isCorrect: false }
    ]
  }
];
