/** biome-ignore-all lint/correctness/useExhaustiveDependencies: **** */
"use client";

import { useEffect, useRef, useState } from "react";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { authClient } from "@/lib/auth/auth-client";

export function EmailVerification({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const interval = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    startEmailVerificationCountdown();
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  function startEmailVerificationCountdown(time = 30) {
    setTimeToNextResend(time);
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1;
        if (newT <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return newT;
      });
    }, 1000);
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mt-2">
        We send you a verification link. Please check your email
      </div>

      <BetterAuthActionButton
        variant="outline"
        className="w-full"
        successMessage="Verification email sent!"
        disabled={timeToNextResend > 0}
        action={() => {
          startEmailVerificationCountdown();
          return authClient.sendVerificationEmail({ email, callbackURL: "/" });
        }}
      >
        {timeToNextResend > 0
          ? `Resend Email (${timeToNextResend})`
          : `Resend Email`}
      </BetterAuthActionButton>
    </div>
  );
}
