"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboardIcon, LogOutIcon, UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import type { Session } from "@/lib/auth";
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

interface UserMenuProps {
  session: Session;
}

const UserMenu = ({ session }: UserMenuProps) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm">
            {session.user.image ?
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={16}
                height={16}
                className="size-4 rounded-full object-cover"
                unoptimized
              />
            : <UserIcon className="size-4" />}
          </Button>
        }
      />

      <DropdownMenuContent
        align="end"
        className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3">
              {session.user.image ?
                <Image
                  src={session.user.image}
                  alt={session.user.name}
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                  unoptimized
                />
              : <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full text-sm font-semibold">
                  {session.user.name.charAt(0).toUpperCase()}
                </div>
              }
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-muted-foreground text-xs">
                  {session.user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5">
              <LayoutDashboardIcon className="size-4" />
              Dashboard
            </Link>
          }
        />

        <DropdownMenuItem
          render={
            <Link
              href="/profile"
              className="flex items-center gap-2.5">
              <UserIcon className="size-4" />
              Profile
            </Link>
          }
        />

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}>
          <LogOutIcon className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
