import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your dashboard",
};

const DashboardPage = () => {
  return (
    <section className="grid h-dvh place-items-center">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Dashboard
        </h1>
      </div>
    </section>
  );
};

export default DashboardPage;
