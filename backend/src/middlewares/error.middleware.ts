import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { sendError } from "../utils/response.js";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function globalErrorHandler(err: Error, c: Context) {
  console.error("Global Error Handler caught:", err);

  if (err instanceof HTTPException) {
    return sendError(c, err.message, err.status as ContentfulStatusCode);
  }

  return sendError(c, err.message || "Internal Server Error", 500);
}

export function notFoundHandler(c: Context) {
  return sendError(c, `Route ${c.req.method} ${c.req.url} tidak ditemukan.`, 404);
}
