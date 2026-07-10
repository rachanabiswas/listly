import LoginForm from "@/components/Auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { ListChecks } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

const LoginPage = () => {
  return (
    <section className="grid min-h-dvh place-items-center px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-12 items-center justify-center justify-self-center rounded-2xl bg-rose-100/60 ring-1 ring-foreground/5 dark:bg-rose-900/40">
            <ListChecks className="size-6 text-rose-600 dark:text-rose-400" />
          </span>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-muted-foreground text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-rose-600 underline-offset-4 hover:underline dark:text-rose-400">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};

export default LoginPage;
