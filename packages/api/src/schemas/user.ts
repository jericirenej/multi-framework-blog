import { z } from "zod/v4";
import { JWT_COOKIE } from "../constants";
export const jwtCookieSchema = z.object({
  [JWT_COOKIE]: z.string(),
});
export const userSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const tokenSchema = z.object({
  sub: z.string(),
  exp: z.number(),
  username: z.string(),
});
export type UserToken = z.infer<typeof tokenSchema>;
