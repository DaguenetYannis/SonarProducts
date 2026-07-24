export const transitionConfig = {
  mindMapCorrectHoldMs: 3000,
  failedAnswerRevealMs: 2000,
  standardCorrectFeedbackMs: 1500,
  fadeDurationMs: 250
} as const;

export type TransitionConfig = typeof transitionConfig;
