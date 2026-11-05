import { describe, it, expect } from "../test-utils.js";
import { computeTopicProgress } from "../../src/modules/exercise/exercise.stats.js";

describe("Exercise Topic Progress", () => {
  it("marks a topic without questions as empty", () => {
    const progress = computeTopicProgress({
      questionCount: 0,
      answeredCount: 0,
      totalScore: 0,
    });

    expect(progress.status).toBe("empty");
    expect(progress.maxPossibleScore).toBe(0);
    expect(progress.scorePercentage).toBe(0);
  });

  it("marks an untouched topic as not started", () => {
    const progress = computeTopicProgress({
      questionCount: 4,
      answeredCount: 0,
      totalScore: 0,
    });

    expect(progress.status).toBe("not_started");
    expect(progress.maxPossibleScore).toBe(12);
    expect(progress.scorePercentage).toBe(0);
  });

  it("computes partial progress and percentage", () => {
    const progress = computeTopicProgress({
      questionCount: 4,
      answeredCount: 2,
      totalScore: 4,
    });

    expect(progress.status).toBe("in_progress");
    expect(progress.maxPossibleScore).toBe(12);
    expect(progress.scorePercentage).toBe(33);
  });

  it("marks a fully answered topic as completed", () => {
    const progress = computeTopicProgress({
      questionCount: 3,
      answeredCount: 3,
      totalScore: 8,
    });

    expect(progress.status).toBe("completed");
    expect(progress.scorePercentage).toBe(89);
  });

  it("clamps inconsistent answer and score counts", () => {
    const progress = computeTopicProgress({
      questionCount: 2,
      answeredCount: 5,
      totalScore: -1,
    });

    expect(progress.status).toBe("completed");
    expect(progress.answeredCount).toBe(2);
    expect(progress.totalScore).toBe(0);
  });
});
