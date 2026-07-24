import { describe, expect, it } from "vitest";
import { DeterministicQuestionOrderingService } from "@/domain/services/QuestionOrderingService";

describe("QuestionOrderingService", () => {
  it("reshuffles level retries when another valid order exists", () => {
    const first = new DeterministicQuestionOrderingService(1).createOrder(["a", "b", "c"]);
    const retry = new DeterministicQuestionOrderingService(1).createOrder(["a", "b", "c"], [first]);
    expect(retry).not.toEqual(first);
    expect([...retry].sort()).toEqual(["a", "b", "c"]);
  });
});
