import { describe, it, expect, beforeAll } from "../test-utils.js";
import { app } from "../../src/index.js";
import "./setup.js";

describe("Admin Reports & Database Management Integration Tests", () => {
  let adminToken = "";
  let topicId = 0;
  let questionId = 0;
  let testUserId = 0;
  let answerId = 0;

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
        username: "siswa_admin_matrix",
        password: "123",
        confirmPassword: "123",
      }),
    });
    const studentLogin = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "siswa_admin_matrix", password: "123" }),
    });
    const studentBody = (await studentLogin.json()) as any;
    const studentToken = studentBody.data.token;
    testUserId = studentBody.data.user.id;

    // 3. Create topic & question
    const topicRes = await app.request("/api/topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ name: "Topik Khusus Admin" }),
    });
    const topicBody = (await topicRes.json()) as any;
    topicId = topicBody.data.id;

    const qRes = await app.request(`/api/topics/${topicId}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ question: "Pertanyaan Ujian Admin" }),
    });
    const qBody = (await qRes.json()) as any;
    questionId = qBody.data.id;

    // 4. Submit student answer
    const subRes = await app.request(`/api/exercise/${topicId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        questionId,
        answer: "Ini adalah jawaban lengkap siswa untuk ujian.",
      }),
    });
    const subBody = (await subRes.json()) as any;
    answerId = subBody.data.answerId;
  });

  it("GET /api/admin/topics/:topicId/students-answers - should return matrix of student answers", async () => {
    const res = await app.request(`/api/admin/topics/${topicId}/students-answers`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.questions.length).toBe(1);
    expect(body.data.students.length).toBeGreaterThan(0);
    expect(body.data.students[0].answers[questionId.toString()]).toBeDefined();
  });

  it("GET /api/admin/download/:topicId - should download Excel XLSX stream", async () => {
    const res = await app.request(`/api/admin/download/${topicId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    expect(res.headers.get("Content-Disposition")).toContain(`Laporan_Topic_${topicId}.xlsx`);

    const blob = await res.arrayBuffer();
    expect(blob.byteLength).toBeGreaterThan(0);
  });

  it("GET /api/admin/database/users - should list database users", async () => {
    const res = await app.request("/api/admin/database/users", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.some((u: any) => u.username === "admin")).toBe(true);
  });

  it("GET /api/admin/database/users/search - should filter users by username", async () => {
    const res = await app.request("/api/admin/database/users/search?q=admin_matrix", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.some((u: any) => u.username === "siswa_admin_matrix")).toBe(true);
  });

  it("POST /api/admin/database/answers/edit - should edit answer directly", async () => {
    const res = await app.request("/api/admin/database/answers/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        id: answerId,
        answer: "Jawaban telah diperbaiki langsung di DB",
        feedback: "Feedback manual admin",
        score: 3,
        userId: testUserId,
        questionId,
        topicId,
      }),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.score).toBe(3);
    expect(body.data.feedback).toBe("Feedback manual admin");
  });

  it("POST /api/admin/database/answers/delete - should bulk delete answers", async () => {
    const res = await app.request("/api/admin/database/answers/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ ids: [answerId] }),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.deletedCount).toBe(1);
  });
});
