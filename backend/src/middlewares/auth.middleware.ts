import type { MiddlewareHandler } from "hono";
import { verify } from "hono/jwt";
import { getCookie } from "hono/cookie";
import { env } from "../config/env.js";
import { sendError } from "../utils/response.js";

export interface JwtUserPayload {
  id: number;
  username: string;
  role: "admin" | "siswa" | string;
  exp?: number;
}

declare module "hono" {
  interface ContextVariableMap {
    user: JwtUserPayload;
  }
}

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  let token: string | undefined;

  // 1. Check Authorization header
  const authHeader = c.req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  }

  // 2. Check Cookie if no header token
  if (!token) {
    token = getCookie(c, "token");
  }

  if (!token) {
    return sendError(c, "Unauthorized: Token tidak ditemukan.", 401);
  }

  try {
    const payload = (await verify(token, env.JWT_SECRET, "HS256")) as unknown as JwtUserPayload;
    if (!payload || !payload.id || !payload.username) {
      return sendError(c, "Unauthorized: Token tidak valid.", 401);
    }
    c.set("user", payload);
    await next();
  } catch (err) {
    console.error("JWT Verification failed:", err);
    return sendError(c, "Unauthorized: Sesi tidak valid atau telah kedaluwarsa.", 401);
  }
};
