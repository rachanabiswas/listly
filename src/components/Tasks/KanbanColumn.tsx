"use client";

import type { Task } from "@generated/prisma/client";
import { CircleIcon, ClockIcon, CheckCircle2 as CheckCircleIcon } from "lucide-react";
import { TaskCard } from "./TaskCard";

const statusIcons = {
  todo: CircleIcon,
  in_progress: ClockIcon,
  done: CheckCircleIcon,
} as const;

type KanbanColumnProps = {
  status: Task["status"];
  label: string;
  tasks: Task[];
  onUpdateTask: (id: string, data: { title: string; description?: string; priority: Task["priority"]; status: Task["status"]; dueDate?: string }) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
};

export const KanbanColumn = ({
  status,
  label,
  tasks,
  onUpdateTask,
  onDeleteTask,
}: KanbanColumnProps) => {
  const Icon = statusIcons[status];

  return (
    <div className="flex flex-col gap-4 rounded-4xl bg-muted/50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-medium">{label}</h2>
          <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};
