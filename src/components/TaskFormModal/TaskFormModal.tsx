"use client";

import type { TaskWithList } from "@/app/actions/tasks";
import { createTask, getLists, updateTask } from "@/app/actions/tasks";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  FlagIcon,
  ListIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";

type ListItem = Awaited<ReturnType<typeof getLists>>[number];

type TaskFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskWithList | null;
};

const priorityOptions = [
  { value: "low", label: "Low", color: "text-green-500" },
  { value: "medium", label: "Medium", color: "text-yellow-500" },
  { value: "high", label: "High", color: "text-red-500" },
] as const;

const TaskFormModal = ({ isOpen, onClose, task }: TaskFormModalProps) => {
  const [isPending, startTransition] = useTransition();
  const [lists, setLists] = useState<ListItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [listId, setListId] = useState("");
  const [error, setError] = useState("");

  const fetchLists = useCallback(async () => {
    const data = await getLists();
    setLists(data);
    if (data.length > 0 && !task) {
      setListId(data[0].id);
    }
  }, [task]);

  useEffect(() => {
    if (isOpen) {
      fetchLists();
      if (task) {
        setTitle(task.title);
        setDescription(task.description ?? "");
        setPriority(task.priority);
        setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
        setListId(task.listId);
      } else {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
      }
      setError("");
    }
  }, [isOpen, task, fetchLists]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!listId) {
      setError("Please select a list");
      return;
    }

    startTransition(async () => {
      try {
        if (task) {
          await updateTask(task.id, {
            title: title.trim(),
            description: description.trim() || undefined,
            priority: priority as "low" | "medium" | "high",
            dueDate: dueDate || null,
            listId,
          });
        } else {
          await createTask({
            title: title.trim(),
            description: description.trim() || undefined,
            priority: priority as "low" | "medium" | "high",
            dueDate: dueDate || null,
            listId,
          });
        }
        onClose();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-card relative z-10 w-full max-w-lg rounded-xl border p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {task ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
            aria-label="Close modal">
            <XIcon className="size-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="bg-background focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              className="bg-background focus:ring-primary w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          {/* Priority & Due Date Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Priority
              </label>
              <div className="flex gap-1">
                {priorityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs transition-colors",
                      priority === opt.value ?
                        "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-accent",
                    )}>
                    <FlagIcon className={cn("size-3", opt.color)} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="mb-1.5 block text-sm font-medium">
                Due Date
              </label>
              <div className="relative">
                <CalendarIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-background focus:ring-primary w-full rounded-lg border py-2 pr-3 pl-9 text-sm outline-none focus:ring-2"
                />
              </div>
            </div>
          </div>

          {/* List Select */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">List</label>
            <div className="flex flex-wrap gap-2">
              {lists.map((list) => (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => setListId(list.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors",
                    listId === list.id ?
                      "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent",
                  )}>
                  <ListIcon
                    className="size-4"
                    style={{ color: list.color }}
                  />
                  {list.name}
                </button>
              ))}
              {lists.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No lists yet. Create one from the sidebar first.
                </p>
              )}
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="hover:bg-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || lists.length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">
              {isPending && <Loader2Icon className="size-4 animate-spin" />}
              {task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
