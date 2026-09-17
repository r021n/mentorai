import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { submitAnswerSchema, requestFeedbackSchema } from "./exercise.schema.js";
import * as exerciseService from "./exercise.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { sendSuccess, sendError } from "../../utils/response.js";

const exerciseRoutes = new Hono();

exerciseRoutes.use("*", authMiddleware);

// GET /api/exercise/topics - List topics for exercise
exerciseRoutes.get("/topics", async (c) => {
  const topics = await exerciseService.getExerciseTopics();
  return sendSuccess(c, topics);
});

// GET /api/exercise/:topicId - Get exercise page data (questions + user's answers)
exerciseRoutes.get("/:topicId", async (c) => {
  const topicId = Number(c.req.param("topicId"));
  if (isNaN(topicId)) {
    return sendError(c, "ID topik tidak valid", 400);
  }

  const user = c.get("user");
  const data = await exerciseService.getExerciseData(topicId, user.id);

  if (!data) {
    return sendError(c, "Topik tidak ditemukan", 404);
  }

  return sendSuccess(c, data);
});

// POST /api/exercise/:topicId/submit - Stage 1: Submit student answer
exerciseRoutes.post(
  "/:topicId/submit",
  zValidator("json", submitAnswerSchema, (result, c) => {
    if (!result.success) {
      return sendError(c, result.error.errors[0]?.message || "Validasi jawaban gagal", 400);
    }
  }),
  async (c) => {
    const topicId = Number(c.req.param("topicId"));
    if (isNaN(topicId)) {
      return sendError(c, "ID topik tidak valid", 400);
    }

    const user = c.get("user");
    const { questionId, answer } = c.req.valid("json");

    try {
      const created = await exerciseService.submitStudentAnswer(topicId, user.id, questionId, answer);
      return sendSuccess(c, { answerId: created.id }, "Jawaban berhasil disimpan.");
    } catch (err: any) {
      return sendError(c, err.message || "Gagal menyimpan jawaban", 400);
    }
  }
);

// POST /api/exercise/:topicId/feedback - Stage 2: Request AI feedback
exerciseRoutes.post(
  "/:topicId/feedback",
  zValidator("json", requestFeedbackSchema, (result, c) => {
    if (!result.success) {
      return sendError(c, result.error.errors[0]?.message || "Validasi request feedback gagal", 400);
    }
  }),
  async (c) => {
    const topicId = Number(c.req.param("topicId"));
    if (isNaN(topicId)) {
      return sendError(c, "ID topik tidak valid", 400);
    }

    const user = c.get("user");
    const { questionId } = c.req.valid("json");

    try {
      const evalResult = await exerciseService.generateAiFeedback(topicId, user.id, questionId);
      return sendSuccess(c, evalResult);
    } catch (err: any) {
      console.error("AI Feedback generation error:", err);
      const message = err.message.includes("tidak ditemukan")
        ? err.message
        : "Gagal menghasilkan feedback. Pastikan AI tidak dalam kondisi limit.";
      const status = err.message.includes("tidak ditemukan") ? 404 : 500;
      return sendError(c, message, status);
    }
  }
);

export default exerciseRoutes;
