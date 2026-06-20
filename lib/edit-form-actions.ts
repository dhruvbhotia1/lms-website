"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { courseSchema, CourseSchemaType } from "./zodSchema";
import { ApiResponse } from "./types";
import { prisma } from "./prisma";
import arcjet from "./arcjet";
import { detectBot, fixedWindow } from "./arcjet";
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
  const session = await requireAdmin();
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
      message: "Succesfully implemented your edits.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
