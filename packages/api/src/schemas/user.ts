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

export const userDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
});

export const userWithExpirationDtoSchema = userDtoSchema.extend({
  exp: z.number(),
});

export const authenticatedDtoSchema = z.object({ authenticated: z.boolean() });

export type UserToken = z.infer<typeof tokenSchema>;
export type UserCredentials = z.infer<typeof userSchema>;
export type UserDto = z.infer<typeof userDtoSchema>;
export type UserWithExpirationDto = z.infer<typeof userWithExpirationDtoSchema>;
export type AuthenticatedDto = z.infer<typeof authenticatedDtoSchema>;
