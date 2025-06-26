import env from "@/env";
import { Kysely, SqliteDialect } from "kysely";
import SQLite from "better-sqlite3";
import { resolve } from "path";
import type { DB } from "./types";

const dbPath = resolve(env["DATABASE_URL"] ?? "../private/database.db");

export const createDb = (path = dbPath) =>
  new Kysely<DB>({
    dialect: new SqliteDialect({
      database: new SQLite(path),
    }),
  });
