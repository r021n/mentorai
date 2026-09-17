import { db } from "../../db/index.js";
import { questions } from "../../db/schema.js";
import { eq, asc } from "drizzle-orm";
import { deleteUploadedFile } from "../../services/storage.service.js";

export interface CreateQuestionInput {
  question: string;
  topicId: number;
  pathImage?: string | null;
  imageDescription?: string | null;
}

export interface UpdateQuestionInput {
  question?: string;
  pathImage?: string | null;
  imageDescription?: string | null;
}

export async function getQuestionsByTopic(topicId: number) {
  return db
    .select()
    .from(questions)
    .where(eq(questions.topicId, topicId))
    .orderBy(asc(questions.id));
}

export async function getQuestionById(id: number) {
  return db.query.questions.findFirst({
    where: eq(questions.id, id),
  });
}

export async function createQuestion(input: CreateQuestionInput) {
  const [created] = await db
    .insert(questions)
    .values({
      question: input.question,
      topicId: input.topicId,
      pathImage: input.pathImage || null,
      imageDescription: input.imageDescription || null,
    })
    .returning();
  return created;
}

export async function updateQuestion(id: number, input: UpdateQuestionInput) {
  const existing = await getQuestionById(id);
  if (!existing) {
    return null;
  }

  // If a new image is provided and old image exists, clean up old image
  if (input.pathImage && existing.pathImage && existing.pathImage !== input.pathImage) {
    await deleteUploadedFile(existing.pathImage);
  }

  const updateData: Partial<typeof questions.$inferInsert> = {};
  if (input.question !== undefined) updateData.question = input.question;
  if (input.pathImage !== undefined) updateData.pathImage = input.pathImage;
  if (input.imageDescription !== undefined) updateData.imageDescription = input.imageDescription;

  const [updated] = await db
    .update(questions)
    .set(updateData)
    .where(eq(questions.id, id))
    .returning();

  return updated;
}

export async function deleteQuestion(id: number) {
  const existing = await getQuestionById(id);
  if (!existing) {
    return null;
  }

  if (existing.pathImage) {
    await deleteUploadedFile(existing.pathImage);
  }

  const [deleted] = await db.delete(questions).where(eq(questions.id, id)).returning();
  return deleted;
}
