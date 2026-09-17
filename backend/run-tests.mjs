// Runner that executes all unit and integration tests cleanly in-process
console.log("=== Running MentorAI Backend Tests ===");

console.log("\n[1/8] Running Gemini Unit Tests...");
await import("./dist/tests/unit/gemini.test.js");

console.log("[2/8] Running Excel Unit Tests...");
await import("./dist/tests/unit/excel.test.js");

console.log("[3/8] Running Validation Unit Tests...");
await import("./dist/tests/unit/validation.test.js");

console.log("[4/8] Running Auth Integration Tests...");
await import("./dist/tests/integration/auth.integration.test.js");

console.log("[5/8] Running Topics Integration Tests...");
await import("./dist/tests/integration/topics.integration.test.js");

console.log("[6/8] Running Questions Integration Tests...");
await import("./dist/tests/integration/questions.integration.test.js");

console.log("[7/8] Running Exercise & My-Answers Integration Tests...");
await import("./dist/tests/integration/exercise.integration.test.js");

console.log("[8/8] Running Admin Reports & Database Integration Tests...");
await import("./dist/tests/integration/admin.integration.test.js");

console.log("\nAll test suites registered and executing!\n");
