import "@/env/envConfig";

import { defineConfig } from "drizzle-kit";
import { env } from "@/env/server";

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  strict: true,
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
