"use server";

import { requirePublisher } from "@/lib/auth/require-publisher";
import { courseSchema, CourseSchemaType } from "../../db/zodSchema";
import { ApiResponse } from "../../auth/apiResponseTypes";
import { prisma } from "../../db/prisma";
import arcjet from "../../auth/arcjet";
import { detectBot, fixedWindow } from "../../auth/arcjet";
import { request } from "@arcjet/next";

interface Props {
  values: CourseSchemaType;
  courseId: string;
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

export async function editCourse({ values, courseId }: Props): Promise<ApiResponse> {
  const session = await requirePublisher();
  try {
    const decision = await aj.protect(await request(), {
      fingerprint: session?.user.id,
    }); // rate limiting for creating courses (form submissions).

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "You are a bot or have exceeded the rate limit.",
      };
    }

    const validation = courseSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: validation.error.message,
      };
    }

    const result = await prisma.course.update({
      where: {
        id: courseId,
        userId: session.user.id,
      },
      data: {
        ...validation.data,
      },
    });

    if (!result) {
      return {
        status: "error",
        message: "Failed to update course.",
      };
    }

    return {
      status: "success",
      message: "Successfully implemented your edits.",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to edit course. Please recheck all values. Remember slugs of your courses should be unique.",
    };
  }
}
