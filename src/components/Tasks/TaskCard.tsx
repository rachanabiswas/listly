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
} from "lucide-react";
import { Button } from "@/components/shadcnui/button";
import { TaskDialog } from "./TaskDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useState } from "react";

const priorityConfig = {
  low: { icon: ArrowDownIcon, color: "text-slate-500" },
  medium: { icon: MinusIcon, color: "text-blue-500" },
  high: { icon: ArrowUpIcon, color: "text-amber-500" },
  urgent: { icon: ChevronsUpIcon, color: "text-red-500" },
} as const;

const statusOrder = ["todo", "in_progress", "done"] as const;

type TaskCardProps = {
  task: Task;
  onUpdate: (id: string, data: { title: string; description?: string; priority: Task["priority"]; status: Task["status"]; dueDate?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export const TaskCard = ({ task, onUpdate, onDelete }: TaskCardProps) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
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
    });
  };

  return (
    <div className="rounded-3xl border bg-card p-3 shadow-sm">
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
        <span className={`inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs ${priorityConfig[task.priority].color}`}>
          <PriorityIcon className="size-3" />
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-xs text-muted-foreground">
            {format(task.dueDate, "MMM d, yyyy")}
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
