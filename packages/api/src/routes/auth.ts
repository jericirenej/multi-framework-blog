import { Hono, type Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import authService from "../services/auth.service";
import { authMiddleware, routeValidator } from "../middleware";
import { userSchema } from "../schemas";

// Allow cookie or header authorization
const getToken = (ctx: Context) => {
  const jwtCookie = authService.getCookieToken(getCookie(ctx));
  const jwtHeader = ctx.req.header("Authorization")?.replace("Bearer ", "");
  return { jwtCookie, jwtHeader, token: jwtCookie ?? jwtHeader };
};

const auth = new Hono()
  .get("/authenticated", async (ctx) => {
    const { token } = getToken(ctx);
    return ctx.json(
      {
        authenticated: await authService.isAuthenticated(token),
      },
      200
    );
  })
  .get("/me", authMiddleware, async (ctx) => {
    return ctx.json(await authService.getUserById(ctx.get("parsed").sub));
  })
  .post(
    "/login",
    routeValidator("json", userSchema, {
      message: "Please supply username and password",
    }),
    async (ctx) => {
      const { token } = getToken(ctx);
      if (token) {
        try {
          await authService.verifyToken(token);
        } catch {
          deleteCookie(ctx, authService.jwtCookie);
          throw new HTTPException(401, {
            message: "Invalid jwt token detected. Please login again",
          });
        }

        throw new HTTPException(400, {
          message: "Already logged in. Please logout first.",
        });
      }

      const user = ctx.req.valid("json");
      const authenticated = await authService.authenticate(user);
      if (!authenticated) {
        throw new HTTPException(401, { message: "Authentication failed" });
      }
      const expires = authService.expirationTime;
      const signedToken = await authService.sign(user, expires);
      setCookie(ctx, authService.jwtCookie, signedToken, {
        domain: "localhost",
        path: "/",
        expires,
        httpOnly: true,
      });

      return ctx.json({ token: signedToken }, 200);
    }
  )
  .delete("/logout", authMiddleware, async (ctx) => {
    await authService.logout(ctx.get("token"));
    deleteCookie(ctx, authService.jwtCookie);
    return ctx.text("Logged out", 200);
  });
export default auth;
