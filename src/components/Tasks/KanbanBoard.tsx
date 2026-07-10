"use client";

import type { Task } from "@generated/prisma/client";
import { useTasks } from "@/hooks/useTasks";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { KanbanColumn } from "./KanbanColumn";

type KanbanBoardProps = {
  initialTasks: Task[];
};

export const KanbanBoard = ({ initialTasks }: KanbanBoardProps) => {
  const { tasks, updateTask, deleteTask } =
    useTasks(initialTasks);

  useAutoScroll();

  const columns = [
    { status: "todo" as const, label: "Todo" },
    { status: "in_progress" as const, label: "In Progress" },
    { status: "done" as const, label: "Done" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {columns.map(({ status, label }) => (
        <KanbanColumn
          key={status}
          status={status}
          label={label}
          tasks={tasks.filter((t) => t.status === status)}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
      ))}
    </div>
  );
};
