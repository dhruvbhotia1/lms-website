"use server"

import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse } from "../types";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import arcjet from "../arcjet";
import { detectBot, fixedWindow } from "../arcjet";
import { request } from "@arcjet/next";

interface Props {

  name: string;
  chapterId: string;
  courseId: string;
  email: string;

}

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    }),
  );

export async function deleteChapter({ name, chapterId, courseId, email }: Props): Promise<ApiResponse> {

  const session = await requireAdmin();

  if (!session) {
    return { status: "error", message: "You must be an admin to delete a chapter" }
  }

  const decision = await aj.protect(await request(), {
    fingerprint: session?.user.id,
  }); // rate limiting for creating courses (form submissions).

  if (decision.isDenied()) {
    return {
      status: "error",
      message: "You are a bot or have exceeded the rate limit.",
    };
  }

  const chapterToDelete = await prisma.chapter.findUnique({
    where: { id: chapterId },
    select: {
      title: true,
      course: {
        select: {
          userId: true,
          user: {
            select: {
              email: true,
            }
          }
        }
      }
    }
  });

  if (!chapterToDelete) {
    return { status: "error", message: "Chapter not found" }
  }

  const isAuthorized = session.user.id === chapterToDelete.course.userId && chapterToDelete.course.user.email === session.user.email && chapterToDelete.course.user.email === email;

  if (isAuthorized && chapterToDelete.title === name) {

    await prisma.chapter.deleteMany({
      where: {
        id: chapterId,
        courseId: courseId,
      }
    }); //ensuring only that chapter is deleted.

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {status: "success", message: "Chapter deleted successfully"}
  } else {

    return {status: "error", message: "Internal error while deleting the chapter."}
  }


}
