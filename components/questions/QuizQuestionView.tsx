"use client";

import type { QuizQuestion, QuestionAttemptState } from "@/domain/entities/question";
import { ChoiceButton } from "@/components/questions/ChoiceButton";

type QuizQuestionViewProps = Readonly<{
  question: QuizQuestion;
  attempt: QuestionAttemptState;
  disabled: boolean;
  onAnswer: (answerId: string) => void;
}>;

type StatusTextProps = Readonly<{
  attempt: QuestionAttemptState;
}>;

export function QuizQuestionView({ question, attempt, disabled, onAnswer }: QuizQuestionViewProps) {
  return (
    <section className="grid gap-5" aria-labelledby="quiz-prompt">
      <h2 id="quiz-prompt" className="text-2xl font-semibold leading-tight">{question.prompt}</h2>
      <div className="grid gap-3">
        {question.choices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            id={choice.id}
            label={choice.label}
            disabled={disabled || attempt.selectedAnswerIds.includes(choice.id) || attempt.status === "completed"}
            selected={attempt.selectedAnswerIds.includes(choice.id)}
            correct={choice.isCorrect}
            revealed={attempt.revealedAnswerId === choice.id}
            onChoose={onAnswer}
          />
        ))}
      </div>
      <StatusText attempt={attempt} />
    </section>
  );
}

function StatusText({ attempt }: StatusTextProps) {
  if (attempt.status === "first_error") return <output className="text-sm text-warn">Try once more.</output>;
  if (attempt.status === "completed" && attempt.eventuallyCorrect) return <output className="text-sm text-good">Correct.</output>;
  if (attempt.status === "completed" && !attempt.eventuallyCorrect) return <output className="text-sm text-bad">Answer revealed.</output>;
  return <output className="sr-only">Question active</output>;
}
