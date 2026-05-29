"use client";

import { authClient } from "@/lib/auth-client";
import { CheckCheckIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignInForm = () => {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);

    try {
      if (isSignIn) {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message ?? "Invalid credentials");
          return;
        }
        router.push("/");
        router.refresh();
      } else {
        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (signUpError) {
          setError(signUpError.message ?? "Registration failed");
          return;
        }
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <CheckCheckIcon className="text-primary size-6" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to Listly</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isSignIn ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4">
          {!isSignIn && (
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-background focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-background focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-background focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">
            {isPending && <Loader2Icon className="size-4 animate-spin" />}
            {isSignIn ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-muted-foreground text-center text-sm">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignIn(!isSignIn);
              setError("");
            }}
            className="text-primary font-medium hover:underline">
            {isSignIn ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
