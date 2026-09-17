import { db } from "../../db/index.js";
import { topics } from "../../db/schema.js";
import { eq, asc } from "drizzle-orm";
import type { TopicInput } from "./topics.schema.js";

export async function getAllTopics() {
  return db.select().from(topics).orderBy(asc(topics.id));
}

export async function getTopicById(id: number) {
  return db.query.topics.findFirst({
    where: eq(topics.id, id),
  });
}

export async function createTopic(input: TopicInput) {
  const [created] = await db.insert(topics).values(input).returning();
  return created;
}

export async function updateTopic(id: number, input: TopicInput) {
  const [updated] = await db
    .update(topics)
    .set({ name: input.name })
    .where(eq(topics.id, id))
    .returning();
  return updated;
}

export async function deleteTopic(id: number) {
  const [deleted] = await db.delete(topics).where(eq(topics.id, id)).returning();
  return deleted;
}
