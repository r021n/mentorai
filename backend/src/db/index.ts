import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { env } from "../config/env.js";
import * as schema from "./schema.js";

export const client: Client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

export const db: LibSQLDatabase<typeof schema> = drizzle(client, { schema });

/**
 * Ensures required SQLite tables exist if running locally without running drizzle migrations first.
 */
export async function initTables(): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      pathImage TEXT,
      imageDescription TEXT,
      topicId INTEGER REFERENCES topics(id) ON DELETE CASCADE
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      answer TEXT,
      feedback TEXT,
      score INTEGER DEFAULT 0,
      userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
      questionId INTEGER REFERENCES questions(id) ON DELETE CASCADE,
      topicId INTEGER REFERENCES topics(id) ON DELETE CASCADE
    );
  `);
}
