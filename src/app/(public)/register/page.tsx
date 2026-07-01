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
          <span className="bg-primary/10 mb-2 flex size-12 items-center justify-center justify-self-center rounded-2xl ring-1 ring-foreground/5">
            <UserPlus className="text-primary size-6" />
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
              className="font-medium text-primary underline-offset-4 hover:underline"
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
