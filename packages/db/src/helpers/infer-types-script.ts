import { $ } from "bun";
import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
await $`bunx --bun kysely-codegen --dialect kysely-bun-sqlite --out-file="${resolve(
  import.meta.dirname,
  "../types.ts"
)}"`;
