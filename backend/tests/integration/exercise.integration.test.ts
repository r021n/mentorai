import { describe, it, expect, beforeAll } from "../test-utils.js";
import { app } from "../../src/index.js";
import "./setup.js";

describe("Exercise & My-Answers Integration Tests", () => {
  let adminToken = "";
  let studentToken = "";
  let topicId = 0;
  let questionId = 0;

  beforeAll(async () => {
    // 1. Admin login
    const adminLogin = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "123" }),
    });
    const adminBody = (await adminLogin.json()) as any;
    adminToken = adminBody.data.token;

    // 2. Student register & login
    await app.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "siswa_exercise",
        password: "123",
        confirmPassword: "123",
      }),
    });
    const studentLogin = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "siswa_exercise", password: "123" }),
    });
    const studentBody = (await studentLogin.json()) as any;
    studentToken = studentBody.data.token;

    // 3. Create topic & question
    const topicRes = await app.request("/api/topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ name: "Algoritma Pemrograman" }),
    });
    const topicBody = (await topicRes.json()) as any;
    topicId = topicBody.data.id;

    const qRes = await app.request(`/api/topics/${topicId}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        question: "Jelaskan apa itu algoritma pencarian biner (Binary Search)?",
      }),
    });
    const qBody = (await qRes.json()) as any;
    questionId = qBody.data.id;
  });

  it("GET /api/exercise/topics - should return topics available for exercise", async () => {
    const res = await app.request("/api/exercise/topics", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.some((t: any) => t.id === topicId)).toBe(true);
  });

  it("GET /api/exercise/:topicId - should return questions and current user answers", async () => {
    const res = await app.request(`/api/exercise/${topicId}`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.topic.id).toBe(topicId);
    expect(body.data.questions.length).toBeGreaterThan(0);
    expect(body.data.answers).toEqual([]);
  });

  it("POST /api/exercise/:topicId/submit - should reject answer with less than 2 words", async () => {
    const res = await app.request(`/api/exercise/${topicId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        questionId,
        answer: "Pencarian",
      }),
    });

    expect(res.status).toBe(400);
  });

  it("POST /api/exercise/:topicId/submit - should submit valid answer", async () => {
    const res = await app.request(`/api/exercise/${topicId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        questionId,
        answer: "Binary search adalah algoritma pencarian pada data terurut dengan membagi rentang pencarian menjadi dua.",
      }),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.answerId).toBeDefined();
  });

  it("POST /api/exercise/:topicId/submit - should reject duplicate submission", async () => {
    const res = await app.request(`/api/exercise/${topicId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        questionId,
        answer: "Jawaban kedua yang mencoba mengubah.",
      }),
    });

    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.message).toContain("Anda sudah menjawab soal ini");
  });

  it("GET /api/my-answers/:topicId - should retrieve answers history with score stats", async () => {
    const res = await app.request(`/api/my-answers/${topicId}`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.topicId).toBe(topicId);
    expect(body.data.answers.length).toBe(1);
    expect(body.data.answers[0].questionId).toBe(questionId);
    expect(body.data.maxPossibleScore).toBe(3);
  });
});
