import { GoogleGenAI } from "@google/genai";
import PQueue from "p-queue";
import { env } from "../config/env.js";

const feedbackQueue = new PQueue({ concurrency: 1 });
const MAX_RETRIES = 2;
const DEFAULT_FEEDBACK = "Maaf, kami tidak dapat memberikan evaluasi saat ini. Silakan coba lagi.";

export interface EvaluationResult {
  feedback: string;
  score: number;
}

export function parseFeedbackResponse(rawText: string): EvaluationResult {
  if (typeof rawText !== "string" || !rawText.trim()) {
    throw new Error("Respon Gemini kosong");
  }

  let candidate = rawText.trim();
  // Strip markdown code fences if model returned ```json ... ```
  if (candidate.includes("```")) {
    const match = candidate.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      candidate = match[1].trim();
    }
  }

  if (!candidate.startsWith("{")) {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      candidate = candidate.slice(start, end + 1);
    }
  }

  let parsed: { feedback?: unknown; score?: unknown };
  try {
    parsed = JSON.parse(candidate);
  } catch {
    throw new Error("Format respon Gemini tidak valid");
  }

  const feedback =
    typeof parsed.feedback === "string" && parsed.feedback.trim()
      ? parsed.feedback.trim()
      : DEFAULT_FEEDBACK;

  const numericScore = Number(parsed.score);
  const score = Number.isFinite(numericScore) ? Math.max(0, Math.min(3, Math.round(numericScore))) : 0;

  return { feedback, score };
}

let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY belum dikonfigurasi pada environment variable.");
    }
    genAIClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }
  return genAIClient;
}

async function generateFeedbackWithRetry(inputText: string, attempt = 0): Promise<string> {
  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: env.GEMINI_MODEL,
      config: { temperature: 0.2 },
      contents: inputText,
    });
    return response.text || "";
  } catch (error) {
    if (attempt >= MAX_RETRIES) {
      throw error;
    }
    const backoff = Math.pow(2, attempt) * 500;
    await new Promise((resolve) => setTimeout(resolve, backoff));
    return generateFeedbackWithRetry(inputText, attempt + 1);
  }
}

export async function evaluateStudentAnswer(
  question: string,
  imageDescription: string | null | undefined,
  studentAnswer: string
): Promise<EvaluationResult> {
  const prompt = `Tugas Anda: nilai jawaban siswa secara objektif.
Output wajib berupa JSON valid tanpa teks tambahan dengan format {"feedback":"...", "score":<0-3>}.
Ketentuan:
- Feedback edukatif maksimal 3 kalimat (lebih pendek lebih baik) dan jangan membocorkan jawaban, arahkan siswa berpikir logis.
- Skor berupa angka 0 hingga 3 sesuai ketepatan jawaban.
Pertanyaan: "${question}"
Gambar pendukung soal: "${imageDescription || "-"}"
Jawaban siswa: "${studentAnswer}"`;

  const rawResponse = await feedbackQueue.add(() => generateFeedbackWithRetry(prompt));
  if (!rawResponse) {
    throw new Error("Respon evaluasi Gemini tidak ditemukan");
  }

  return parseFeedbackResponse(rawResponse);
}
