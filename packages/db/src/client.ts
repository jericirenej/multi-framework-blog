import { Kysely, SqliteDialect } from "kysely";
import SQLite from "better-sqlite3";
import { resolve } from "path";
import type { DB } from "./types";
import env from "@/env";

const dbPath =
  env().DATABASE_URL ?? resolve(import.meta.dirname, "../private/database.db");

export const createDb = (path = dbPath) =>
  new Kysely<DB>({
    dialect: new SqliteDialect({
      database: new SQLite(path),
    }),
  });
