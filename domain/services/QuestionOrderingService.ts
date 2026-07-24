export interface QuestionOrderingService {
  createOrder(questionIds: string[], previousOrders?: string[][]): string[];
}

export class DeterministicQuestionOrderingService implements QuestionOrderingService {
  constructor(private readonly seed: number = Date.now()) {}

  createOrder(questionIds: string[], previousOrders: string[][] = []): string[] {
    const unique = [...questionIds];
    if (unique.length < 2) return unique;

    const attempts: string[][] = [];
    for (let salt = 0; salt < Math.max(8, unique.length * 2); salt += 1) {
      attempts.push(this.shuffle(unique, this.seed + salt));
    }

    return attempts.find((order) => !previousOrders.some((previous) => sameOrder(previous, order))) ?? attempts[0];
  }

  private shuffle(values: string[], seed = 1): string[] {
    const result = [...values];
    let state = seed;
    for (let index = result.length - 1; index > 0; index -= 1) {
      state = (state * 1664525 + 1013904223) % 4294967296;
      const swapIndex = state % (index + 1);
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }
}

function sameOrder(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}
