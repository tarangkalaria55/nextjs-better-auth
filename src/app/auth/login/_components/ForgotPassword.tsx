"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";

const forgotPasswordSchema = z.object({
  email: z.email().min(1),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword({
  openSignInTab,
}: {
  openSignInTab: (email: string) => void;
}) {
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { isSubmitting } = form.formState;

  const handleForgotPassword = async (data: ForgotPasswordForm) => {
    await authClient.requestPasswordReset(
      { ...data, redirectTo: "/auth/reset-password" },
      {
        onError: (error) => {
          toast(error.error.message || "Failed to send password reset email");
        },
        onSuccess: () => {
          toast.success("Password reset email sent");
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleForgotPassword)}
      >
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

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => openSignInTab(form.getValues("email"))}
          >
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            <LoadingSwap isLoading={isSubmitting}>Send Rest Email</LoadingSwap>
          </Button>
        </div>
      </form>
    </Form>
  );
}
