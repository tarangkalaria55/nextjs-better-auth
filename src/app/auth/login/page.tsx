"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth/auth-client";
import EmailVerificationTab from "./_components/EmailVerificationTab";
import ForgotPassword from "./_components/ForgotPassword";
import SignInTab from "./_components/SignInTab";
import SignUpTab from "./_components/SignUpTab";
import SocialAuthButton from "./_components/SocialAuthButtons";

const TAB_LIST = [
  "signin",
  "signup",
  "email-verification",
  "forgot-password",
] as const;

type Tab = (typeof TAB_LIST)[number];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState<Tab>("signin");

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) router.push("/");
    });
  }, [router]);

  const openEmailVerificationTab = (email: string) => {
    setEmail(email);
    setSelectedTab("email-verification");
  };

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(t) => setSelectedTab(t as Tab)}
      className="mx-auto w-full my-6 px-4"
    >
      {(selectedTab === "signin" || selectedTab === "signup") && (
        <TabsList>
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
      )}

      <TabsContent value="signin">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign In</CardTitle>
          </CardHeader>

          <CardContent>
            <SignInTab openEmailVerificationTab={openEmailVerificationTab} />
          </CardContent>

          <Separator />

          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButton />
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>

          <CardContent>
            <SignUpTab openEmailVerificationTab={openEmailVerificationTab} />
          </CardContent>

          <Separator />

          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButton />
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="email-verification">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Verify Your Email</CardTitle>
          </CardHeader>

          <CardContent>
            <EmailVerificationTab email={email} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="forgot-password">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Forgot Password</CardTitle>
          </CardHeader>

          <CardContent>
            <ForgotPassword openSignInTab={() => setSelectedTab("signin")} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
