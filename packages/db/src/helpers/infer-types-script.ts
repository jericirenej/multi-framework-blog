import env from "@/env";
import { resolve } from "path";
import { $ } from "zx";

await $`npx kysely-codegen --dialect sqlite --url=${
  env().DATABASE_URL
} --out-file="${resolve(import.meta.dirname, "../types.ts")}"`;
