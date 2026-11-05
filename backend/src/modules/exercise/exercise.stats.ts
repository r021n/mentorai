export type ExerciseTopicStatus = "empty" | "not_started" | "in_progress" | "completed";

export interface TopicProgressInput {
  questionCount: number;
  answeredCount: number;
  totalScore: number;
}

export interface TopicProgress {
  questionCount: number;
  answeredCount: number;
  totalScore: number;
  maxPossibleScore: number;
  scorePercentage: number;
  status: ExerciseTopicStatus;
}

const MAX_SCORE_PER_QUESTION = 3;

/**
 * Single source of truth for topic progress. Kept pure so it can be reused by
 * reports and unit-tested without a database.
 */
export function computeTopicProgress(input: TopicProgressInput): TopicProgress {
  const questionCount = Math.max(0, input.questionCount);
  const answeredCount = Math.min(questionCount, Math.max(0, input.answeredCount));
  const totalScore = Math.max(0, input.totalScore);
  const maxPossibleScore = questionCount * MAX_SCORE_PER_QUESTION;
  const scorePercentage =
    maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  let status: ExerciseTopicStatus = "not_started";
  if (questionCount === 0) {
    status = "empty";
  } else if (answeredCount >= questionCount) {
    status = "completed";
  } else if (answeredCount > 0) {
    status = "in_progress";
  }

  return {
    questionCount,
    answeredCount,
    totalScore,
    maxPossibleScore,
    scorePercentage,
    status,
  };
}
