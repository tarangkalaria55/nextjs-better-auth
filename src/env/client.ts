import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { envHelper } from "./helper";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_VAR: z.string().optional().or(z.literal("")),
  },
  runtimeEnv: {
    NEXT_PUBLIC_VAR: process.env.NEXT_PUBLIC_VAR,
  },
  ...envHelper,
});
