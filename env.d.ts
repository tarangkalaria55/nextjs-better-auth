// export {};

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly TZ?: string;

    readonly DATABASE_URL: string;

    readonly BETTER_AUTH_SECRET: string;
    readonly BETTER_AUTH_URL: string;

    readonly ARCJET_API_KEY: string;
  }
}
