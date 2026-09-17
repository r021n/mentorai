import { db } from "../../db/index.js";
import { users, questions, answers, topics } from "../../db/schema.js";
import { eq, asc } from "drizzle-orm";

export interface StudentAnswersMatrix {
  topic: { id: number; name: string };
  questions: Array<{ id: number; question: string }>;
  students: Array<{
    userId: number;
    username: string;
    totalScore: number;
    percentageScore: number;
    answers: Record<string, { answer: string | null; feedback: string | null; score: number | null }>;
  }>;
}

export async function getStudentsAnswersMatrix(topicId: number): Promise<StudentAnswersMatrix | null> {
  const topic = await db.query.topics.findFirst({
    where: eq(topics.id, topicId),
  });

  if (!topic) {
    return null;
  }

  const topicQuestions = await db
    .select({
      id: questions.id,
      question: questions.question,
    })
    .from(questions)
    .where(eq(questions.topicId, topicId))
    .orderBy(asc(questions.id));

  const answerRows = await db
    .select({
      id: answers.id,
      answer: answers.answer,
      feedback: answers.feedback,
      score: answers.score,
      userId: answers.userId,
      questionId: answers.questionId,
      username: users.username,
    })
    .from(answers)
    .innerJoin(users, eq(answers.userId, users.id))
    .where(eq(answers.topicId, topicId))
    .orderBy(asc(users.id), asc(answers.questionId));

  const studentMap: Record<
    number,
    {
      userId: number;
      username: string;
      totalScore: number;
      answers: Record<string, { answer: string | null; feedback: string | null; score: number | null }>;
    }
  > = {};

  for (const row of answerRows) {
    if (!row.userId) continue;

    if (!studentMap[row.userId]) {
      studentMap[row.userId] = {
        userId: row.userId,
        username: row.username,
        answers: {},
        totalScore: 0,
      };
    }

    if (row.questionId) {
      studentMap[row.userId]!.answers[row.questionId.toString()] = {
        answer: row.answer,
        feedback: row.feedback,
        score: row.score,
      };
    }

    studentMap[row.userId]!.totalScore += row.score || 0;
  }

  const numQuestions = topicQuestions.length;
  const maxPossibleScore = numQuestions * 3;

  const students = Object.values(studentMap).map((s) => ({
    userId: s.userId,
    username: s.username,
    totalScore: s.totalScore,
    percentageScore: maxPossibleScore > 0 ? Math.round((s.totalScore / maxPossibleScore) * 100) : 0,
    answers: s.answers,
  }));

  return {
    topic,
    questions: topicQuestions,
    students,
  };
}
