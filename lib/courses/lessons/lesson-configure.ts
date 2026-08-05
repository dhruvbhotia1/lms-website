"use server"

import { lessonSchema, LessonSchemaType } from "../../db/zodSchema";
import { requirePublisher } from "@/lib/auth/require-publisher";
import { redirect } from "next/navigation";
import { ApiResponse } from "../../auth/apiResponseTypes";
import arcjet from "../../auth/arcjet";
import { detectBot, fixedWindow } from "../../auth/arcjet";
import { request } from "@arcjet/next";
import { prisma } from "../../db/prisma";

interface Props {
  data: LessonSchemaType;
  lessonId: string;
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

export async function lessonConfigure({ data, lessonId}: Props): Promise<ApiResponse> {

  const session = requirePublisher();

  if (!session) {
    return redirect(`/become-publisher`);
  }

  try {

    const decision = await aj.protect(await request(), {
      fingerprint: (await session).user.id,
    }); // rate limiting for creating courses (form submissions).

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "You are a bot or have exceeded the rate limit.",
      };
    }

    const validation = lessonSchema.safeParse(data);

    if (!validation.success) {

      return {status: "error", message: "Invalid form data."}
    }

    await prisma.lesson.update({
      where: {
        id: lessonId,
        chapterId: validation.data.chapterId
      },
      data: {

        title: validation.data.title,
        description: validation.data.description,
        thumbnailKey: validation.data.thumbnailKey,
        videoKey: validation.data.videoKey,
      }
    });


    return {status: "success", message: "Lesson configured successfully."}

  } catch {

    return {status: "error", message: "Could not configure lesson!"}
  }
}
