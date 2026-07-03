"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboardIcon, LogOutIcon, UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/shadcnui/dropdown-menu";
import { Button } from "@/components/shadcnui/button";

const UserMenu = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session) {
    return (
      <Button variant="ghost" size="icon-sm" disabled>
        <UserIcon className="size-4" />
      </Button>
    );
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm">
            <UserIcon className="size-4" />
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <LayoutDashboardIcon className="size-4" />
              Dashboard
            </Link>
          }
        />

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
        >
          <LogOutIcon className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
