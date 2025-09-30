import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { envHelper } from "./helper";

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
  ...envHelper,
});
