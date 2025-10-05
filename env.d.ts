// export {};

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly TZ?: string;

    // Database
    readonly DATABASE_URL: string;

    // Better Auth
    readonly BETTER_AUTH_SECRET: string;
    readonly BETTER_AUTH_URL: string;

    // Arcjet
    readonly ARCJET_API_KEY: string;

    // Github
    readonly GITHUB_CLIENT_ID: string;
    readonly GITHUB_CLIENT_SECRET: string;

    // Google
    readonly GOOGLE_CLIENT_ID: string;
    readonly GOOGLE_CLIENT_SECRET: string;

    // Email Config
    readonly EMAIL_SERVER_USER: string;
    readonly EMAIL_SERVER_PASSWORD: string;
    readonly EMAIL_SERVER_HOST: string;
    readonly EMAIL_SERVER_PORT: string;
    readonly EMAIL_FROM: string;
  }
}
