import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { relations, type InferSelectModel, type InferInsertModel } from "drizzle-orm";

// 1. Table Users
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'admin' | 'siswa'
});

// 2. Table Topics
export const topics = sqliteTable("topics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

// 3. Table Questions
export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  pathImage: text("pathImage"),
  imageDescription: text("imageDescription"),
  topicId: integer("topicId").references(() => topics.id, { onDelete: "cascade" }),
});

// 4. Table Answers
export const answers = sqliteTable("answers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  answer: text("answer"),
  feedback: text("feedback"),
  score: integer("score").default(0),
  userId: integer("userId").references(() => users.id, { onDelete: "cascade" }),
  questionId: integer("questionId").references(() => questions.id, { onDelete: "cascade" }),
  topicId: integer("topicId").references(() => topics.id, { onDelete: "cascade" }),
});

// Relations Definitions for Drizzle Relational Queries
export const usersRelations = relations(users, ({ many }) => ({
  answers: many(answers),
}));

export const topicsRelations = relations(topics, ({ many }) => ({
  questions: many(questions),
  answers: many(answers),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  topic: one(topics, {
    fields: [questions.topicId],
    references: [topics.id],
  }),
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  user: one(users, {
    fields: [answers.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
  topic: one(topics, {
    fields: [answers.topicId],
    references: [topics.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Topic = InferSelectModel<typeof topics>;
export type NewTopic = InferInsertModel<typeof topics>;
export type Question = InferSelectModel<typeof questions>;
export type NewQuestion = InferInsertModel<typeof questions>;
export type Answer = InferSelectModel<typeof answers>;
export type NewAnswer = InferInsertModel<typeof answers>;
