import { describe, it, expect, beforeAll } from "../test-utils.js";
import { app } from "../../src/index.js";
import "./setup.js";

describe("Topics Integration Tests", () => {
  let adminToken = "";
  let studentToken = "";
  let createdTopicId = 0;

  beforeAll(async () => {
    // Login as admin
    const adminLogin = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "123" }),
    });
    const adminBody = (await adminLogin.json()) as any;
    adminToken = adminBody.data.token;

    // Register & Login as student
    await app.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "siswa_topics",
        password: "123",
        confirmPassword: "123",
      }),
    });
    const studentLogin = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "siswa_topics", password: "123" }),
    });
    const studentBody = (await studentLogin.json()) as any;
    studentToken = studentBody.data.token;
  });

  it("POST /api/topics - should reject non-admin users with 403", async () => {
    const res = await app.request("/api/topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ name: "Topik Terlarang" }),
    });

    expect(res.status).toBe(403);
  });

  it("POST /api/topics - should allow admin to create topic", async () => {
    const res = await app.request("/api/topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ name: "Pemrograman Python Dasar" }),
    });

    expect(res.status).toBe(201);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.name).toBe("Pemrograman Python Dasar");
    createdTopicId = body.data.id;
  });

  it("GET /api/topics - should allow authenticated users to list topics", async () => {
    const res = await app.request("/api/topics", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.some((t: any) => t.name === "Pemrograman Python Dasar")).toBe(true);
  });

  it("GET /api/topics/:id - should get topic detail", async () => {
    const res = await app.request(`/api/topics/${createdTopicId}`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(createdTopicId);
  });

  it("PUT /api/topics/:id - should allow admin to update topic", async () => {
    const res = await app.request(`/api/topics/${createdTopicId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ name: "Pemrograman Python Lanjutan" }),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.data.name).toBe("Pemrograman Python Lanjutan");
  });

  it("DELETE /api/topics/:id - should allow admin to delete topic", async () => {
    const res = await app.request(`/api/topics/${createdTopicId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.message).toContain("berhasil dihapus");
  });
});
