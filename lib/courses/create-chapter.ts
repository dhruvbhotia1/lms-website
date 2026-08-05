"use server";

import { requirePublisher } from "@/app/data/publisher/require-publisher";
import { ApiResponse } from "../types";
import { ChapterSchemaType } from "../zodSchema";
import { chapterSchema } from "../zodSchema";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";


export async function createChapter(values: ChapterSchemaType): Promise<ApiResponse> {

  if (!requirePublisher()) {
    return { status: "error", message: "You are not an publisher" };
  }

  try {

    const result = chapterSchema.safeParse(values); //safe parsing data.. validating with zod

    if (!result.success) {

      return { status: "error", message: result.error.message };
    }

    await prisma.$transaction(

      //getting the first chapter in the chapter array of the specific course in descending order
      //tx is the prisma instance.
      async (tx) => {
        const maxPos = await tx.chapter.findFirst({
          where: {
            courseId: result.data.courseId
          },
          select: {
            position: true,
          },
          orderBy: {
            position: "desc"
          }
        });

        //using the same instance we create the new chapter with the max position + 1 or 0 if no chapters exist.

        await tx.chapter.create({
          data: {
            title: result.data.name,
            courseId: result.data.courseId,
            position: maxPos ? maxPos.position + 1 : 1, //in the db we have position starting from 1.
          }
        })
      }
    );

    revalidatePath(`/publisher/courses/${result.data.courseId}/edit`);
    return { status: "success", message: "Chapter created successfully" };
  } catch {
    return { status: "error", message: "Failed to create chapter" };
  }
}
