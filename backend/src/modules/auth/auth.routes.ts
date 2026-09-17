import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { setCookie, deleteCookie } from "hono/cookie";
import { registerSchema, loginSchema } from "./auth.schema.js";
import * as authService from "./auth.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { env } from "../../config/env.js";

const authRoutes = new Hono();

// POST /api/auth/register
authRoutes.post(
  "/register",
  zValidator("json", registerSchema, (result, c) => {
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Validasi gagal";
      const formattedErrors = result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return sendError(c, firstError, 400, formattedErrors);
    }
  }),
  async (c) => {
    const input = c.req.valid("json");
    try {
      await authService.registerUser(input);
      return sendSuccess(c, undefined, "Registrasi berhasil, silakan login.", 201);
    } catch (err: any) {
      return sendError(c, err.message || "Registrasi gagal", 400);
    }
  }
);

// POST /api/auth/login
authRoutes.post(
  "/login",
  zValidator("json", loginSchema, (result, c) => {
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Validasi gagal";
      return sendError(c, firstError, 400);
    }
  }),
  async (c) => {
    const input = c.req.valid("json");
    try {
      const result = await authService.loginUser(input);

      // Set HttpOnly cookie
      setCookie(c, "token", result.token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return sendSuccess(c, result, "Login berhasil.");
    } catch (err: any) {
      return sendError(c, err.message || "Login gagal", 400);
    }
  }
);

// GET /api/auth/me
authRoutes.get("/me", authMiddleware, async (c) => {
  const currentUser = c.get("user");
  const user = await authService.getUserById(currentUser.id);
  if (!user) {
    return sendError(c, "User tidak ditemukan", 404);
  }
  return sendSuccess(c, user);
});

// POST /api/auth/logout
authRoutes.post("/logout", authMiddleware, async (c) => {
  deleteCookie(c, "token", { path: "/" });
  return sendSuccess(c, undefined, "Logout berhasil.");
});

export default authRoutes;
