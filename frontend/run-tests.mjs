// In-process test runner for Frontend unit & integration tests
console.log("=== Running MentorAI Frontend Tests ===");

console.log("\n[1/5] Running Validation Unit Tests...");
await import("./tests/unit/validation.test.ts");

console.log("[2/5] Running Typewriter Unit Tests...");
await import("./tests/unit/typewriter.test.ts");

console.log("[3/5] Running Exercise Store Unit Tests...");
await import("./tests/unit/exercise-store.test.ts");

console.log("[4/5] Running Toast Store Unit Tests...");
await import("./tests/unit/toast-store.test.ts");

console.log("[5/5] Running API & Domain Integration Tests...");
await import("./tests/integration/api-integration.test.ts");

console.log("\nAll frontend test suites registered and executing!\n");
