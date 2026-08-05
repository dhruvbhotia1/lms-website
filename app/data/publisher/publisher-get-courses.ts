import "server-only"

import { prisma } from "@/lib/prisma";
import { requirePublisher } from "./require-publisher";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

export async function publisherGetCourses() {

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const session = await requirePublisher();

  if (!session) {
    redirect("/become-publisher");
  }

  const data = await prisma.course.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      price: true,
      fileKey: true,
      slug: true,
      thumbnail: true,
    },
  });

  if (!data) {

    return notFound();
  }

  return data;
}

export type PublisherCourseType = Awaited<ReturnType<typeof publisherGetCourses>>[0];
