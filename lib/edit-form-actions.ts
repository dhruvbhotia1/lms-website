"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { courseSchema, CourseSchemaType } from "./zodSchema";
import { ApiResponse } from "./types";
import { prisma } from "./prisma";

interface Props {
  values: CourseSchemaType;
  courseId: string;
}

export async function editCourse({ values, courseId }: Props): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
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
