"use client";

import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggleButton from "../Buttons/ThemeToggleButton";

const Header = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 border-b shadow"
      aria-label="app-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href={"/"}>
          <h1
            className="text-2xl font-bold tracking-tight"
            aria-label="App Name">
            <span className="text-primary">Listly</span>
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          {session?.user ?
            <>
              <span className="text-muted-foreground text-sm">
                {session.user.name ?? session.user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
                aria-label="Sign out">
                <LogOutIcon className="size-4" />
                Sign Out
              </button>
            </>
          : <Link
              href="/sign-in"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Sign In
            </Link>
          }

          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
