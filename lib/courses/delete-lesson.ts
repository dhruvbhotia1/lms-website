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

  const lessonToDelete = await prisma.lesson.findUnique({
    where: {
      id: lessonId
    },
    select: {
      title: true,
      chapter: {
        select: {
          id: true,
          course: {
            select: {
              userId: true,
            }
          }
        }
      }
    }

  });

  if (!lessonToDelete) {

    return {status: "error", message: "No lesson to delete."}
  }

  const isAuthorized = session.user.id === lessonToDelete.chapter.course.userId && chapterId === lessonToDelete.chapter.id && lessonToDelete.title === name;

  if (isAuthorized) {

    await prisma.lesson.deleteMany({
      where: {
        id: lessonId,
        chapterId: chapterId
      }
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { status: "success", message: "Lesson deleted successfully" };
  } else {

    return { status: "error", message: "Internal error occured while deleting this lesson." }

  }






}
