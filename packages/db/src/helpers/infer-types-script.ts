import { $ } from "zx";
import { resolve } from "path";
import env from "@/env";
await $`npx kysely-codegen --dialect sqlite --url=${
  env["DATABASE_URL"]
} --out-file="${resolve(import.meta.dirname, "../types.ts")}"`;
