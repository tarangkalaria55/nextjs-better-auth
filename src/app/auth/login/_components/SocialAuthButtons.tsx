"use client";

import { BetterAuthActionButton } from "@/components/auth/BetterAuthActionButton";
import { authClient } from "@/lib/auth/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
} from "@/lib/auth/o-auth-providers";

export default function SocialAuthButton() {
  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const name = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name;
    const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;
    return (
      <BetterAuthActionButton
        variant="outline"
        key={provider}
        action={() => {
          return authClient.signIn.social({ provider, callbackURL: "/" });
        }}
      >
        <Icon />
        {name}
      </BetterAuthActionButton>
    );
  });
}
