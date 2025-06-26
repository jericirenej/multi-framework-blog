import db from "@/db/client-singleton";
import type { DB, User } from "@/db/types";
import env from "@/env";
import argon2 from "argon2";
import { randomUUIDv7 } from "bun";
import { add } from "date-fns";
import { HTTPException } from "hono/http-exception";
import type { Cookie } from "hono/utils/cookie";
import { decodeJwt, jwtVerify, SignJWT } from "jose";
import type { Insertable, Kysely } from "kysely";
import { JWT_COOKIE } from "../constants";
import { tokenSchema, type UserToken } from "../schemas";

type AuthUser = Record<"username" | "password", string>;
export class AuthService {
  protected secret = new TextEncoder().encode(env["SERVER_SECRET"]);
  readonly jwtCookie = JWT_COOKIE;

  constructor(protected db: Kysely<DB>) {}

  protected invalidatedSessions = new Set<string>();
  clearInvalidatedSessionsCache() {
    this.invalidatedSessions.clear();
  }

  async authenticate(user: AuthUser): Promise<boolean> {
    return this.verifyPassword(user);
  }

  getCookieToken(cookies: Cookie): string | undefined {
    return cookies[this.jwtCookie];
  }

  async verifyToken(jwt: string | undefined): Promise<UserToken> {
    try {
      if (!jwt)
        throw new HTTPException(401, {
          message: "Cannot logout if not logged in",
        });
      await jwtVerify(jwt, this.secret);
    } catch (err) {
      throw new HTTPException(401, {
        message:
          err instanceof Error ? err.message : "Error while verifying token",
      });
    }
    const parsed = this.parseToken(jwt);
    await this.isSessionInvalidated(jwt);
    return parsed;
  }

  async isAuthenticated(jwt: string | undefined): Promise<boolean> {
    try {
      await this.verifyToken(jwt);
      return true;
    } catch {
      return false;
    }
  }
  protected async isSessionInvalidated(jwt: string): Promise<void> {
    const isInvalid = this.invalidatedSessions.has(jwt)
      ? true
      : (
          await this.db
            .selectFrom("invalidated_sessions")
            .select((eb) =>
              eb.fn.count<number>("jwt_hash").as("is_invalidated")
            )
            .where("jwt_hash", "=", await argon2.hash(jwt))
            .executeTakeFirstOrThrow()
        ).is_invalidated;
    if (isInvalid) {
      await this.logout(jwt);
      throw new HTTPException(401, { message: "Invalidated session" });
    }
  }
  protected parseToken(token: string | undefined) {
    if (token === undefined) {
      throw new HTTPException(401);
    }
    const decoded = decodeJwt(token);
    const validated = tokenSchema.parse(decoded);
    if (validated.exp * 1e3 < Date.now()) {
      throw new HTTPException(401, { message: "Token expired" });
    }
    return validated;
  }
  async sign({ username }: AuthUser, expirationTime: Date): Promise<string> {
    const { id } = await this.db
      .selectFrom("user")
      .select("id")
      .where("username", "=", username)
      .executeTakeFirstOrThrow();
    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(id)
      .setExpirationTime(expirationTime)
      .sign(this.secret);
    return token;
  }

  get expirationTime() {
    return add(Date.now(), { days: 1 });
  }

  async logout(token: string) {
    const jwt_hash = await Bun.password.hash(token);
    await this.cleanInvalidatedSessions();

    await db
      .insertInto("invalidated_sessions")
      .values({
        jwt_hash,
        exp: this.parseToken(token).exp,
      })
      .execute();
    this.invalidatedSessions.add(token);
    return true;
  }

  protected async cleanInvalidatedSessions() {
    // Clean up any invalidated sessions that are already expired
    const cleared = await db
      .deleteFrom("invalidated_sessions")
      .where("exp", "<", Date.now() / 1e3)
      .returning("jwt_hash")
      .execute();
    cleared.forEach(({ jwt_hash }) => {
      this.invalidatedSessions.delete(jwt_hash);
    });
  }

  async verifyPassword(passedUser: AuthUser): Promise<boolean> {
    const user = await this.db
      .selectFrom("user")
      .select("password")
      .where("username", "=", passedUser.username)
      .executeTakeFirst();
    if (!user) return false;
    return Bun.password.verify(passedUser.password, user.password);
  }

  async generateUser(data: Omit<Insertable<User>, "id">): Promise<AuthUser> {
    const user = {
      id: randomUUIDv7(),
      username: data.username,
      password: Bun.password.hashSync(data.password),
      name: data.name,
    };
    await this.db.insertInto("user").values(user).executeTakeFirstOrThrow();
    return user;
  }

  async getUserByUsername(
    username: string
  ): Promise<Omit<User, "password"> | undefined> {
    return this.getCompleteUser
      .where("username", "=", username)
      .executeTakeFirst();
  }

  async getUserById(id: string): Promise<Omit<User, "password">> {
    return this.getCompleteUser.where("id", "=", id).executeTakeFirstOrThrow();
  }

  protected get getCompleteUser() {
    return this.db.selectFrom("user").select(["id", "name", "username"]);
  }
}

const authService = new AuthService(db);
export default authService;
