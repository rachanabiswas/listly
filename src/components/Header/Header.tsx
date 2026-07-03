import Link from "next/link";
import ThemeToggleButton from "../Buttons/ThemeToggleButton";
import UserMenu from "./UserMenu";

const Header = () => {
  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 border-b bg-background/70 shadow backdrop-blur-md"
      aria-label="app-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href={"/"}>
          <h1
            className="text-2xl font-semibold"
            aria-label="App Name">
            Listly
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href={"/dashboard"}>Dashboard</Link>

          <ThemeToggleButton />

          <UserMenu />
        </nav>
      </div>
    </header>
  );
};

export default Header;
