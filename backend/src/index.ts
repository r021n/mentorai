import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { env } from "./config/env.js";
import { initTables } from "./db/index.js";
import { seed } from "./db/seed.js";
import { globalErrorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { sendSuccess } from "./utils/response.js";

// Module routes
import authRoutes from "./modules/auth/auth.routes.js";
import topicRoutes from "./modules/topics/topics.routes.js";
import { questionRoutes } from "./modules/questions/questions.routes.js";
import exerciseRoutes from "./modules/exercise/exercise.routes.js";
import myAnswersRoutes from "./modules/my-answers/my-answers.routes.js";
import { adminReportRoutes } from "./modules/students-answers/students-answers.routes.js";
import { adminDbRoutes } from "./modules/admin-db/admin-db.routes.js";

export const app = new Hono();

// Global Middlewares
app.use("*", logger());
app.use("*", prettyJSON());
app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow localhost frontend during development or configured FRONTEND_URL
      if (!origin) return env.FRONTEND_URL;
      if (
        origin === env.FRONTEND_URL ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return origin;
      }
      return env.FRONTEND_URL;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Serve static uploaded images
app.use("/uploads/*", serveStatic({ root: "./public" }));

// Health Check
app.get("/api/health", (c) => {
  return sendSuccess(c, {
    status: "ok",
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  }, "MentorAI Backend Service is healthy");
});

// Mount Domain Routes
app.route("/api/auth", authRoutes);
app.route("/api/topics", topicRoutes);
app.route("/api", questionRoutes);
app.route("/api/exercise", exerciseRoutes);
app.route("/api/my-answers", myAnswersRoutes);
app.route("/api/admin", adminReportRoutes);
app.route("/api/admin/database", adminDbRoutes);

// Error and 404 Handlers
app.onError(globalErrorHandler);
app.notFound(notFoundHandler);

// Bootstrap server when run directly
async function startServer() {
  try {
    console.log("Initializing database tables and seed data...");
    await initTables();
    await seed();
    console.log("Database initialized successfully.");

    serve(
      {
        fetch: app.fetch,
        port: env.PORT,
      },
      (info) => {
        console.log(`MentorAI Backend server is running on http://localhost:${info.port}`);
      }
    );
  } catch (err) {
    console.error("Failed to start backend server:", err);
    process.exit(1);
  }
}

if (process.argv[1]?.endsWith("index.ts") || process.argv[1]?.endsWith("index.js")) {
  startServer();
}

export default app;
