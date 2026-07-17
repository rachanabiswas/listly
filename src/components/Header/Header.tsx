import Link from "next/link";
import ThemeToggleButton from "../Buttons/ThemeToggleButton";
import UserMenu from "./UserMenu";
import type { Session } from "@/lib/auth";

interface HeaderProps {
  session: Session;
}

const Header = ({ session }: HeaderProps) => {
  return (
    <header
      className="bg-background/70 fixed top-0 right-0 left-0 z-50 border-b shadow backdrop-blur-md"
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
          <UserMenu session={session} />

          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
