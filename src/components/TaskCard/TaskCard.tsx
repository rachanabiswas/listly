"use client";

import type { TaskWithList } from "@/app/actions/tasks";
import { deleteTask, toggleTaskCompletion } from "@/app/actions/tasks";
import { cn } from "@/lib/utils";
import { CalendarIcon, FlagIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { useTransition } from "react";

type TaskCardProps = {
  task: TaskWithList;
  onEdit: (task: TaskWithList) => void;
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  high: { label: "High", color: "text-red-500" },
  medium: { label: "Medium", color: "text-yellow-500" },
  low: { label: "Low", color: "text-green-500" },
};

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTaskCompletion(task.id);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTask(task.id);
    });
  };

  const priority = priorityConfig[task.priority] ?? priorityConfig.medium;
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && !task.isCompleted;

  return (
    <div
      className={cn(
        "group hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-4 transition-colors",
        task.isCompleted && "bg-muted/50 opacity-70",
      )}>
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          task.isCompleted ?
            "border-primary bg-primary text-primary-foreground"
          : "border-muted-foreground hover:border-primary",
        )}
        aria-label={
          task.isCompleted ? "Mark as incomplete" : "Mark as complete"
        }>
        {isPending ?
          <Loader2Icon className="size-3 animate-spin" />
        : task.isCompleted ?
          <svg
            className="size-3"
            viewBox="0 0 12 12"
            fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        : null}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <button
            onClick={() => onEdit(task)}
            className="min-w-0 flex-1 text-left">
            <h3
              className={cn(
                "truncate text-sm font-medium",
                task.isCompleted && "text-muted-foreground line-through",
              )}>
              {task.title}
            </h3>
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-muted-foreground hover:text-destructive shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Delete task">
            <Trash2Icon className="size-4" />
          </button>
        </div>

        {task.description && (
          <p
            className={cn(
              "text-muted-foreground mt-1 line-clamp-2 text-sm",
              task.isCompleted && "line-through",
            )}>
            {task.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {/* Priority Badge */}
          <span
            className={cn("flex items-center gap-1 text-xs", priority.color)}>
            <FlagIcon className="size-3" />
            {priority.label}
          </span>

          {/* Due Date */}
          {dueDate && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs",
                isOverdue ?
                  "font-medium text-red-500"
                : "text-muted-foreground",
              )}>
              <CalendarIcon className="size-3" />
              {dueDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              {isOverdue && " (Overdue)"}
            </span>
          )}

          {/* List Badge */}
          <span
            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
            style={{
              backgroundColor: `${task.list.color}20`,
              color: task.list.color,
            }}>
            {task.list.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
