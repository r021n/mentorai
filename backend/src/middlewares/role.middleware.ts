import type { MiddlewareHandler } from "hono";
import { sendError } from "../utils/response.js";

export const requireAdmin: MiddlewareHandler = async (c, next) => {
  const user = c.get("user");
  if (!user || user.role !== "admin") {
    return sendError(c, "Akses ditolak: Hanya admin yang diizinkan mengakses resource ini.", 403);
  }
  await next();
};
