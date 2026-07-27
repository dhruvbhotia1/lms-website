"use server";
import { prisma } from "@/lib/prisma";

export async function userGetAllCourses() {

  await new Promise((resolve) => setTimeout(resolve, 2000))
  const data = await prisma.course.findMany({
    where: {
      status: "Public"
    },
    select: {
      title: true,
      price: true,
      smallDescription: true,
      slug: true,
      fileKey: true,
      id: true,
      level: true,
      duration: true,
      category: true,
      thumbnail: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return data;
}

export type UserGetAllCoursesType = Awaited<ReturnType<typeof userGetAllCourses>>[0];
