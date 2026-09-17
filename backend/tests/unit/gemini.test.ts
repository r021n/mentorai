import { describe, it, expect } from "../test-utils.js";
import { parseFeedbackResponse } from "../../src/services/gemini.service.js";

describe("Gemini Service - parseFeedbackResponse", () => {
  it("should parse standard valid JSON response correctly", () => {
    const raw = JSON.stringify({
      feedback: "Jawaban Anda sangat tepat dan sistematis.",
      score: 3,
    });
    const result = parseFeedbackResponse(raw);
    expect(result.score).toBe(3);
    expect(result.feedback).toBe("Jawaban Anda sangat tepat dan sistematis.");
  });

  it("should extract JSON wrapped in markdown codeblocks", () => {
    const raw = `Berikut hasil evaluasi:
\`\`\`json
{
  "feedback": "Penjelasan konsep sudah benar, namun masih kurang contoh.",
  "score": 2
}
\`\`\`
Terima kasih.`;
    const result = parseFeedbackResponse(raw);
    expect(result.score).toBe(2);
    expect(result.feedback).toContain("Penjelasan konsep sudah benar");
  });

  it("should clamp scores outside 0-3 range", () => {
    const high = JSON.stringify({ feedback: "Luar biasa", score: 5 });
    expect(parseFeedbackResponse(high).score).toBe(3);

    const low = JSON.stringify({ feedback: "Kurang", score: -2 });
    expect(parseFeedbackResponse(low).score).toBe(0);
  });

  it("should use default feedback if feedback is empty", () => {
    const empty = JSON.stringify({ feedback: "", score: 1 });
    const result = parseFeedbackResponse(empty);
    expect(result.feedback).toContain("Maaf, kami tidak dapat memberikan evaluasi saat ini.");
    expect(result.score).toBe(1);
  });

  it("should throw error when rawText is invalid or empty", () => {
    expect(() => parseFeedbackResponse("")).toThrow("Respon Gemini kosong");
    expect(() => parseFeedbackResponse("bukan json sama sekali")).toThrow("Format respon Gemini tidak valid");
  });
});
