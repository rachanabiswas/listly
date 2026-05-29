"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// ─── Types ───────────────────────────────────────────────

export type TaskWithList = {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  priority: string;
  dueDate: string | null;
  listId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  list: { id: string; name: string; color: string };
};

export type ListWithCount = {
  id: string;
  name: string;
  color: string;
  icon: string;
  _count: { tasks: number };
};

type TaskInput = {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
  listId: string;
};

type UpdateTaskInput = Partial<TaskInput> & {
  isCompleted?: boolean;
};

// ─── Auth Helper ─────────────────────────────────────────

async function getSessionOrThrow() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

// ─── Tasks ───────────────────────────────────────────────

export async function createTask(input: TaskInput) {
  const session = await getSessionOrThrow();

  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      priority: input.priority ?? "medium",
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      listId: input.listId,
      userId: session.user.id,
    },
  });

  revalidatePath("/");
  return task;
}

export async function updateTask(taskId: string, input: UpdateTaskInput) {
  const session = await getSessionOrThrow();

  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId: session.user.id },
  });
  if (!existing) throw new Error("Task not found");

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.priority !== undefined && { priority: input.priority }),
      ...(input.isCompleted !== undefined && {
        isCompleted: input.isCompleted,
      }),
      ...(input.dueDate !== undefined && {
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      }),
      ...(input.listId !== undefined && { listId: input.listId }),
    },
  });

  revalidatePath("/");
  return task;
}

export async function toggleTaskCompletion(taskId: string) {
  const session = await getSessionOrThrow();

  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId: session.user.id },
  });
  if (!existing) throw new Error("Task not found");

  const task = await prisma.task.update({
    where: { id: taskId },
    data: { isCompleted: !existing.isCompleted },
  });

  revalidatePath("/");
  return task;
}

export async function deleteTask(taskId: string) {
  const session = await getSessionOrThrow();

  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId: session.user.id },
  });
  if (!existing) throw new Error("Task not found");

  await prisma.task.delete({ where: { id: taskId } });

  revalidatePath("/");
}

// ─── Lists ───────────────────────────────────────────────

export async function createList(name: string, color?: string, icon?: string) {
  const session = await getSessionOrThrow();

  const list = await prisma.list.create({
    data: {
      name,
      color: color ?? "#6366f1",
      icon: icon ?? "list",
      userId: session.user.id,
    },
  });

  revalidatePath("/");
  return list;
}

export async function updateList(
  listId: string,
  data: { name?: string; color?: string; icon?: string },
) {
  const session = await getSessionOrThrow();

  const existing = await prisma.list.findFirst({
    where: { id: listId, userId: session.user.id },
  });
  if (!existing) throw new Error("List not found");

  const list = await prisma.list.update({
    where: { id: listId },
    data,
  });

  revalidatePath("/");
  return list;
}

export async function deleteList(listId: string) {
  const session = await getSessionOrThrow();

  const existing = await prisma.list.findFirst({
    where: { id: listId, userId: session.user.id },
  });
  if (!existing) throw new Error("List not found");

  await prisma.list.delete({ where: { id: listId } });

  revalidatePath("/");
  redirect("/");
}

// ─── Serializer ──────────────────────────────────────────

function serializeTask(task: {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  priority: string;
  dueDate: Date | null;
  listId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  list: { id: string; name: string; color: string };
}): TaskWithList {
  return {
    ...task,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
  };
}

// ─── Data Fetching ───────────────────────────────────────

export async function getTasks(filters?: {
  listId?: string;
  isCompleted?: boolean;
  priority?: string;
}) {
  const session = await getSessionOrThrow();

  const where: Record<string, unknown> = { userId: session.user.id };

  if (filters?.listId) where.listId = filters.listId;
  if (filters?.isCompleted !== undefined)
    where.isCompleted = filters.isCompleted;
  if (filters?.priority) where.priority = filters.priority;

  const tasks = await prisma.task.findMany({
    where,
    include: { list: true },
    orderBy: [
      { isCompleted: "asc" },
      { priority: "asc" },
      { createdAt: "desc" },
    ],
  });

  return tasks.map(serializeTask);
}

export async function getLists() {
  const session = await getSessionOrThrow();

  return prisma.list.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getTaskById(taskId: string) {
  const session = await getSessionOrThrow();

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId: session.user.id },
    include: { list: true },
  });

  return task ? serializeTask(task) : null;
}
