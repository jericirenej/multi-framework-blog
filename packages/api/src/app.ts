import { Hono } from "hono";
import auth from "./routes/auth";
import blog from "./routes/blog";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import env from "@/env";

const app = new Hono()
  .use(logger())
  .use(
    cors({
      origin: env().CORS_ORIGIN ?? "localhost",
      allowMethods: ["GET", "PUT", "PATCH", "POST", "HEAD", "OPTIONS"],
      credentials: true,
    }),
  )
  .basePath("/api")
  .route("/auth", auth)
  .route("/blog", blog);

export default app;
export type App = typeof app;
