import { db } from "../../db/index.js";
import { topics, questions, answers } from "../../db/schema.js";
import { eq, and, asc } from "drizzle-orm";
import { evaluateStudentAnswer } from "../../services/gemini.service.js";

export async function getExerciseTopics() {
  return db.select().from(topics).orderBy(asc(topics.id));
}

export async function getExerciseData(topicId: number, userId: number) {
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
      pathImage: questions.pathImage,
      imageDescription: questions.imageDescription,
    })
    .from(questions)
    .where(eq(questions.topicId, topicId))
    .orderBy(asc(questions.id));

  const userAnswers = await db
    .select({
      id: answers.id,
      questionId: answers.questionId,
      answer: answers.answer,
      feedback: answers.feedback,
      score: answers.score,
    })
    .from(answers)
    .where(and(eq(answers.topicId, topicId), eq(answers.userId, userId)))
    .orderBy(asc(answers.id));

  return {
    topic,
    questions: topicQuestions,
    answers: userAnswers,
  };
}

export async function submitStudentAnswer(topicId: number, userId: number, questionId: number, answerText: string) {
  // Check if answer already exists
  const existing = await db.query.answers.findFirst({
    where: and(
      eq(answers.userId, userId),
      eq(answers.questionId, questionId),
      eq(answers.topicId, topicId)
    ),
  });

  if (existing) {
    throw new Error("Anda sudah menjawab soal ini dan tidak dapat mengubahnya.");
  }

  const [created] = await db
    .insert(answers)
    .values({
      answer: answerText,
      feedback: null,
      score: 0,
      userId,
      questionId,
      topicId,
    })
    .returning();

  if (!created) {
    throw new Error("Gagal menyimpan jawaban.");
  }

  return created;
}

export async function generateAiFeedback(topicId: number, userId: number, questionId: number) {
  const existingAnswer = await db.query.answers.findFirst({
    where: and(
      eq(answers.userId, userId),
      eq(answers.questionId, questionId),
      eq(answers.topicId, topicId)
    ),
  });

  if (!existingAnswer) {
    throw new Error("Jawaban tidak ditemukan.");
  }

  // If feedback already generated, return cached feedback
  if (existingAnswer.feedback) {
    return {
      feedback: existingAnswer.feedback,
      score: existingAnswer.score ?? 0,
    };
  }

  // Get question data
  const questionData = await db.query.questions.findFirst({
    where: eq(questions.id, questionId),
  });

  if (!questionData) {
    throw new Error("Soal tidak ditemukan.");
  }

  const evalResult = await evaluateStudentAnswer(
    questionData.question,
    questionData.imageDescription,
    existingAnswer.answer || ""
  );

  // Update DB with feedback & score
  await db
    .update(answers)
    .set({
      feedback: evalResult.feedback,
      score: evalResult.score,
    })
    .where(eq(answers.id, existingAnswer.id));

  return evalResult;
}
