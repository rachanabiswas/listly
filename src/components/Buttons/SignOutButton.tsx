"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/shadcnui/button";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Button variant="ghost" size="icon-sm" onClick={handleSignOut} aria-label="Sign out">
      <LogOut />
    </Button>
  );
};

export default SignOutButton;
