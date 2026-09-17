import { db } from "../../db/index.js";
import { users, answers } from "../../db/schema.js";
import { eq, like, inArray, and, asc } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Users Management
export async function getAllUsers() {
  return db
    .select({
      id: users.id,
      username: users.username,
      password: users.password,
      role: users.role,
    })
    .from(users)
    .orderBy(asc(users.id));
}

export async function searchUsers(query: string) {
  if (!query) {
    return getAllUsers();
  }
  return db
    .select({
      id: users.id,
      username: users.username,
      password: users.password,
      role: users.role,
    })
    .from(users)
    .where(like(users.username, `%${query}%`))
    .orderBy(asc(users.id));
}

export async function editUser(id: number, username: string, password: string, role: string) {
  let finalPassword = password;
  // If password doesn't look like bcrypt hash, hash it
  if (!password.startsWith("$2a$") && !password.startsWith("$2b$") && !password.startsWith("$argon2")) {
    finalPassword = await bcrypt.hash(password, 10);
  }

  const [updated] = await db
    .update(users)
    .set({
      username,
      password: finalPassword,
      role,
    })
    .where(eq(users.id, id))
    .returning();

  return updated;
}

export async function deleteUsers(ids: number[]) {
  if (ids.length === 0) return 0;
  const result = await db.delete(users).where(inArray(users.id, ids)).returning();
  return result.length;
}

// Answers Management
export interface AnswerFilter {
  userId?: number;
  questionId?: number;
  topicId?: number;
}

export async function getAnswers(filter: AnswerFilter = {}) {
  const conditions = [];
  if (filter.userId) conditions.push(eq(answers.userId, filter.userId));
  if (filter.questionId) conditions.push(eq(answers.questionId, filter.questionId));
  if (filter.topicId) conditions.push(eq(answers.topicId, filter.topicId));

  const query = db.select().from(answers);
  if (conditions.length > 0) {
    return query.where(and(...conditions)).orderBy(asc(answers.id));
  }
  return query.orderBy(asc(answers.id));
}

export async function editAnswer(
  id: number,
  answerText: string | null,
  feedback: string | null,
  score: number,
  userId: number,
  questionId: number,
  topicId: number
) {
  const [updated] = await db
    .update(answers)
    .set({
      answer: answerText,
      feedback,
      score,
      userId,
      questionId,
      topicId,
    })
    .where(eq(answers.id, id))
    .returning();

  return updated;
}

export async function deleteAnswers(ids: number[]) {
  if (ids.length === 0) return 0;
  const result = await db.delete(answers).where(inArray(answers.id, ids)).returning();
  return result.length;
}
