import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/auth";

const authHandlers = toNextJsHandler(auth);

export const { GET } = authHandlers;

export async function POST(request: Request) {
  return authHandlers.POST(request);
}
