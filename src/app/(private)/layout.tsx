import Header from "@/components/Header/Header";
import type { LayoutProps } from "@/lib/types";

const PrivateLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl">{children}</main>
    </>
  );
};

export default PrivateLayout;
