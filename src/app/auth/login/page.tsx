"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
import SignInTab from "./_components/SignInTab";
import SignUpTab from "./_components/SignUpTab";
import SocialAuthButton from "./_components/SocialAuthButtons";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) router.push("/");
    });
  }, [router]);

  return (
    <Tabs defaultValue="signin" className="mx-auto w-full my-6 px-4">
      <TabsList>
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign In</CardTitle>
          </CardHeader>

          <CardContent>
            <SignInTab />
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
            <SignUpTab />
          </CardContent>

          <Separator />

          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButton />
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
