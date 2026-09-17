import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { env } from "../../config/env.js";
import type { RegisterInput, LoginInput } from "./auth.schema.js";

export async function registerUser(input: RegisterInput) {
  const existing = await db.query.users.findFirst({
    where: eq(users.username, input.username),
  });

  if (existing) {
    throw new Error("Username sudah digunakan");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const [created] = await db
    .insert(users)
    .values({
      username: input.username,
      password: hashedPassword,
      role: "siswa",
    })
    .returning();

  return created;
}

export async function loginUser(input: LoginInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, input.username),
  });

  if (!user) {
    throw new Error("Username atau password salah");
  }

  let isMatch = false;

  // 1. Try bcrypt compare
  if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$argon2")) {
    isMatch = await bcrypt.compare(input.password, user.password);
  } else {
    // 2. Legacy plain text comparison
    if (user.password === input.password) {
      isMatch = true;
      // Transparent upgrade to bcrypt hash
      const newHash = await bcrypt.hash(input.password, 10);
      await db.update(users).set({ password: newHash }).where(eq(users.id, user.id));
    }
  }

  if (!isMatch) {
    throw new Error("Username atau password salah");
  }

  const tokenPayload = {
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  const token = await sign(tokenPayload, env.JWT_SECRET, "HS256");

  return {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    token,
  };
}

export async function getUserById(id: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      id: true,
      username: true,
      role: true,
    },
  });
  return user;
}
