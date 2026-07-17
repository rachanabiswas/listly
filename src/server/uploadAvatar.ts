"use server";

import sharp from "sharp";
import { auth } from "@/lib/auth";
import { getServerSession } from "@/server/getServerSession";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const AVATAR_SIZE = 256;
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export const uploadAvatar = async (file: File) => {
  let filename: string | undefined;

  try {
    const session = await getServerSession();
    if (!session) {
      return { isSuccess: false as const, message: "Unauthorized" };
    }

    if (!file.type.startsWith("image/")) {
      return { isSuccess: false as const, message: "File must be an image" };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        isSuccess: false as const,
        message: "File size must be less than 5 MB",
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const processed = await sharp(buffer)
      .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: "cover", position: "centre" })
      .webp({ quality: 80 })
      .toBuffer();

    filename = `${session.user.id}_${randomUUID()}.webp`;

    await mkdir(UPLOADS_DIR, { recursive: true });
    await writeFile(path.join(UPLOADS_DIR, filename), processed);

    const oldImage = session.user.image;
    const imagePath = `/uploads/${filename}`;

    await auth.api.updateUser({
      headers: await headers(),
      body: { image: imagePath },
    });

    if (oldImage?.startsWith("/uploads/")) {
      await unlink(path.join(process.cwd(), "public", oldImage)).catch(
        () => {},
      );
    }

    revalidatePath("/profile");

    return {
      isSuccess: true as const,
      message: "Avatar uploaded successfully",
      image: imagePath,
    };
  } catch (error) {
    console.error("Upload avatar error:", error);

    if (filename) {
      await unlink(path.join(UPLOADS_DIR, filename)).catch(() => {});
    }

    return { isSuccess: false as const, message: "Failed to upload avatar" };
  }
};
