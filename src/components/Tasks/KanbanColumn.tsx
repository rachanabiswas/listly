"use client";

import type { Task } from "@generated/prisma/client";
import { CircleIcon, ClockIcon, CheckCircle2 as CheckCircleIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/shadcnui/button";
import { TaskCard } from "./TaskCard";
import { TaskDialog } from "./TaskDialog";
import { useState } from "react";

const statusIcons = {
  todo: CircleIcon,
  in_progress: ClockIcon,
  done: CheckCircleIcon,
} as const;

type KanbanColumnProps = {
  status: Task["status"];
  label: string;
  tasks: Task[];
  onCreateTask: (data: { title: string; description?: string; priority: Task["priority"]; dueDate?: string }) => Promise<void>;
  onUpdateTask: (id: string, data: { title: string; description?: string; priority: Task["priority"]; status: Task["status"]; dueDate?: string }) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
};

export const KanbanColumn = ({
  status,
  label,
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}: KanbanColumnProps) => {
  const [showCreate, setShowCreate] = useState(false);
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

      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-muted-foreground"
        onClick={() => setShowCreate(true)}
      >
        <PlusIcon className="size-4" />
        Add task
      </Button>

      <TaskDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSubmit={async (data) => {
          await onCreateTask(data);
          setShowCreate(false);
        }}
      />
    </div>
  );
};
