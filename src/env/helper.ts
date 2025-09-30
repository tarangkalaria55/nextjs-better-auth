import type { createEnv } from "@t3-oss/env-nextjs";

export const envHelper = {
  emptyStringAsUndefined: true,
  // Called when the schema validation fails.
  onValidationError: (issues) => {
    console.error("❌ Invalid environment variables:", issues);

    const msg = issues
      .map(
        (issue, idx) =>
          `MESSAGE_${idx + 1}: ${issue.message}; PATH_${idx + 1}: ${JSON.stringify(issue.path ?? "")};`,
      )
      .join();
    throw new Error(`Invalid environment variables: ${msg}`);
  },
  // Called when server variables are accessed on the client.
  onInvalidAccess: (variable) => {
    throw new Error(
      `❌ Attempted to access a server-side environment variable: ${variable} on the client`,
    );
  },
} satisfies Pick<
  Parameters<typeof createEnv>[0],
  "emptyStringAsUndefined" | "onValidationError" | "onInvalidAccess"
>;
