import Header from "@/components/Header/Header";
import type { LayoutProps } from "@/lib/types";

const PublicLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl">{children}</main>
    </>
  );
};

export default PublicLayout;
