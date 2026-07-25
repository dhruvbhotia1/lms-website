import "server-only"

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

export async function adminGetCourses() {

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const session = await requireAdmin();

  if (!session) {
    redirect("/become-admin");
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

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
