import { exec } from "child_process";
import { resolve } from "path";
import { promisify } from "util";
await promisify(exec)(
  `bunx --bun kysely-codegen --dialect kysely-bun-sqlite --out-file="${resolve(
    import.meta.dirname,
    "../types.ts"
  )}"`
);
