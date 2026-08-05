"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "./prisma"
import { ApiResponse } from "./types"
import { requirePublisher } from "@/app/data/publisher/require-publisher"



interface LessonReorderProps {

  chapterId: string,
  lessons: {
    id: string,
    position: number
    }[],
  courseId: string,
}

interface ChapterReorderProps {
  chapters: {
    id: string,
    position: number,
    }[],
  courseId: string,
}

export const reorderLessons = async ({ chapterId, lessons, courseId }: LessonReorderProps): Promise<ApiResponse> => {

  await requirePublisher();

  try {

    if (!lessons || lessons.length == 0) {

      return { status: "error", message: "No lessons to reorder." }

    }

    const updates = lessons.map((lesson) => prisma.lesson.update({
      where: {
        id: lesson.id,
        chapterId: chapterId,
      },
      data: {
        position: lesson.position,
      }
    }))

    await prisma.$transaction(updates);

    revalidatePath(`/publisher/courses/${courseId}/edit`); //update the on the frontend...

    return { status: "success", message: "Lessons reordered successfully." }

  } catch {
    return { status: "error", message: "Failed to reorder lessons" }
  }

}

export const reorderChapters = async ({ chapters, courseId }: ChapterReorderProps): Promise<ApiResponse> => {

  await requirePublisher();

  try {

    if (!chapters || chapters.length == 0) {
      return { status: "error", message: "No chapters to reorder." }
    }

    const updates = chapters.map((chapter) => prisma.chapter.update({
      where: {
        id: chapter.id,
      },
      data: {
        position: chapter.position,
      }
    }));

    await prisma.$transaction(updates);

    revalidatePath(`/publisher/courses/${courseId}/edit`); //update the on the frontend...

    return { status: "success", message: "Chapters reordered successfully." }

  } catch {
    return { status: "error", message: "Failed to reorder chapters" }
  }

}
