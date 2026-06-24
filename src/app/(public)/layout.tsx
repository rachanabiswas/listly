"use client";

import type { LayoutProps } from "@/lib/types";

const PublicLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <main className="mx-auto max-w-7xl">{children}</main>
    </>
  );
};

export default PublicLayout;
