import db from "@/db/client-singleton";
import { UUIDv5 } from "@/db/helpers/v5";
import { lorem, seed, USERS } from "@/db/seed/1750095666293_initial";
import { add } from "date-fns";
import { testClient } from "hono/testing";
import { resolve } from "path";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { $ } from "zx";
import app from "./app";
import { JWT_COOKIE } from "./constants";
import { blogSummaryDtoSchema } from "./schemas";
import authService from "./services/auth.service";
import blogService from "./services/blog.service";

let client: Awaited<ReturnType<typeof beforeAllHook>>;
const migrateFn = async (type: "latest" | "rollback" = "latest") => {
  const cwd = resolve(import.meta.dirname, "../../db");
  if (type === "latest") {
    await $({
      cwd,
    })`pnpm kysely migrate:latest`;
    return;
  }
  await $({
    cwd,
  })`pnpm kysely migrate:rollback --all`;
};
const beforeAllHook = async (runSeed = true) => {
  await migrateFn("latest");
  if (runSeed) {
    await seed(db);
  }
  const result = testClient(app);
  client = result;
  return result;
};

const afterEachHook = async () => {
  vi.useRealTimers();
  authService.clearInvalidatedSessionsCache();
  await db.deleteFrom("invalidated_sessions").execute();
};

const afterAllHook = async () => {
  await migrateFn("rollback");
};
const getInvalidated = async () =>
  db.selectFrom("invalidated_sessions").selectAll().execute();

const credentials = {
  username: USERS[0].username,
  password: USERS[0].password,
};
const addAuthCookie = async (auth = credentials) => {
  return (await client.api.auth.login.$post({ json: auth })).headers
    .getSetCookie()
    .join(",");
};

