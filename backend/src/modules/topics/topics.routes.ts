import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { topicSchema } from "./topics.schema.js";
import * as topicService from "./topics.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../middlewares/role.middleware.js";
import { sendSuccess, sendError } from "../../utils/response.js";

const topicRoutes = new Hono();

// All topic routes require authentication
topicRoutes.use("*", authMiddleware);

// GET /api/topics - List all topics
topicRoutes.get("/", async (c) => {
  const list = await topicService.getAllTopics();
  return sendSuccess(c, list);
});

// POST /api/topics - Create topic (Admin only)
topicRoutes.post(
  "/",
  requireAdmin,
  zValidator("json", topicSchema, (result, c) => {
    if (!result.success) {
      return sendError(c, result.error.errors[0]?.message || "Validasi gagal", 400);
    }
  }),
  async (c) => {
    const input = c.req.valid("json");
    const created = await topicService.createTopic(input);
    return sendSuccess(c, created, "Topik berhasil dibuat", 201);
  }
);

// GET /api/topics/:id - Detail topic
topicRoutes.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return sendError(c, "ID topik tidak valid", 400);
  }

  const topic = await topicService.getTopicById(id);
  if (!topic) {
    return sendError(c, "Topik tidak ditemukan", 404);
  }

  return sendSuccess(c, topic);
});

// PUT /api/topics/:id - Update topic (Admin only)
topicRoutes.put(
  "/:id",
  requireAdmin,
  zValidator("json", topicSchema, (result, c) => {
    if (!result.success) {
      return sendError(c, result.error.errors[0]?.message || "Validasi gagal", 400);
    }
  }),
  async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return sendError(c, "ID topik tidak valid", 400);
    }

    const input = c.req.valid("json");
    const updated = await topicService.updateTopic(id, input);
    if (!updated) {
      return sendError(c, "Topik tidak ditemukan", 404);
    }

    return sendSuccess(c, updated, "Topik berhasil diperbarui");
  }
);

// DELETE /api/topics/:id - Delete topic (Admin only)
topicRoutes.delete("/:id", requireAdmin, async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return sendError(c, "ID topik tidak valid", 400);
  }

  const deleted = await topicService.deleteTopic(id);
  if (!deleted) {
    return sendError(c, "Topik tidak ditemukan", 404);
  }

  return sendSuccess(c, undefined, "Topik berhasil dihapus");
});

export default topicRoutes;
