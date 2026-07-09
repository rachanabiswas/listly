"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { taskFormSchema } from "@/lib/zodSchema";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const updateTask = async (id: string, data: unknown) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    throw new Error("Not found");
  }

  const parsed = taskFormSchema
    .extend({
      status: z.enum(["todo", "in_progress", "done"]),
    })
    .safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid data");
  }

  const { title, description, priority, status, dueDate, remindAt } = parsed.data;

  const task = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      remindAt: remindAt ? new Date(remindAt) : null,
    },
  });

  revalidatePath("/dashboard");
  return task;
};
