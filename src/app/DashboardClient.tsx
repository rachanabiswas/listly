"use client";

import type { ListWithCount, TaskWithList } from "@/app/actions/tasks";
import Sidebar from "@/components/Sidebar/Sidebar";
import TaskCard from "@/components/TaskCard/TaskCard";
import TaskFormModal from "@/components/TaskFormModal/TaskFormModal";
import { ListTodoIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

type DashboardClientProps = {
  tasks: TaskWithList[];
  lists: ListWithCount[];
  pageTitle: string;
  filter?: string;
};

const DashboardClient = ({
  tasks,
  lists,
  pageTitle,
  filter,
}: DashboardClientProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithList | null>(null);

  const handleEdit = (task: TaskWithList) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const incompleteTasks = tasks.filter((t) => !t.isCompleted);
  const completedTasks = tasks.filter((t) => t.isCompleted);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground text-sm">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
            <PlusIcon className="size-4" />
            Add Task
          </button>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {tasks.length === 0 ?
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ListTodoIcon className="text-muted-foreground/40 mb-4 size-16" />
              <h2 className="text-muted-foreground text-lg font-semibold">
                {filter === "today" ?
                  "No tasks for today"
                : filter === "important" ?
                  "No important tasks"
                : filter === "completed" ?
                  "No completed tasks"
                : "No tasks yet"}
              </h2>
              <p className="text-muted-foreground/60 mt-1 text-sm">
                {filter ?
                  "Switch to a different view or create a new task"
                : "Create your first task to get started"}
              </p>
              {!filter && (
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                  <PlusIcon className="size-4" />
                  Create Task
                </button>
              )}
            </div>
          : <div className="space-y-3">
              {/* Incomplete Tasks */}
              {incompleteTasks.length > 0 && (
                <div className="space-y-2">
                  {!filter && (
                    <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Tasks — {incompleteTasks.length}
                    </h2>
                  )}
                  <div className="space-y-2">
                    {incompleteTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div className="space-y-2 pt-4">
                  <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Completed — {completedTasks.length}
                  </h2>
                  <div className="space-y-2">
                    {completedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          }
        </div>
      </div>

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleClose}
        task={editingTask}
      />
    </div>
  );
};

export default DashboardClient;
