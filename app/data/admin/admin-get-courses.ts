import { prisma } from "@/lib/prisma";
import { requireAdmin } from "./require-admin";

export async function adminGetCourses() {
  const session = await requireAdmin();

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

  return data;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
