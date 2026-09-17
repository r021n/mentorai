import { Hono } from "hono";
import * as studentsAnswersService from "./students-answers.service.js";
import { generateTopicExcelReport } from "../../services/excel.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../middlewares/role.middleware.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const adminReportRoutes = new Hono();

adminReportRoutes.use("*", authMiddleware, requireAdmin);

// GET /api/admin/topics/:topicId/students-answers
adminReportRoutes.get("/topics/:topicId/students-answers", async (c) => {
  const topicId = Number(c.req.param("topicId"));
  if (isNaN(topicId)) {
    return sendError(c, "ID topik tidak valid", 400);
  }

  const matrix = await studentsAnswersService.getStudentsAnswersMatrix(topicId);
  if (!matrix) {
    return sendError(c, "Topik tidak ditemukan", 404);
  }

  return sendSuccess(c, {
    questions: matrix.questions,
    students: matrix.students,
  });
});

// GET /api/admin/download/:topicId
adminReportRoutes.get("/download/:topicId", async (c) => {
  const topicId = Number(c.req.param("topicId"));
  if (isNaN(topicId)) {
    return sendError(c, "ID topik tidak valid", 400);
  }

  const matrix = await studentsAnswersService.getStudentsAnswersMatrix(topicId);
  if (!matrix) {
    return sendError(c, "Topik tidak ditemukan", 404);
  }

  if (matrix.questions.length === 0) {
    return sendError(c, "Tidak ada soal untuk topik ini", 400);
  }

  const excelBuffer = await generateTopicExcelReport(
    matrix.topic.name,
    matrix.questions,
    matrix.students.map((s) => ({
      userId: s.userId,
      username: s.username,
      totalScore: s.totalScore,
      answers: Object.fromEntries(
        Object.entries(s.answers).map(([qid, val]) => [Number(qid), val])
      ),
    }))
  );

  return new Response(excelBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="Laporan_Topic_${topicId}.xlsx"`,
    },
  });
});
