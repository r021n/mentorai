import { describe, it, expect, beforeAll } from "../test-utils.js";
import { app } from "../../src/index.js";
import "./setup.js";

describe("Questions Integration Tests", () => {
  let adminToken = "";
  let topicId = 0;
  let questionId = 0;

  beforeAll(async () => {
    // Admin login
    const adminLogin = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "123" }),
    });
    const adminBody = (await adminLogin.json()) as any;
    adminToken = adminBody.data.token;

    // Create a topic
    const topicRes = await app.request("/api/topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ name: "Topik Untuk Soal" }),
    });
    const topicBody = (await topicRes.json()) as any;
    topicId = topicBody.data.id;
  });

  it("POST /api/topics/:topicId/questions - should create question (JSON)", async () => {
    const res = await app.request(`/api/topics/${topicId}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        question: "<p>Jelaskan pengertian variabel dalam pemrograman!</p>",
        imageDescription: "Diagram memori variabel",
      }),
    });

    expect(res.status).toBe(201);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.question).toContain("Jelaskan pengertian variabel");
    questionId = body.data.id;
  });

  it("GET /api/topics/:topicId/questions - should list questions in topic", async () => {
    const res = await app.request(`/api/topics/${topicId}/questions`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].id).toBe(questionId);
  });

  it("GET /api/questions/:id - should get question detail", async () => {
    const res = await app.request(`/api/questions/${questionId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(questionId);
  });

  it("PUT /api/questions/:id - should update question", async () => {
    const res = await app.request(`/api/questions/${questionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        question: "<p>Jelaskan apa itu fungsi rekursif?</p>",
      }),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.data.question).toContain("fungsi rekursif");
  });

  it("DELETE /api/questions/:id - should delete question", async () => {
    const res = await app.request(`/api/questions/${questionId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
  });
});
