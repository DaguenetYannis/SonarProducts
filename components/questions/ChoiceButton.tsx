"use client";

interface ChoiceButtonProps {
  id: string;
  label: string;
  disabled: boolean;
  selected: boolean;
  correct: boolean;
  revealed: boolean;
  onChoose: (id: string) => void;
}

export function ChoiceButton({ id, label, disabled, selected, correct, revealed, onChoose }: ChoiceButtonProps) {
  const stateClass = revealed && correct
    ? "border-good bg-good/10"
    : selected
      ? "border-warn bg-warn/10"
      : "border-line bg-ink hover:border-slate-400";

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={() => onChoose(id)}
      className={`min-h-14 rounded-lg border px-4 py-3 text-left text-base leading-6 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 ${stateClass}`}
    >
      {label}
    </button>
  );
}
