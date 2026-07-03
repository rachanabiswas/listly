import Link from "next/link";
import { PlusIcon } from "lucide-react";
import ThemeToggleButton from "../Buttons/ThemeToggleButton";
import UserMenu from "./UserMenu";
import { Button } from "@/components/shadcnui/button";

const Header = () => {
  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 border-b bg-background/70 shadow backdrop-blur-md"
      aria-label="app-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href={"/dashboard"}>
          <h1
            className="text-2xl font-semibold"
            aria-label="App Name">
            Listly
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href={"/tasks/create"}>
            <Button variant="ghost" size="sm" className="gap-1">
              <PlusIcon className="size-4" />
              New Task
            </Button>
          </Link>

          <UserMenu />

          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
