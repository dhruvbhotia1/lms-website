"use server";
import { requirePublisher } from "@/lib/auth/require-publisher";
import { S3 } from "@/lib/auth/S3Client";
import { ApiResponse } from "@/lib/auth/apiResponseTypes";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const deleteThumbnail = async ({
  courseThumbnailKey,
}: {
  courseThumbnailKey: string;
}): Promise<ApiResponse> => {
  const session = await requirePublisher(); // authenticate before calling this api.

  if (!session) {
    return {
      status: "error",
      message: "Not authenticated",
    };
  }

  const result = await S3.send(
    new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: courseThumbnailKey,
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
