import Header from "@/components/Header/Header";
import type { LayoutProps } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const PrivateLayout = async ({ children }: LayoutProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl">{children}</main>
    </>
  );
};

export default PrivateLayout;
