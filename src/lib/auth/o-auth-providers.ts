import type { ComponentProps, ElementType } from "react";
import {
  DiscordIcon,
  GitHubIcon,
  GoogleIcon,
} from "@/components/auth/o-auth-icons";

export const SUPPORTED_OAUTH_PROVIDERS = [
  "discord",
  "github",
  "google",
] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: ElementType<ComponentProps<"svg">> }
> = {
  discord: { name: "Discord", Icon: DiscordIcon },
  github: { name: "GitHub", Icon: GitHubIcon },
  google: { name: "Google", Icon: GoogleIcon },
};
