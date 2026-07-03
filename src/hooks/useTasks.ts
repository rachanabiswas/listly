"use client";

import { useState, useCallback } from "react";
import type { Task } from "@generated/prisma/client";
import { updateTask } from "@/server/tasks/updateTask";
import { deleteTask } from "@/server/tasks/deleteTask";

export const useTasks = (initialTasks: Task[]) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateTask = useCallback(
    async (
      id: string,
      data: {
        title: string;
        description?: string;
        priority: Task["priority"];
        status: Task["status"];
        dueDate?: string;
      },
    ) => {
      setIsLoading(true);
      try {
        const updated = await updateTask(id, data);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const handleDeleteTask = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tasks,
    isLoading,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
  };
};
