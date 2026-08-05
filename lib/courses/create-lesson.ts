"use server";

import { lessonSchema, LessonSchemaType } from "../zodSchema";
import { requirePublisher } from "@/app/data/publisher/require-publisher";
import { ApiResponse } from "../types";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";


export async function createLesson(values: LessonSchemaType): Promise<ApiResponse> {

  if (!requirePublisher()) {
    return { status: "error", message: "Unauthorized" };
  }

  try {

    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      return { status: "error", message: result.error.message };
    }

    await prisma.$transaction(
      async (tx) => {

        const maxPos = await tx.lesson.findFirst({
          where: {
            chapterId: values.chapterId
          },
          select: {
            position: true
          },
          orderBy: {
            position: "desc"
          },
        });

        await tx.lesson.create({
          data: {
            title: result.data.title,
            chapterId: result.data.chapterId,
            position: maxPos ? maxPos.position + 1 : 1,
            videoKey: result.data.videoKey,
            thumbnailKey: result.data.thumbnailKey,
            description: result.data.description,
          }
        })

        revalidatePath(`/publisher/courses/${result.data.courseId}/edit`);
      }
    );


    return { status: "success", message: "Lesson created successfully" };

  } catch {

    return { status: "error", message: "Failed to create lesson" };
  }

}
