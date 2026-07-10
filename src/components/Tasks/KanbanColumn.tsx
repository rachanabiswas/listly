"use client";

import { useState } from "react";
import type { Task } from "@generated/prisma/client";
import { CircleIcon, ClockIcon, CheckCircle2 as CheckCircleIcon } from "lucide-react";
import { TaskCard } from "./TaskCard";

const statusIcons = {
  todo: CircleIcon,
  in_progress: ClockIcon,
  done: CheckCircleIcon,
} as const;

const statusColors = {
  todo: {
    bg: "bg-gray-100/70 dark:bg-gray-900/70",
    text: "text-gray-500 dark:text-gray-400",
    badge: "bg-gray-200/60 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400",
    border: "border-gray-200/60 dark:border-gray-700/50",
  },
  in_progress: {
    bg: "bg-amber-100/70 dark:bg-amber-900/70",
    text: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-200/60 dark:bg-amber-800/50 text-amber-600 dark:text-amber-400",
    border: "border-amber-200/60 dark:border-amber-700/50",
  },
  done: {
    bg: "bg-green-100/70 dark:bg-green-900/70",
    text: "text-green-600 dark:text-green-400",
    badge: "bg-green-200/60 dark:bg-green-800/50 text-green-600 dark:text-green-400",
    border: "border-green-200/60 dark:border-green-700/50",
  },
} as const;

type KanbanColumnProps = {
  status: Task["status"];
  label: string;
  tasks: Task[];
  onUpdateTask: (id: string, data: { title: string; description?: string; priority: Task["priority"]; status: Task["status"]; dueDate?: string; remindAt?: string }) => Promise<void>;
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
  const color = statusColors[status];
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;

    const data = JSON.parse(raw) as {
      id: string;
      title: string;
      description: string | null;
      priority: Task["priority"];
      status: Task["status"];
      dueDate: string | null;
    };

    if (data.id && data.status !== status) {
      onUpdateTask(data.id, {
        title: data.title,
        description: data.description ?? undefined,
        priority: data.priority,
        status,
        dueDate: data.dueDate ?? undefined,
      });
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-4xl border p-4 transition-colors ${color.border} ${color.bg} ${isDragOver ? "ring-2 ring-primary/40" : ""}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`size-4 ${color.text}`} />
          <h2 className={`text-sm font-medium ${color.text}`}>{label}</h2>
          <span className={`flex size-5 items-center justify-center rounded-full text-xs font-medium ${color.badge}`}>
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
