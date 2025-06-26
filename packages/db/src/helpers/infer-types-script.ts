import { $ } from "bun";
import { resolve } from "path";
import env from "@/env";
await $`bunx --bun kysely-codegen --dialect kysely-bun-sqlite --url=${
  env["DATABASE_URL"]
} --out-file="${resolve(import.meta.dirname, "../types.ts")}"`;
