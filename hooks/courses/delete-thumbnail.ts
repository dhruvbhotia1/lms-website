"use server";
import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { S3 } from "@/lib/S3Client";
import { ApiResponse } from "@/lib/types";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const deleteThumbnail = async ({
  courseId,
}: {
  courseId: string;
}): Promise<ApiResponse> => {
  const session = await requireAdmin(); // authenticate before calling this api.

  if (!session) {
    return {
      status: "error",
      message: "Not authenticated",
    };
  }

  const course = await adminGetCourse({ courseId });

  const result = await S3.send(
    new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: course.thumbnail,
    }),
  );

  if (!result) {
    return {
      status: "error",
      message: "Failed to delete thumbnail",
    };
  }

  return {
    status: "success",
    message: "Thumbnail deleted successfully",
  };
};
