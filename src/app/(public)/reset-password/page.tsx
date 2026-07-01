import { Suspense } from "react";
import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shadcnui/card";
import { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password",
};

const ResetPasswordPage = () => {
  return (
    <section className="relative grid min-h-dvh place-items-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <Card className="relative w-full max-w-sm shadow-lg">
        <CardHeader className="items-center text-center">
          <span className="bg-primary/10 mb-2 flex size-12 items-center justify-center justify-self-center rounded-2xl ring-1 ring-foreground/5">
            <ShieldCheck className="text-primary size-6" />
          </span>
          <CardTitle className="text-xl">Set new password</CardTitle>
          <CardDescription>
            Choose a strong password for your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </section>
  );
};

export default ResetPasswordPage;
