"use client";

import type { Task } from "@generated/prisma/client";
import { useTasks } from "@/hooks/useTasks";
import { KanbanColumn } from "./KanbanColumn";

type KanbanBoardProps = {
  initialTasks: Task[];
};

export const KanbanBoard = ({ initialTasks }: KanbanBoardProps) => {
  const { tasks, createTask, updateTask, deleteTask } =
    useTasks(initialTasks);

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
          onCreateTask={createTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
      ))}
    </div>
  );
};
