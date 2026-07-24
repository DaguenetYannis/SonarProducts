"use client";

import type { MindMapQuestion, QuestionAttemptState } from "@/domain/entities/question";
import { ChoiceButton } from "@/components/questions/ChoiceButton";

type MindMapQuestionViewProps = Readonly<{
  question: MindMapQuestion;
  attempt: QuestionAttemptState;
  disabled: boolean;
  onAnswer: (answerId: string) => void;
}>;

export function MindMapQuestionView({ question, attempt, disabled, onAnswer }: MindMapQuestionViewProps) {
  const correctChoice = question.choices.find((choice) => choice.isCorrect);
  const targetFilled = attempt.eventuallyCorrect || Boolean(attempt.revealedAnswerId);

  return (
    <section className="grid gap-5" aria-labelledby="mindmap-prompt">
      <h2 id="mindmap-prompt" className="text-2xl font-semibold leading-tight">{question.prompt}</h2>
      <div className="rounded-lg border border-line bg-ink p-4 sm:p-5">
        <div className="grid gap-3">
          {question.nodes.map((node) => (
            <div key={node.id} className={`rounded-lg border px-4 py-3 ${node.isTarget ? "border-dashed border-good" : "border-line"}`}>
              <span className="text-sm text-slate-400">{node.parentId ? "Child" : "Parent"}</span>
              <p className="mt-1 text-lg leading-7">{node.isTarget ? (targetFilled ? correctChoice?.label : "Empty slot") : node.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-3">
        {question.choices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            id={choice.id}
            label={choice.label}
            disabled={disabled || attempt.selectedAnswerIds.includes(choice.id) || attempt.status === "completed"}
            selected={attempt.selectedAnswerIds.includes(choice.id)}
            correct={choice.isCorrect}
            revealed={attempt.revealedAnswerId === choice.id || (attempt.eventuallyCorrect && choice.isCorrect)}
            onChoose={onAnswer}
          />
        ))}
      </div>
      <output className="text-sm text-slate-300">{attempt.status === "first_error" ? "That slot is still open." : " "}</output>
    </section>
  );
}
