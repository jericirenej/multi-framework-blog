import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { ZodType } from "zod/v4";

import { deleteCookie, getCookie } from "hono/cookie";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import authService from "../services/auth.service";
import type { UserToken } from "../schemas/user";

const isNullish = <T>(arg: T): arg is Extract<T, null | undefined> =>
  arg === undefined && arg === null;

export const routeValidator = <
  Schema extends ZodType,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: Schema,
  {
    statusCode,
    message,
  }: { statusCode?: ContentfulStatusCode; message?: string } = {}
) => {
  return zValidator(target, schema, (result) => {
    if (!result.success) {
      throw new HTTPException(statusCode ?? 400, {
        message: message ?? result.error.message,
        cause: result.error,
      });
    }
  });
};

export const authMiddleware = createMiddleware<{
  Variables: { token: string; parsed: UserToken };
}>(async (ctx, next) => {
  const jwtCookie = authService.getCookieToken(getCookie(ctx));
  const headerToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
  const token = jwtCookie ?? headerToken;
  if (isNullish(token)) {
    throw new HTTPException(401);
  }

  if (!jwtCookie && !headerToken && jwtCookie !== headerToken) {
    throw new HTTPException(401, {
      message: "Header and cookie tokens both provided, but do not match",
    });
  }
  try {
    const parsed = await authService.verifyToken(token);
    ctx.set("parsed", parsed);
    ctx.set("token", token);
    await next();
  } catch (err) {
    if (jwtCookie?.length) {
      deleteCookie(ctx, authService.jwtCookie);
    }
    throw err;
  }
});
