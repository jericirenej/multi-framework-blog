import { Kysely } from "kysely";
import type { DB } from "./types";
import { BunSqliteDialect } from "kysely-bun-sqlite";
import Database from "bun:sqlite";
import { resolve } from "path";

const dbPath = resolve(import.meta.dirname, "./database.db");

export const createDb = (path = dbPath) =>
  new Kysely<DB>({
    dialect: new BunSqliteDialect({
      database: new Database(path),
    }),
  });
