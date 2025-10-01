import { defineConfig } from "drizzle-kit";

import "./src/env/envConfig";
import { env } from "@/env/server";

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
