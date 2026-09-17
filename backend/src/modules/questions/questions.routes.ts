import { Hono } from "hono";
import * as questionService from "./questions.service.js";
import { saveUploadedFile } from "../../services/storage.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../middlewares/role.middleware.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const questionRoutes = new Hono();

questionRoutes.use("*", authMiddleware);

// GET /api/topics/:topicId/questions
questionRoutes.get("/topics/:topicId/questions", async (c) => {
  const topicId = Number(c.req.param("topicId"));
  if (isNaN(topicId)) {
    return sendError(c, "ID topik tidak valid", 400);
  }

  const list = await questionService.getQuestionsByTopic(topicId);
  return sendSuccess(c, list);
});

// POST /api/topics/:topicId/questions (Admin only)
questionRoutes.post("/topics/:topicId/questions", requireAdmin, async (c) => {
  const topicId = Number(c.req.param("topicId"));
  if (isNaN(topicId)) {
    return sendError(c, "ID topik tidak valid", 400);
  }

  try {
    let questionText = "";
    let imageDescription: string | null = null;
    let pathImage: string | null = null;

    const contentType = c.req.header("content-type") || "";
    if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const body = await c.req.parseBody();
      questionText = (body["question"] as string) || "";
      imageDescription = (body["imageDescription"] as string) || null;

      const file = body["image"];
      if (file && typeof file === "object" && "arrayBuffer" in file && (file as File).size > 0) {
        pathImage = await saveUploadedFile(file as File);
      }
    } else {
      const json = await c.req.json().catch(() => ({}));
      questionText = json.question || "";
      imageDescription = json.imageDescription || null;
      pathImage = json.pathImage || null;
    }

    if (!questionText.trim()) {
      return sendError(c, "Konten soal tidak boleh kosong", 400);
    }

    const created = await questionService.createQuestion({
      question: questionText,
      topicId,
      imageDescription,
      pathImage,
    });

    return sendSuccess(c, created, "Soal berhasil ditambahkan", 201);
  } catch (err: any) {
    return sendError(c, err.message || "Gagal membuat soal", 400);
  }
});

// GET /api/questions/:id
questionRoutes.get("/questions/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return sendError(c, "ID soal tidak valid", 400);
  }

  const question = await questionService.getQuestionById(id);
  if (!question) {
    return sendError(c, "Soal tidak ditemukan", 404);
  }

  return sendSuccess(c, question);
});

// PUT /api/questions/:id (Admin only)
questionRoutes.put("/questions/:id", requireAdmin, async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return sendError(c, "ID soal tidak valid", 400);
  }

  try {
    let questionText: string | undefined;
    let imageDescription: string | null | undefined;
    let pathImage: string | null | undefined;

    const contentType = c.req.header("content-type") || "";
    if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const body = await c.req.parseBody();
      if (body["question"] !== undefined) questionText = body["question"] as string;
      if (body["imageDescription"] !== undefined) imageDescription = body["imageDescription"] as string;

      const file = body["image"];
      if (file && typeof file === "object" && "arrayBuffer" in file && (file as File).size > 0) {
        pathImage = await saveUploadedFile(file as File);
      }
    } else {
      const json = await c.req.json().catch(() => ({}));
      if (json.question !== undefined) questionText = json.question;
      if (json.imageDescription !== undefined) imageDescription = json.imageDescription;
      if (json.pathImage !== undefined) pathImage = json.pathImage;
    }

    const updated = await questionService.updateQuestion(id, {
      question: questionText,
      imageDescription,
      pathImage,
    });

    if (!updated) {
      return sendError(c, "Soal tidak ditemukan", 404);
    }

    return sendSuccess(c, updated, "Soal berhasil diperbarui");
  } catch (err: any) {
    return sendError(c, err.message || "Gagal memperbarui soal", 400);
  }
});

// DELETE /api/questions/:id (Admin only)
questionRoutes.delete("/questions/:id", requireAdmin, async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return sendError(c, "ID soal tidak valid", 400);
  }

  const deleted = await questionService.deleteQuestion(id);
  if (!deleted) {
    return sendError(c, "Soal tidak ditemukan", 404);
  }

  return sendSuccess(c, undefined, "Soal berhasil dihapus");
});
