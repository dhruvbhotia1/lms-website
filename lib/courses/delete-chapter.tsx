"use server"

import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse } from "../types";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

interface Props {

  name: string;
  chapterId: string;
  courseId: string;
  email: string;

}

export async function deleteChapter({ name, chapterId, courseId, email }: Props): Promise<ApiResponse> {

  const session = await requireAdmin();

  if (!session) {
    return { status: "error", message: "You must be an admin to delete a chapter" }
  }

  try {

    const userEmail = session.user.email;

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!chapter) {
      return { status: "error", message: "Chapter not found" }
    }

    if (userEmail !== email) {
      return { status: "error", message: "You must be the owner to delete a chapter" }
    }

    if(name !== chapter.title) {
      return { status: "error", message: "Chapter title does not match" }
    }

    await prisma.chapter.deleteMany({
      where: {
        id: chapterId,
        courseId: courseId,
      }
    }); //ensuring only that chapter is deleted.

    revalidatePath(`/admin/courses/${courseId}/edit`);


    return {status: "success", message: "Chapter deleted successfully"}

  } catch {

    return {status: "error", message: "Failed to delete chapter"}

  }

}
