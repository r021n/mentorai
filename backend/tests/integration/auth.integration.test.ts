import { describe, it, expect } from "../test-utils.js";
import { app } from "../../src/index.js";
import "./setup.js";

describe("Auth Integration Tests", () => {
  const testUser = {
    username: "siswa_test_1",
    password: "password123",
    confirmPassword: "password123",
  };

  it("POST /api/auth/register - should successfully register a new student", async () => {
    const res = await app.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    expect(res.status).toBe(201);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.message).toContain("Registrasi berhasil");
  });

  it("POST /api/auth/register - should reject duplicate username", async () => {
    const res = await app.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.success).toBe(false);
    expect(body.message).toContain("Username sudah digunakan");
  });

  it("POST /api/auth/login - should authenticate admin and return token + cookie", async () => {
    const res = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "123" }),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.user.username).toBe("admin");
    expect(body.data.user.role).toBe("admin");
    expect(body.data.token).toBeDefined();

    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("token=");
  });

  it("GET /api/auth/me - should return user profile with valid Bearer token", async () => {
    // 1. Login to get token
    const loginRes = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "123" }),
    });
    const { data } = (await loginRes.json()) as any;

    // 2. Call /me with Bearer token
    const meRes = await app.request("/api/auth/me", {
      headers: { Authorization: `Bearer ${data.token}` },
    });

    expect(meRes.status).toBe(200);
    const meBody = (await meRes.json()) as any;
    expect(meBody.success).toBe(true);
    expect(meBody.data.username).toBe("admin");
  });

  it("POST /api/auth/logout - should clear cookie", async () => {
    const loginRes = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "123" }),
    });
    const { data } = (await loginRes.json()) as any;

    const logoutRes = await app.request("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${data.token}` },
    });

    expect(logoutRes.status).toBe(200);
    const setCookie = logoutRes.headers.get("set-cookie");
    expect(setCookie).toBeDefined();
  });
});
