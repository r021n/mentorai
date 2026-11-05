import { db } from "../../db/index.js";
import { topics, questions, answers } from "../../db/schema.js";
import { eq, and, asc, sql } from "drizzle-orm";
import { computeTopicProgress } from "../exercise/exercise.stats.js";

export async function getStudentAnswersSummary(topicId: number, userId: number) {
  const topic = await db.query.topics.findFirst({
    where: eq(topics.id, topicId),
  });

  if (!topic) {
    return null;
  }

  // 1. Count questions without loading their full text.
  const [questionStats] = await db
    .select({
      totalQuestions: sql<number>`count(${questions.id})`,
    })
    .from(questions)
    .where(eq(questions.topicId, topicId));

  // 2. Get the student's answers with question text for the report table.
  const userAnswers = await db
    .select({
      id: answers.id,
      questionId: answers.questionId,
      questionText: questions.question,
      answer: answers.answer,
      feedback: answers.feedback,
      score: answers.score,
    })
    .from(answers)
    .innerJoin(questions, eq(answers.questionId, questions.id))
    .where(and(eq(answers.topicId, topicId), eq(answers.userId, userId)))
    .orderBy(asc(answers.id));

  const totalScore = userAnswers.reduce((sum, item) => sum + (item.score || 0), 0);
  const progress = computeTopicProgress({
    questionCount: Number(questionStats?.totalQuestions ?? 0),
    answeredCount: userAnswers.length,
    totalScore,
  });

  return {
    topicId,
    topic: { id: topic.id, name: topic.name },
    totalQuestions: progress.questionCount,
    answeredQuestions: progress.answeredCount,
    answers: userAnswers,
    totalScore: progress.totalScore,
    maxPossibleScore: progress.maxPossibleScore,
    scorePercentage: progress.scorePercentage,
  };
}
