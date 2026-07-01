"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Loader2, ArrowLeft } from "lucide-react";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormType,
} from "@/lib/zodSchema";
import { authClient } from "@/lib/auth-client";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { Button } from "@/components/shadcnui/button";
import Link from "next/link";

const ForgotPasswordForm = () => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "all",
  });

  const onSubmit = async (data: ForgotPasswordFormType) => {
    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error.message || "Failed to send reset email",
      );
      return;
    }

    toast.success("If an account exists, a reset link has been sent.");
  };

  if (isSubmitSuccessful) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-muted-foreground">
          Check your email for a password reset link. It may take a few minutes
          to arrive.
        </p>
        <Link
          href="/"
          className="text-primary text-sm font-medium underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              aria-invalid={fieldState.invalid}
              autoComplete="email"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Sending...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <Link
        href="/"
        className="text-muted-foreground mt-2 inline-flex items-center justify-center gap-1 text-sm underline-offset-4 hover:underline">
        <ArrowLeft className="size-3" />
        Back to sign in
      </Link>
    </form>
  );
};

export default ForgotPasswordForm;
