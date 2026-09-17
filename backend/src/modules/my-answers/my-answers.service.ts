import { db } from "../../db/index.js";
import { questions, answers } from "../../db/schema.js";
import { eq, and, asc } from "drizzle-orm";

export async function getStudentAnswersSummary(topicId: number, userId: number) {
  // 1. Get all questions in topic to compute total possible score
  const topicQuestions = await db
    .select({
      id: questions.id,
      question: questions.question,
    })
    .from(questions)
    .where(eq(questions.topicId, topicId))
    .orderBy(asc(questions.id));

  // 2. Get student answers with question text
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
  const maxPossibleScore = topicQuestions.length * 3;
  const percentageScore =
    maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  return {
    topicId,
    answers: userAnswers,
    totalScore,
    maxPossibleScore,
    percentageScore,
  };
}
