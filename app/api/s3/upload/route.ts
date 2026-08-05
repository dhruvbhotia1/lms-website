import { z } from "zod";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/S3Client";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { requirePublisher } from "@/app/data/publisher/require-publisher";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required." }),
  contentType: z.string().min(1, { message: "Content type is required." }),
  size: z.number().min(1, { message: "Size is required." }),
  isImage: z.boolean(),
});

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

export async function POST(request: Request) {
  const session = await requirePublisher();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //we dont have to check for publisher here because when we create the course we check if the publisher is creating the course or not.

  try {
    const decision = await aj.protect(request, { fingerprint: session!.user.id }); // rate limiting for uploading images to the s3 bucket

    if (decision.isDenied()) {
      return NextResponse.json({ error: "Decision denied by Arcjet" }, { status: 401 });
    }

    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid Request Body" }, { status: 400 });
    }

    const { fileName, contentType, size } = validation.data;

    const uniqueKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360, //url expires in 6 min
    });

    const response = {
      presignedUrl,
      key: uniqueKey,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.log("this is the error", error);
    return NextResponse.json({ error: "Failed to generate presigned URL" }, { status: 500 });
  }
}
