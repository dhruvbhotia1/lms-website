"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";

export const deleteCourse = async ({
  courseId,
  userEmail,
}: {
  courseId: string;
  userEmail: string;
}): Promise<ApiResponse> => {
  const session = await requireAdmin(); // authenticate before calling this api.

  if (!session) {
    return {
      status: "error",
      message: "Unauthorized",
    };
  }

  if (session.user.email !== userEmail) {
    //the logged in user is not the owner of the course
    return {
      status: "error",
      message: "Unauthorized",
    };
  }

  const result = await prisma.course.deleteMany({
    where: {
      id: courseId,
      userId: session.user.id,
    },
  });

  if (!result) {
    return {
      status: "error",
      message: "Course not found or user unauthorized",
    };
  }

  return {
    status: "success",
    message: "Course deleted successfully",
  };
};
