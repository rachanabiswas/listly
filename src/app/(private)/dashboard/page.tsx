import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/database/dbClient";
import { KanbanBoard } from "@/components/Tasks/KanbanBoard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your kanban task board",
};

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/");
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="py-8">
      <KanbanBoard initialTasks={tasks} />
    </section>
  );
};

export default DashboardPage;
