import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Integration tests clear tables. Never let them point at the development DB.
if (!process.env.DATABASE_URL || process.env.DATABASE_URL === "file:./db.sqlite") {
  const testDatabaseDir = mkdtempSync(join(tmpdir(), "mentorai-backend-test-"));
  process.env.DATABASE_URL = `file:${join(testDatabaseDir, "test.sqlite")}`;
  process.on("exit", () => rmSync(testDatabaseDir, { recursive: true, force: true }));
  console.log(`Using temporary test database: ${process.env.DATABASE_URL}`);
}

// Runner that executes all unit and integration tests cleanly in-process
console.log("=== Running MentorAI Backend Tests ===");

console.log("\n[1/9] Running Gemini Unit Tests...");
await import("./dist/tests/unit/gemini.test.js");

console.log("[2/9] Running Excel Unit Tests...");
await import("./dist/tests/unit/excel.test.js");

console.log("[3/9] Running Validation Unit Tests...");
await import("./dist/tests/unit/validation.test.js");

console.log("[4/9] Running Exercise Stats Unit Tests...");
await import("./dist/tests/unit/exercise-stats.test.js");

console.log("[5/9] Running Auth Integration Tests...");
await import("./dist/tests/integration/auth.integration.test.js");

console.log("[6/9] Running Topics Integration Tests...");
await import("./dist/tests/integration/topics.integration.test.js");

console.log("[7/9] Running Questions Integration Tests...");
await import("./dist/tests/integration/questions.integration.test.js");

console.log("[8/9] Running Exercise & My-Answers Integration Tests...");
await import("./dist/tests/integration/exercise.integration.test.js");

console.log("[9/9] Running Admin Reports & Database Integration Tests...");
await import("./dist/tests/integration/admin.integration.test.js");

console.log("\nAll test suites registered and executing!\n");
