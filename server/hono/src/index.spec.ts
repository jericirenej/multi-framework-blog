import { UUIDv5 } from "@/db/helpers/v5";
import {
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  setSystemTime,
} from "bun:test";
import { add } from "date-fns";
import { testClient } from "hono/testing";
import db from "../../../db/client-singleton";
import { seed } from "../../../db/seed/1750095666293_initial";
import authService from "../../services/auth.service";
import blogService from "../../services/blog.service";
import app from "./";

let client: Awaited<ReturnType<typeof beforeAllHook>>;
const beforeAllHook = async (runSeed = true) => {
  if (runSeed) {
    await seed(db);
  }
  const result = testClient(app);
  client = result;
  return result;
};

const afterEachHook = async () => {
  setSystemTime();
  authService.clearInvalidatedSessionsCache();
  await db.deleteFrom("invalidated_sessions").execute();
};

const getInvalidated = async () =>
  db.selectFrom("invalidated_sessions").selectAll().execute();
const createTokenHeader = (obj: { token: string }) => {
  return { Authorization: obj.token };
};

const credentials = { username: "johnDoe", password: "johnDoe-password" };
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
  it("GET /api/auth/authenticated", async () => {
    const unauthenticated = await client.api.auth.authenticated.$get();
    expect(await unauthenticated.json()).toEqual({ authenticated: false });
    const auth = await client.api.auth.login.$post({ json: credentials });
    const authenticated = await client.api.auth.authenticated.$get(undefined, {
      headers: createTokenHeader(await auth.json()),
    });
    expect(await authenticated.json()).toEqual({ authenticated: true });
  });
  it("GET /api/auth/me returns user object for authenticated request", async () => {
    const auth = await client.api.auth.login.$post({ json: credentials });
    const unauthenticated = await client.api.auth.me.$get();
    expect(unauthenticated.status).toBe(401);
    const user = await authService.getUserByUsername("johnDoe");
    if (!user) {
      throw new Error("Use r missing in test -- did you forget to seed?");
    }
    const authenticated = await client.api.auth.me.$get(undefined, {
      headers: createTokenHeader(await auth.json()),
    });
    expect(await authenticated.json()).toEqual(user);
  });
  it("POST /api/auth/login, logs in user and returns jwt", async () => {
    const res = await client.api.auth.login.$post({
      json: credentials,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("token");
    expect(res.headers.getSetCookie()[0]).toContain(body.token);
  });
  it("POST /api/auth/login, rejects for wrong credentials", async () => {
    for (const json of [
      { username: "johnDoe", password: "invalid" },
      { username: "invalid", password: "johnDoe-password" },
      { username: "invalid", password: "invalid" },
    ])
      expect(await client.api.auth.login.$post({ json })).toHaveProperty(
        "status",
        401
      );
  });
  it("POST /api/login rejects if already logged in or if token expired or malformed", async () => {
    const res = await client.api.auth.login.$post({ json: credentials });
    expect(res.status).toBe(200);
    await client.api.auth.logout.$delete(undefined, {});
    const requestShape = {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${(await res.json()).token}`,
      }),
    };
    const url = client.api.auth.login.$url().pathname;
    const loggedInResponse = await app.request(url, requestShape);

    expect(loggedInResponse).toHaveProperty("status", 400);

    setSystemTime(add(new Date(), { days: 2 }));
    const expiredTokenResponse = await app.request(url, requestShape);
    expect(expiredTokenResponse.status).toBe(401);

    expect(expiredTokenResponse.headers.getSetCookie()[0]).toContain(
      "app_jwt=; Max-Age=0"
    );

    setSystemTime();

    const malformedTokenResponse = await app.request(url, {
      ...requestShape,
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer invalid}`,
      }),
    });
    expect(malformedTokenResponse.status).toBe(401);
    expect(expiredTokenResponse.headers.getSetCookie()[0]).toContain(
      "app_jwt=; Max-Age=0"
    );
  });
  it("DELETE /api/auth/logout logs out user and prevents token reuse", async () => {
    const authenticated = await client.api.auth.login.$post({
      json: credentials,
    });
    const headers = createTokenHeader(await authenticated.json());
    expect(await getInvalidated()).toHaveLength(0);
    const response = await client.api.auth.logout.$delete(undefined, {
      headers,
    });
    expect(response.status).toBe(200);
    expect(response.headers.getSetCookie()[0]).toContain("app_jwt=; Max-Age=0");
    expect(await getInvalidated()).toHaveLength(1);
    const meWithExpired = await client.api.auth.me.$get(undefined, { headers });
    expect(meWithExpired.status).toBe(401);
  });
  it("DELETE /api/auth/logout performs cleanup of previously invalidated sessions that have expired", async () => {
    const authenticated = await client.api.auth.login.$post({
      json: credentials,
    });
    const res = await authenticated.json();
    const logout1 = await client.api.auth.logout.$delete(undefined, {
      headers: createTokenHeader(res),
    });
    expect(logout1.status).toBe(200);
    expect(await getInvalidated()).toHaveLength(1);
    setSystemTime(add(new Date(), { days: 3 }));
    const secondAuthentication = await client.api.auth.login.$post({
      json: credentials,
    });
    const secondToken = await secondAuthentication.json();
    const logout2 = await client.api.auth.logout.$delete(undefined, {
      headers: createTokenHeader(secondToken),
    });
    expect(logout2.status).toBe(200);
    expect(await getInvalidated()).toHaveLength(1);
  });
});
describe("Blog", () => {
  const exampleBlog = {
    content: "Some content",
    title: "Some title",
  };
  beforeAll(async () => {
    await beforeAllHook();
  });
  afterEach(async () => {
    await afterEachHook();
  });
  it("GET /api/blog/all", async () => {
    const res = await client.api.blog.all.$get();
    expect(await res.json()).toEqual(await blogService.getBlogs());
  });
  it("GET /api/blog/id/:postId", async () => {
    const target = await db
      .selectFrom("blog")
      .selectAll()
      .executeTakeFirstOrThrow();
    const res = await client.api.blog.id[":postId"].$get({
      param: { postId: target.id },
    });
    expect(await res.json()).toEqual(target);
  });
  it("GET /api/blog/author/:username", async () => {
    const targets = await db
      .selectFrom("blog")
      .selectAll()
      .where("author", "=", new UUIDv5("user").generate("johnDoe"))
      .execute();
    const res = await client.api.blog.author[":username"].$get({
      param: { username: "johnDoe" },
    });
    expect(await res.json()).toEqual(targets);
  });
  it("POST /api/blog requires authentication", async () => {
    const response = await client.api.blog.$post({
      form: exampleBlog,
    });
    expect(response).toHaveProperty("status", 401);
  });
  it("POST /api/blog", async () => {
    const auth = await client.api.auth.login.$post({ json: credentials });
    const response = await client.api.blog.$post(
      { form: exampleBlog },
      { headers: createTokenHeader(await auth.json()) }
    );
    expect(response.status).toBe(201);
    const blog = await response.json();
    expect(await blogService.getBlog(blog.id)).toEqual(blog);
  });
  it("PATCH /api/blog/:postId requires authentication", async () => {
    const { id } = await db
      .selectFrom("blog")
      .selectAll()
      .executeTakeFirstOrThrow();
    const response = await client.api.blog[":postId"].$patch({
      param: { postId: id },
      form: exampleBlog,
    });
    expect(response).toHaveProperty("status", 401);
  });
  it("PATCH /api/blog/:postId", async () => {
    const auth = await client.api.auth.login.$post({ json: credentials });
    const { id } = await db
      .selectFrom("blog")
      .selectAll()
      .where("author", "=", new UUIDv5("user").generate(credentials.username))
      .executeTakeFirstOrThrow();
    const response = await client.api.blog[":postId"].$patch(
      {
        param: { postId: id },
        form: { content: "Patched content" },
      },
      { headers: createTokenHeader(await auth.json()) }
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
    const auth = await client.api.auth.login.$post({ json: credentials });
    const { id } = await db
      .selectFrom("blog")
      .selectAll()
      .where("author", "=", new UUIDv5("user").generate(credentials.username))
      .executeTakeFirstOrThrow();

    const response = await client.api.blog[":postId"].$delete(
      {
        param: { postId: id },
      },
      { headers: createTokenHeader(await auth.json()) }
    );
    expect(response).toHaveProperty("status", 200);
    expect(
      await db.selectFrom("blog").selectAll().where("id", "=", id).execute()
    ).toHaveLength(0);
  });
});
