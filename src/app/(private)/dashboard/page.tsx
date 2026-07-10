import type { Metadata } from "next";
import { getServerSession } from "@/server/getServerSession";
import prisma from "@/lib/database/dbClient";
import { KanbanBoard } from "@/components/Tasks/KanbanBoard";
import { ReminderBar } from "@/components/Tasks/ReminderBar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your kanban task board",
};

const DashboardPage = async () => {
  const session = await getServerSession();

  const tasks = await prisma.task.findMany({
    where: { userId: session!.user.id },
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
