import Link from "next/link";
import type { Metadata } from "next";
import { PlusIcon } from "lucide-react";
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

      <Link
        href="/tasks/create"
        className="bg-primary text-primary-foreground hover:bg-primary/90 fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition">
        <PlusIcon className="size-6" />
      </Link>
    </section>
  );
};

export default DashboardPage;
