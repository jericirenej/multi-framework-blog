import { defineConfig } from "kysely-ctl";
import kysely from "../src/client-singleton";

export default defineConfig({
  kysely,
  migrations: {
    migrationFolder: "src/migrations",
  },
  seeds: { seedFolder: "src/seed" },
});
