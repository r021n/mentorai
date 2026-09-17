import { Hono } from "hono";
import * as adminDbService from "./admin-db.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../middlewares/role.middleware.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const adminDbRoutes = new Hono();

adminDbRoutes.use("*", authMiddleware, requireAdmin);

// ================= USERS MANAGEMENT ================= //
// GET /api/admin/database/users
adminDbRoutes.get("/users", async (c) => {
  const users = await adminDbService.getAllUsers();
  return sendSuccess(c, users);
});

// GET /api/admin/database/users/search?q=
adminDbRoutes.get("/users/search", async (c) => {
  const q = c.req.query("q") || "";
  const users = await adminDbService.searchUsers(q);
  return sendSuccess(c, users);
});

// POST /api/admin/database/users/edit
adminDbRoutes.post("/users/edit", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { id, username, password, role } = body;

  if (!id || !username || !password || !role) {
    return sendError(c, "Semua data user (id, username, password, role) wajib diisi", 400);
  }

  try {
    const updated = await adminDbService.editUser(Number(id), username, password, role);
    if (!updated) {
      return sendError(c, "User tidak ditemukan", 404);
    }
    return sendSuccess(c, updated, "User berhasil diperbarui");
  } catch (err: any) {
    return sendError(c, err.message || "Gagal memperbarui user", 400);
  }
});

// POST /api/admin/database/users/delete
adminDbRoutes.post("/users/delete", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const ids = body.ids;

  if (!Array.isArray(ids)) {
    return sendError(c, "Data tidak valid: ids harus berupa array", 400);
  }

  const deletedCount = await adminDbService.deleteUsers(ids.map(Number));
  return sendSuccess(c, { deletedCount }, "User berhasil dihapus");
});

// ================= ANSWERS MANAGEMENT ================= //
// GET /api/admin/database/answers
adminDbRoutes.get("/answers", async (c) => {
  const userId = c.req.query("userId") ? Number(c.req.query("userId")) : undefined;
  const questionId = c.req.query("questionId") ? Number(c.req.query("questionId")) : undefined;
  const topicId = c.req.query("topicId") ? Number(c.req.query("topicId")) : undefined;

  const answersList = await adminDbService.getAnswers({ userId, questionId, topicId });
  return sendSuccess(c, answersList);
});

// GET /api/admin/database/answers/search
adminDbRoutes.get("/answers/search", async (c) => {
  const userId = c.req.query("userId") ? Number(c.req.query("userId")) : undefined;
  const questionId = c.req.query("questionId") ? Number(c.req.query("questionId")) : undefined;
  const topicId = c.req.query("topicId") ? Number(c.req.query("topicId")) : undefined;

  const answersList = await adminDbService.getAnswers({ userId, questionId, topicId });
  return sendSuccess(c, answersList);
});

// POST /api/admin/database/answers/edit
adminDbRoutes.post("/answers/edit", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { id, answer, feedback, score, userId, questionId, topicId } = body;

  if (!id || userId === undefined || questionId === undefined || topicId === undefined) {
    return sendError(c, "Field id, userId, questionId, dan topicId wajib diisi", 400);
  }

  try {
    const updated = await adminDbService.editAnswer(
      Number(id),
      answer || null,
      feedback || null,
      Number(score) || 0,
      Number(userId),
      Number(questionId),
      Number(topicId)
    );

    if (!updated) {
      return sendError(c, "Jawaban tidak ditemukan", 404);
    }

    return sendSuccess(c, updated, "Jawaban berhasil diperbarui");
  } catch (err: any) {
    return sendError(c, err.message || "Gagal memperbarui jawaban", 400);
  }
});

// POST /api/admin/database/answers/delete
adminDbRoutes.post("/answers/delete", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const ids = body.ids;

  if (!Array.isArray(ids)) {
    return sendError(c, "Data tidak valid: ids harus berupa array", 400);
  }

  const deletedCount = await adminDbService.deleteAnswers(ids.map(Number));
  return sendSuccess(c, { deletedCount }, "Jawaban berhasil dihapus");
});
