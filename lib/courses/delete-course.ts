"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { deleteThumbnail } from "./delete-thumbnail";

interface Props {
  courseId: string;
  userEmail: string;
}

export const deleteCourse = async ({ courseId, userEmail }: Props): Promise<ApiResponse> => {
  const session = await requireAdmin(); // authenticate before calling this api.

  if (!session) {
    return {
      status: "error",
      message: "Unauthorized",
    };
  }

  if (session.user.email === userEmail) {
    const deleteResult = await deleteThumbnail({ courseId });

    if (deleteResult.status === "error") {
      return {
        status: "error",
        message: deleteResult.message,
      };
    }

    await prisma.course.deleteMany({
      where: {
        id: courseId,
        userId: session.user.id,
      },
    }); //only going to delete on in any case because of the id: courseId, id will be unique, check is for extra security for the userid.

    return {
      status: "success",
      message: "Course deleted successfully",
    };
  } else {
    return {
      status: "error",
      message: "Unauthorized",
    };
  }
};
