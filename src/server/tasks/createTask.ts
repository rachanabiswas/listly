"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { taskFormSchema } from "@/lib/zodSchema";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const createTask = async (data: unknown) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = taskFormSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid data");
  }

  const { title, description, priority, dueDate } = parsed.data;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  return task;
};
