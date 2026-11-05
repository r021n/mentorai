import { client } from "./index.js";

/**
 * Migration script to apply ON DELETE CASCADE to questions and answers tables.
 * Follows standard SQLite table recreation procedure within a transaction.
 */
export async function migrateCascade(): Promise<void> {
  console.log("Applying ON DELETE CASCADE migration to SQLite schema...");

  const migrationSQL = `
    PRAGMA foreign_keys = OFF;
    BEGIN TRANSACTION;

    -- 1. Recreate questions table with ON DELETE CASCADE
    CREATE TABLE questions_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      pathImage TEXT,
      imageDescription TEXT,
      topicId INTEGER REFERENCES topics(id) ON DELETE CASCADE
    );

    INSERT INTO questions_new (id, question, pathImage, imageDescription, topicId)
    SELECT id, question, pathImage, imageDescription, topicId FROM questions;

    DROP TABLE questions;
    ALTER TABLE questions_new RENAME TO questions;

    -- 2. Recreate answers table with ON DELETE CASCADE
    CREATE TABLE answers_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      answer TEXT,
      feedback TEXT,
      score INTEGER DEFAULT 0,
      userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
      questionId INTEGER REFERENCES questions(id) ON DELETE CASCADE,
      topicId INTEGER REFERENCES topics(id) ON DELETE CASCADE
    );

    INSERT INTO answers_new (id, answer, feedback, score, userId, questionId, topicId)
    SELECT id, answer, feedback, score, userId, questionId, topicId FROM answers;

    DROP TABLE answers;
    ALTER TABLE answers_new RENAME TO answers;

    COMMIT;
    PRAGMA foreign_keys = ON;
  `;

  await client.executeMultiple(migrationSQL);
  console.log("Migration completed: questions and answers now have ON DELETE CASCADE.");
}

// Allow direct execution: `npm run db:migrate` or `tsx src/db/migrate-cascade.ts`
if (process.argv[1]?.endsWith("migrate-cascade.ts") || process.argv[1]?.endsWith("migrate-cascade.js")) {
  migrateCascade()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}
