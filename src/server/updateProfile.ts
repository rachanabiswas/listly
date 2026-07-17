"use server";

import { auth } from "@/lib/auth";
import { getServerSession } from "@/server/getServerSession";
import { profileFormSchema } from "@/lib/zodSchema";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const updateProfile = async (data: unknown) => {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const parsed = profileFormSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Invalid data");
  }

  const { name, image } = parsed.data;

  await auth.api.updateUser({
    body: {
      name,
      ...(image !== undefined ? { image } : {}),
    },
    headers: await headers(),
  });

  revalidatePath("/profile");
};
