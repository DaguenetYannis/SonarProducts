export type ShufflableChoice = Readonly<{
  id: string;
  isCorrect: boolean;
}>;

export function shuffleChoices<TChoice extends ShufflableChoice>(choices: readonly TChoice[], seedText: string): TChoice[] {
  if (choices.length < 2) return [...choices];

  const shuffled = [...choices];
  let state = hashSeed(seedText);
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  const correctIndex = shuffled.findIndex((choice) => choice.isCorrect);
  if (correctIndex === 0) {
    const targetIndex = 1 + (state % (shuffled.length - 1));
    [shuffled[0], shuffled[targetIndex]] = [shuffled[targetIndex], shuffled[0]];
  }

  return shuffled;
}

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
