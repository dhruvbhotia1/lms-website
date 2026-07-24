"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse } from "../types";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

interface Props {

  lessonId: string; //to fetch the lesson data from the db
  chapterId: string;
  name: string; //name sent by the user to comapare.
  courseId: string;


}


export async function deleteLesson({ chapterId, lessonId, name, courseId }: Props): Promise<ApiResponse> {

  const session = await requireAdmin();

  if (!session) {
    return { status: "error", message: "Unauthorized" };
  }

  try {

    const lessonToDelete = await prisma.lesson.findUnique({
      where: {
        id: lessonId
      },

    });

    if (!lessonToDelete) {
      return { status: "error", message: "Lesson not found" };
    }

    if (lessonToDelete.title !== name) {
      return { status: "error", message: "Lesson name does not match" };
    }

    if (chapterId !== lessonToDelete.chapterId) {
      return { status: "error", message: "Chapter ID does not match" };
    }

    await prisma.lesson.deleteMany({
      where: {
        id: lessonId,
        chapterId: chapterId
      }
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { status: "success", message: "Lesson deleted successfully" };

  } catch  {
    return { status: "error", message: "Failed to delete lesson" };
  }


}
