"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const deleteTask = async (id: string) => {
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

  await prisma.task.delete({ where: { id } });

  revalidatePath("/dashboard");
};
