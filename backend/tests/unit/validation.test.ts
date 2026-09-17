import { describe, it, expect } from "../test-utils.js";
import { registerSchema, loginSchema } from "../../src/modules/auth/auth.schema.js";
import { topicSchema } from "../../src/modules/topics/topics.schema.js";
import { submitAnswerSchema } from "../../src/modules/exercise/exercise.schema.js";

describe("Zod Validation Schemas", () => {
  it("should validate valid register input", () => {
    const valid = {
      username: "siswa_baru",
      password: "password123",
      confirmPassword: "password123",
    };
    const result = registerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should validate valid login input", () => {
    const valid = { username: "admin", password: "123" };
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  it("should reject register if password mismatch", () => {
    const invalid = {
      username: "siswa_baru",
      password: "password123",
      confirmPassword: "password456",
    };
    const result = registerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]?.message).toBe("Password dan konfirmasi password tidak sama");
    }
  });

  it("should validate topic schema", () => {
    expect(topicSchema.safeParse({ name: "Matematika" }).success).toBe(true);
    expect(topicSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("should require at least 2 words for answer submission", () => {
    expect(submitAnswerSchema.safeParse({ questionId: 1, answer: "Satu" }).success).toBe(false);
    expect(submitAnswerSchema.safeParse({ questionId: 1, answer: "Satu dua" }).success).toBe(true);
  });
});