it("Compiles", () => {
  expect(app).toBeDefined();
});
describe("Authentication", () => {
  beforeAll(async () => {
    await beforeAllHook();
  });
  afterEach(async () => {
    await afterEachHook();
  });
  afterAll(async () => {
    await afterAllHook();
  });
  it("GET /api/auth/authenticated", async () => {
    const unauthenticated = await client.api.auth.authenticated.$get();
    expect(await unauthenticated.json()).toEqual({ authenticated: false });
    const authenticated = await client.api.auth.authenticated.$get(undefined, {
      headers: { Cookie: await addAuthCookie() },
    });
    expect(await authenticated.json()).toEqual({ authenticated: true });
  });

  it("GET /api/auth/me returns user object for authenticated request", async () => {
    const unauthenticated = await client.api.auth.me.$get();
    expect(unauthenticated.status).toBe(401);
    const user = await authService.getUserByUsername("johnDoe");
    if (!user) {
      throw new Error("User missing in test -- did you forget to seed?");
    }
    const authenticated = await client.api.auth.me.$get(undefined, {
      headers: { Cookie: await addAuthCookie() },
    });

    const { exp, ...rest } = await authenticated.json();
    expect(rest).toEqual(user);
    const expectedExpiration = Math.floor(
      authService.expirationTime.getTime() / 1000,
    );
    // While tests are executing time drift can occur, so let's allow for
    // a 2 second difference
    expect(Math.abs(exp - expectedExpiration)).toBeLessThanOrEqual(2);
  });
  it("POST /api/auth/login, logs in user", async () => {
    const res = await client.api.auth.login.$post({
      json: credentials,
    });
    expect(res.status).toBe(200);
    expect(
      res.headers.getSetCookie().find((entry) => entry.includes(JWT_COOKIE)),
    ).toBeDefined();
  });
  it("POST /api/auth/login, rejects for wrong credentials", async () => {
    for (const json of [
      { username: "johnDoe", password: "invalid" },
      { username: "invalid", password: "johnDoe-password" },
      { username: "invalid", password: "invalid" },
    ])
      expect(await client.api.auth.login.$post({ json })).toHaveProperty(
        "status",
        401,
      );
  });
  it("POST /api/login rejects if already logged in or if token expired or malformed", async () => {
    const now = new Date();
    vi.useFakeTimers({ toFake: ["Date"] });
    const requestShape = {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: new Headers({
        "Content-Type": "application/json",
        Cookie: await addAuthCookie(credentials),
      }),
    };
    const url = client.api.auth.login.$url().pathname;
    const loggedInResponse = await app.request(url, requestShape);

    expect(loggedInResponse).toHaveProperty("status", 400);

    vi.setSystemTime(add(new Date(), { days: 2 }));
    const expiredTokenResponse = await app.request(url, requestShape);
    expect(expiredTokenResponse.status).toBe(401);

    expect(expiredTokenResponse.headers.getSetCookie()[0]).toContain(
      "app_jwt=; Max-Age=0",
    );

    vi.setSystemTime(now);

    const malformedTokenResponse = await app.request(url, {
      ...requestShape,
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer invalid}`,
      }),
    });
    expect(malformedTokenResponse.status).toBe(401);
    expect(expiredTokenResponse.headers.getSetCookie()[0]).toContain(
      "app_jwt=; Max-Age=0",
    );
  });
  it("DELETE /api/auth/logout logs out user and prevents token reuse", async () => {
    const Cookie = await addAuthCookie();
    expect(await getInvalidated()).toHaveLength(0);
    const response = await client.api.auth.logout.$delete(undefined, {
      headers: { Cookie },
    });
    expect(response.status).toBe(200);
    expect(response.headers.getSetCookie()[0]).toContain("app_jwt=; Max-Age=0");
    expect(await getInvalidated()).toHaveLength(1);
    const meWithExpired = await client.api.auth.me.$get(undefined, {
      headers: { Cookie },
    });
    expect(meWithExpired.status).toBe(401);
  });
  it("DELETE /api/auth/logout performs cleanup of previously invalidated sessions that have expired", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const Cookie = await addAuthCookie();
    const logout1 = await client.api.auth.logout.$delete(undefined, {
      headers: { Cookie },
    });
    expect(logout1.status).toBe(200);
    expect(await getInvalidated()).toHaveLength(1);
    vi.setSystemTime(add(new Date(), { days: 3 }));

    const logout2 = await client.api.auth.logout.$delete(undefined, {
      headers: { Cookie: await addAuthCookie() },
    });
    expect(logout2.status).toBe(200);
    expect(await getInvalidated()).toHaveLength(1);
  });
});
describe("Blog", () => {
  const exampleBlog = {
    content: lorem,
    title: "Some title",
  };
  beforeAll(async () => {
    await beforeAllHook();
  });
  afterEach(async () => {
    await afterEachHook();
  });
  afterAll(async () => {
    await afterAllHook();
  });
  it("GET /api/blog/all", async () => {
    const res = await client.api.blog.all.$get();
    const result = await res.json();
    expect(result).toEqual(await blogService.getBlogs());
    const parsed = result.map((r) => blogSummaryDtoSchema.safeParse(r));
    expect(parsed.every((p) => p.success)).toBeTruthy();
  });
  [
    { limit: 2, offset: undefined },
    { limit: 2, offset: 3 },
  ].forEach(({ limit, offset }) => {
    it(`GET /api/blog/all?limit=${limit}${offset ? `&offset=${offset}` : ""}`, async () => {
      const res = await client.api.blog.all.$get({
        query: { limit: limit.toString(), offset: offset?.toString() },
      });
      const result = await res.json();
      const targets = await db
        .selectFrom("blog")
        .select("id")
        .orderBy("created_at", "desc")
        .limit(limit)
        .offset(offset ?? 0)
        .execute();
      expect(result.map(({ id }) => id)).toEqual(targets.map(({ id }) => id));
      expect(result).toEqual(await blogService.getBlogs(limit, offset));
    });
  });
  it("GET /api/blog/all/ids", async () => {
    const res = await client.api.blog.all.ids.$get();
    expect(await res.json()).toEqual(
      await db.selectFrom("blog").select("id").execute(),
    );
  });
  it("GET /api/blog/id/:postId", async () => {
    const target = await db
      .selectFrom("blog")
      .innerJoin("user", "user.id", "blog.author_id")
      .selectAll("blog")
      .select("user.name as author_name")
      .executeTakeFirstOrThrow();
    const res = await client.api.blog.id[":postId"].$get({
      param: { postId: target.id },
    });
    expect(await res.json()).toEqual(target);
  });
  it("GET /api/blog/author/:username", async () => {
    const targets = await blogService.getBlogsByUser("johnDoe");
    const res = await client.api.blog.author[":username"].$get({
      param: { username: "johnDoe" },
    });
    const result = await res.json();
    expect(result).toEqual(targets);
    const parsed = result.map((r) => blogSummaryDtoSchema.safeParse(r));
    expect(parsed.every((p) => p.success)).toBeTruthy();
  });
  [{ limit: 2 }, { limit: 2, offset: 3 }].forEach(({ limit, offset }) => {
    it(`GET /api/blog/author/:username?limit=${limit}${offset ? `&offset=${offset}` : ""}`, async () => {
      const targets = await blogService.getBlogsByUser(
        "johnDoe",
        limit,
        offset,
      );
      const res = await (
        await client.api.blog.author[":username"].$get({
          param: { username: "johnDoe" },
          query: { limit: limit.toString(), offset: offset?.toString() },
        })
      ).json();
      const target = await db
        .selectFrom("blog")
        .select("blog.id")
        .where("author_id", "=", new UUIDv5("user").generate("johnDoe"))
        .orderBy("created_at", "desc")
        .limit(limit)
        .offset(offset ?? 0)
        .execute();

      expect(res).toEqual(targets);
      expect(res.map((r) => r.id)).toEqual(target.map((r) => r.id));
    });
  });
  it("POST /api/blog requires authentication", async () => {
    const response = await client.api.blog.$post({
      form: exampleBlog,
    });
    expect(response).toHaveProperty("status", 401);
  });
  it("POST /api/blog", async () => {
    const response = await client.api.blog.$post(
      { form: exampleBlog },
      { headers: { Cookie: await addAuthCookie() } },
    );
    expect(response.status).toBe(201);
    const blog = await response.json();
    expect(await blogService.getBlog(blog.id)).toEqual(blog);
  });
  it("PATCH /api/blog/:postId requires authentication", async () => {
    const { id } = await db
      .selectFrom("blog")
      .select("id")
      .executeTakeFirstOrThrow();
    const response = await client.api.blog[":postId"].$patch({
      param: { postId: id },
      form: exampleBlog,
    });
    expect(response).toHaveProperty("status", 401);
  });
  it("PATCH /api/blog/:postId", async () => {
    const { id } = await db
      .selectFrom("blog")
      .select("id")
      .where(
        "author_id",
        "=",
        new UUIDv5("user").generate(credentials.username),
      )
      .executeTakeFirstOrThrow();
    const response = await client.api.blog[":postId"].$patch(
      {
        param: { postId: id },
        form: { content: "Patched content" },
      },
      { headers: { Cookie: await addAuthCookie() } },
    );

    expect(response).toHaveProperty("status", 200);
    const { content } = await response.json();
    expect(content).toBe("Patched content");
    const updated = await db
      .selectFrom("blog")
      .select("content")
      .where("id", "=", id)
      .executeTakeFirstOrThrow();
    expect(updated.content).toBe(content);
  });
  it("DELETE /api/blog/:postId requires authentication", async () => {
    const { id } = await db
      .selectFrom("blog")
      .selectAll()
      .executeTakeFirstOrThrow();
    const response = await client.api.blog[":postId"].$delete({
      param: { postId: id },
    });
    expect(response).toHaveProperty("status", 401);
  });
  it("DELETE /api/blog/:postId", async () => {
    const { id } = await db
      .selectFrom("blog")
      .selectAll()
      .where(
        "author_id",
        "=",
        new UUIDv5("user").generate(credentials.username),
      )
      .executeTakeFirstOrThrow();

    const response = await client.api.blog[":postId"].$delete(
      {
        param: { postId: id },
      },
      { headers: { Cookie: await addAuthCookie() } },
    );
    expect(response).toHaveProperty("status", 200);
    expect(
      await db.selectFrom("blog").selectAll().where("id", "=", id).execute(),
    ).toHaveLength(0);
  });
});
