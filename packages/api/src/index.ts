import { Hono } from "hono";
import auth from "./routes/auth";
import blog from "./routes/blog";

const app = new Hono()
  .basePath("/api")
  .route("/auth", auth)
  .route("/blog", blog);

export default app;
export type App = typeof app;
