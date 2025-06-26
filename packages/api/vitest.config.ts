import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    include: ["./src/**.spec.ts"],
    alias: {
      "@/db/": new URL("./node_modules/@/db/src/", import.meta.url).pathname,
    },
  },
});
