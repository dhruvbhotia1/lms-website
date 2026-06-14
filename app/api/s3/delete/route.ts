import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import arcjet from "@/lib/arcjet";
import { detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

export async function DELETE(request: Request) {
  const currentUser = await auth.api.getSession({
    headers: await headers(),
  });

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decision = await aj.protect(request, { fingerprint: currentUser!.user.id });

    if (decision.isDenied()) {
      return NextResponse.json({ error: "Decision denied by Arcjet" }, { status: 401 });
    }

    const body = await request.json();

    const key = body.key;

    if (!key) {
      return NextResponse.json({ error: "Missing or invalid object key" }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await S3.send(command);

    return NextResponse.json({ message: "Object deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
