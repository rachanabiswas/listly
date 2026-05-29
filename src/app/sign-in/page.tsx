import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In — Listly",
  description: "Sign in to your Listly account",
};

const SignInPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) {
    redirect("/");
  }

  return <SignInForm />;
};

export default SignInPage;
