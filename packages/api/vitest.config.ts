// @ts-check
import { resolve } from "path";
import { defineProject } from "vitest/config";
const c: any = 2;
export default defineProject({
  test: {
    include: ["./src/**.spec.ts"],
    env: { DATABASE_URL: resolve(import.meta.dirname, "../db/tmp/db-test.db") },

    alias: {
      "@/db": resolve(import.meta.dirname, "../db/src"),
      "@/env": resolve(import.meta.dirname, "../env/index.ts"),
    },
  },
});
