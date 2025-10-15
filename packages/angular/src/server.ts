import { AngularAppEngine, createRequestHandler } from "@angular/ssr";
import { isMainModule } from "@angular/ssr/node";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { proxy } from "hono/proxy";
import { join } from "node:path";
import { API_URL, JWT_COOKIE } from "@/api/constants";
import { environment } from "./environments/environment";
import { compress } from "hono/compress";

function createApp() {
  const browserDistFolder = join(import.meta.dirname, "../browser");
  const angularApp = new AngularAppEngine();
  const app = new Hono()
    .use(compress())
    .all("/api/*", async (ctx) => {
      const cookie = getCookie(ctx, JWT_COOKIE);
      const header = ctx.req.header("Authorization");
      const url = new URL(ctx.req.path, API_URL);
      for (const [key, value] of Object.entries(ctx.req.queries())) {
        value.forEach((val) => {
          url.searchParams.append(key, val);
        });
      }
      return proxy(url.href, {
        // eslint-disable-next-line @typescript-eslint/no-misused-spread
        ...ctx.req,

        headers: {
          ...ctx.req.header(),
          "X-Forwarded-Host": ctx.req.header("host"),
          Authorization: cookie
            ? `Bearer ${cookie}`
            : header
              ? header
              : undefined,
        },
      });
    })
    .use(
      "*",
      serveStatic({
        root: join(".", browserDistFolder.replace(process.cwd(), "")),
        onNotFound: (path: unknown) => {
          console.log("Not found - ", path);
        },
        onFound: (_path, ctx) => {
          ctx.header("Cache-Control", "public, immutable, max-age=2592000");
        },
      }),
    )
    .get("/*", async (ctx) => {
      const res = await angularApp.handle(ctx.req.raw, {
        server: "hono",
      });
      if (!res) {
        return ctx.text("Not found", 404);
      }
      return res;
    });
  return app;
}

const app = createApp();
/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
const hostname = process.env.CORS_ORIGIN ?? "localhost";

if (isMainModule(import.meta.url)) {
  serve(
    {
      fetch: app.fetch,
      port: environment.port,
      hostname,
    },
    (info) => {
      console.log(
        `Angular server listening on http://${hostname}:${info.port}`,
      );
    },
  );
}

export const reqHandler = createRequestHandler(app.fetch);
