import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LearningSession } from "@/components/learning/LearningSession";
import { mixedQuestions } from "@/tests/fixtures/questions";
import { transitionConfig } from "@/lib/transitionConfig";

describe("LearningSession timers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("cleans pending timers on unmount", () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(globalThis, "clearTimeout");
    const view = render(<LearningSession levelId="level" title="Level" topics={["Topic"]} questions={mixedQuestions} />);
    fireEvent.click(screen.getByRole("button", { name: "Correct choice" }));
    view.unmount();
    expect(clearSpy).toHaveBeenCalled();
  });

  it("uses the 3 second mind-map completion hold", () => {
    vi.useFakeTimers();
    render(<LearningSession levelId="level" title="Level" topics={["Topic"]} questions={[mixedQuestions[2]]} />);
    fireEvent.click(screen.getByRole("button", { name: "Correct choice" }));
    expect(screen.getByRole("button", { name: "Choice 1" })).toBeDisabled();
    act(() => {
      vi.advanceTimersByTime(transitionConfig.mindMapCorrectHoldMs);
    });
    expect(screen.getByText("Level complete")).toBeInTheDocument();
  });
});
