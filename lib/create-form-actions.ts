"use server";

import { courseSchema, CourseSchemaType } from "./zodSchema";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "./types";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function createCourse(values: CourseSchemaType): Promise<ApiResponse> {
  try {
    const validation = courseSchema.safeParse(values);

    const currentUser = await auth.api.getSession({
      headers: await headers(),
    });

    if (!currentUser) {
      return {
        status: "error",
        message: "You must be logged in to create a course.",
      };
    }

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: currentUser!.user.id,
      },
    });

    return {
      status: "success",
      message: "course created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to create course.",
    };
  }
}
