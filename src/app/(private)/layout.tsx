import Header from "@/components/Header/Header";
import type { LayoutProps } from "@/lib/types";
import { getServerSession } from "@/server/getServerSession";
import { redirect } from "next/navigation";

const PrivateLayout = async ({ children }: LayoutProps) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Header session={session} />

      <main className="mx-auto max-w-7xl pt-16">{children}</main>
    </>
  );
};

export default PrivateLayout;
