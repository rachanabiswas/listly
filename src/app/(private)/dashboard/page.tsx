import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/database/dbClient";
import { KanbanBoard } from "@/components/Tasks/KanbanBoard";
import { ReminderBar } from "@/components/Tasks/ReminderBar";

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

  const remindedTasks = tasks.filter((t) => t.remindAt !== null);

  return (
    <section className="py-8">
      <ReminderBar tasks={remindedTasks} />
      <KanbanBoard initialTasks={tasks} />
    </section>
  );
};

export default DashboardPage;
