import RegisterForm from "@/components/Auth/RegisterForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shadcnui/card";
import { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

const RegisterPage = () => {
  return (
    <section className="grid min-h-dvh place-items-center px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-12 items-center justify-center justify-self-center rounded-2xl bg-rose-100/60 ring-1 ring-foreground/5 dark:bg-rose-900/40">
            <UserPlus className="size-6 text-rose-600 dark:text-rose-400" />
          </span>
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Get started with a free account</CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm />
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/"
              className="font-medium text-rose-600 underline-offset-4 hover:underline dark:text-rose-400"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};

export default RegisterPage;
