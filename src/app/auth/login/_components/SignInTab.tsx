"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth/auth-client";

const signInSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(6),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInTab({
  openEmailVerificationTab,
}: {
  openEmailVerificationTab: (email: string) => void;
}) {
  const router = useRouter();
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const { isSubmitting } = form.formState;

  const handleSignIn = async (data: SignInForm) => {
    const res = await authClient.signIn.email(
      {
        ...data,
        callbackURL: "/",
      },
      {
        onError: (error) => {
          console.log(error);

          if (error.error.code === "EMAIL_NOT_VERIFIED") {
            openEmailVerificationTab(data.email);
          }

          toast.error(error.error.message || "Failed to sign up");
        },
        onSuccess: () => {
          router.push("/");
        },
      },
    );

    if (res.error == null && !res.data.user.emailVerified) {
      openEmailVerificationTab(res.data.user.email);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSignIn)}>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          <LoadingSwap isLoading={isSubmitting}>Sign In</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
