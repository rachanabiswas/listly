"use client";

import type { Task } from "@generated/prisma/client";
import { format } from "date-fns";
import {
  ArrowDownIcon,
  MinusIcon,
  ArrowUpIcon,
  ChevronsUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  Trash2Icon,
  BellIcon,
} from "lucide-react";
import { Button } from "@/components/shadcnui/button";
import { TaskDialog } from "./TaskDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useState } from "react";

const priorityConfig = {
  low: { icon: ArrowDownIcon, color: "text-emerald-600 dark:text-emerald-400", border: "border-l-emerald-400", badge: "bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:text-slate-400" },
  medium: { icon: MinusIcon, color: "text-emerald-700 dark:text-emerald-500", border: "border-l-emerald-500", badge: "bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400" },
  high: { icon: ArrowUpIcon, color: "text-red-600 dark:text-red-400", border: "border-l-red-400", badge: "bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-400" },
  urgent: { icon: ChevronsUpIcon, color: "text-red-700 dark:text-red-500", border: "border-l-red-500", badge: "bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-400" },
} as const;

const statusOrder = ["todo", "in_progress", "done"] as const;

type TaskCardProps = {
  task: Task;
  onUpdate: (id: string, data: { title: string; description?: string; priority: Task["priority"]; status: Task["status"]; dueDate?: string; remindAt?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export const TaskCard = ({ task, onUpdate, onDelete }: TaskCardProps) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const PriorityIcon = priorityConfig[task.priority].icon;
  const currentIdx = statusOrder.indexOf(task.status);
  const canMoveLeft = currentIdx > 0;
  const canMoveRight = currentIdx < statusOrder.length - 1;

  const moveTask = (direction: "left" | "right") => {
    const newIdx = direction === "left" ? currentIdx - 1 : currentIdx + 1;
    onUpdate(task.id, {
      title: task.title,
      description: task.description ?? undefined,
      priority: task.priority,
      status: statusOrder[newIdx],
      dueDate: task.dueDate?.toISOString() ?? undefined,
      remindAt: task.remindAt?.toISOString() ?? undefined,
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate?.toISOString() ?? null,
        remindAt: task.remindAt?.toISOString() ?? null,
      }),
    );
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      className={`rounded-3xl border border-l-4 bg-card p-3 shadow-sm ${priorityConfig[task.priority].border} ${isDragging ? "opacity-50" : ""}`}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium">{task.title}</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            disabled={!canMoveLeft}
            onClick={() => moveTask("left")}
          >
            <ChevronLeftIcon className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            disabled={!canMoveRight}
            onClick={() => moveTask("right")}
          >
            <ChevronRightIcon className="size-3" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${priorityConfig[task.priority].badge}`}>
          <PriorityIcon className="size-3" />
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-xs text-muted-foreground">
            {format(task.dueDate, "MMM d, yyyy h:mm aa")}
          </span>
        )}
        {task.remindAt && (
          <span className="flex items-center gap-1 text-xs text-amber-500" title={`Reminder: ${format(task.remindAt, "MMM d, yyyy h:mm aa")}`}>
            <BellIcon className="size-3" />
          </span>
        )}
      </div>

      {task.description && (
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-1">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setShowEdit(true)}
        >
          <PencilIcon className="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setShowDelete(true)}
        >
          <Trash2Icon className="size-3" />
        </Button>
      </div>

      <TaskDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        defaultValues={{
          title: task.title,
          description: task.description ?? "",
          priority: task.priority,
          dueDate: task.dueDate?.toISOString() ?? "",
          remindAt: task.remindAt?.toISOString() ?? "",
        }}
        onSubmit={async (data) => {
          await onUpdate(task.id, { ...data, status: task.status });
          setShowEdit(false);
        }}
        isEdit
      />

      <DeleteConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        taskTitle={task.title}
        onConfirm={async () => {
          await onDelete(task.id);
          setShowDelete(false);
        }}
      />
    </div>
  );
};
