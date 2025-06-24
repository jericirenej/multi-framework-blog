import env from "@/env";
import Database from "bun:sqlite";
import { Kysely } from "kysely";
import { BunSqliteDialect } from "kysely-bun-sqlite";
import { resolve } from "path";
import type { DB } from "./types";

const dbPath = resolve(env["DATABASE_URL"] ?? "../private/database.db");

export const createDb = (path = dbPath) =>
  new Kysely<DB>({
    dialect: new BunSqliteDialect({
      database: new Database(path),
    }),
  });
