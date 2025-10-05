import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { envHelper } from "./helper";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),

    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),

    ARCJET_API_KEY: z.string().min(1),

    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),

    EMAIL_SERVER_USER: z.string().min(1),
    EMAIL_SERVER_PASSWORD: z.string().min(1),
    EMAIL_SERVER_HOST: z.string().min(1),
    EMAIL_SERVER_PORT: z.coerce.number(),
    EMAIL_FROM: z.string().min(1),

    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    STRIPE_BASIC_PRICE_ID: z.string().min(1),
    STRIPE_PRO_PRICE_ID: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
  ...envHelper,
});
