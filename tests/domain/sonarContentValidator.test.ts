import { describe, expect, it } from "vitest";
import { validateSonarContent } from "@/scripts/validate-sonar-content";

const pattern = ["quiz", "flashcard", "quiz", "flashcard", "quiz", "quiz", "flashcard", "quiz", "flashcard", "quiz", "quiz", "flashcard", "quiz", "flashcard", "quiz", "flashcard", "quiz", "flashcard"] as const;

const validLevel = (slug: string) => ({
  slug,
  title: slug,
  topicSlugs: ["sonar"],
  questions: pattern.map((type, index) => type === "quiz"
    ? {
        type,
        key: `${slug}-quiz-${index}`,
        prompt: "Prompt",
        choices: [
          { key: "choice-a", label: "A", isCorrect: true },
          { key: "choice-b", label: "B", isCorrect: false },
          { key: "choice-c", label: "C", isCorrect: false }
        ]
      }
    : {
        type,
        key: `${slug}-flashcard-${index}`,
        prompt: "Prompt",
        front: "Front",
        back: "Back"
      })
});

describe("validateSonarContent", () => {
  it("accepts three mixed levels with 54 questions", () => {
    const result = validateSonarContent({
      topics: [{ slug: "sonar", title: "Sonar" }],
      levels: [validLevel("level-one"), validLevel("level-two"), validLevel("level-three")]
    });
    expect(result.totalQuestions).toBe(54);
  });

  it("rejects mind-map questions", () => {
    const content = { topics: [{ slug: "sonar", title: "Sonar" }], levels: [validLevel("level-one"), validLevel("level-two"), validLevel("level-three")] };
    content.levels[0].questions[0] = { type: "mind_map", key: "bad-map", prompt: "Map" } as never;
    expect(() => validateSonarContent(content)).toThrow();
  });

  it("rejects grouped question types", () => {
    const level = validLevel("level-one");
    level.questions.sort((a, b) => a.type.localeCompare(b.type));
    expect(() => validateSonarContent({ topics: [{ slug: "sonar", title: "Sonar" }], levels: [level, validLevel("level-two"), validLevel("level-three")] })).toThrow(/groups question types/);
  });

  it("rejects invalid quiz choice counts", () => {
    const content = { topics: [{ slug: "sonar", title: "Sonar" }], levels: [validLevel("level-one"), validLevel("level-two"), validLevel("level-three")] };
    const first = content.levels[0].questions[0];
    if (first.type === "quiz") first.choices = first.choices.slice(0, 2);
    expect(() => validateSonarContent(content)).toThrow();
  });
});
