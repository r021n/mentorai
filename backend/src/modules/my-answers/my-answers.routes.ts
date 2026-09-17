import { Hono } from "hono";
import * as myAnswersService from "./my-answers.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { sendSuccess, sendError } from "../../utils/response.js";

const myAnswersRoutes = new Hono();

myAnswersRoutes.use("*", authMiddleware);

// GET /api/my-answers/:topicId
myAnswersRoutes.get("/:topicId", async (c) => {
  const topicId = Number(c.req.param("topicId"));
  if (isNaN(topicId)) {
    return sendError(c, "ID topik tidak valid", 400);
  }

  const user = c.get("user");
  const data = await myAnswersService.getStudentAnswersSummary(topicId, user.id);

  return sendSuccess(c, data);
});

export default myAnswersRoutes;
