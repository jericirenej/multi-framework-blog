import { resolve } from "path";
import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    include: ["./src/**.spec.ts"],
    alias: {
      "@/db": resolve(import.meta.dirname, "../db/src"),
      "@/env": resolve(import.meta.dirname, "../env/index.ts"),
    },
  },
});
