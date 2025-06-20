import { defineConfig } from "kysely-ctl";
import kysely from "../db/client-singleton";

export default defineConfig({
  kysely,
  migrations: {
    migrationFolder: "db/migrations",
  },
  seeds: { seedFolder: "db/seed" },
});
