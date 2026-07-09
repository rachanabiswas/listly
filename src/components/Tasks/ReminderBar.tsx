"use client";

import { useState } from "react";
import { format } from "date-fns";
import { BellIcon, XIcon } from "lucide-react";
import type { Task } from "@generated/prisma/client";
import { Button } from "@/components/shadcnui/button";

type ReminderBarProps = {
  tasks: Task[];
};

export const ReminderBar = ({ tasks }: ReminderBarProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (tasks.length === 0 || dismissed) return null;

  const now = new Date();

  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/40 dark:bg-amber-950/30">
      <BellIcon className="mt-0.5 size-5 shrink-0 text-amber-500" />
      <div className="flex-1 text-sm text-amber-900 dark:text-amber-200">
        <span className="font-medium">Reminders</span>
        <ul className="mt-1 space-y-1">
          {tasks.map((task) => {
            const isOverdue = task.remindAt && task.remindAt < now;
            return (
              <li key={task.id} className="flex items-center gap-2">
                <span className={isOverdue ? "font-medium text-red-600 dark:text-red-400" : ""}>
                  {task.title}
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400">
                  {task.remindAt && format(task.remindAt, "MMM d, h:mm aa")}
                </span>
                {isOverdue && (
                  <span className="text-[10px] font-medium uppercase tracking-wide text-red-500">
                    Overdue
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss reminders"
      >
        <XIcon className="size-4" />
      </Button>
    </div>
  );
};
