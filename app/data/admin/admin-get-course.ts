import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

interface Props {
  courseId: string;
}

export async function adminGetCourse({ courseId }: Props) {
  const session = await requireAdmin();

  if (!session) {
    redirect("/become-admin");
  }


  const data = await prisma.course.findUnique({
    where: {
      id: courseId,
      userId: session.user.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      category: true,
      status: true,
      slug: true,
      smallDescription: true,
      thumbnail: true,
      userId: true, // to validate ownership before displaying the course on the page.tsx
      chapters: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              chapterId: true,
              title: true,
              description: true,
              thumbnailKey: true,
              position: true,
              videoKey: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export type AdminGetCourseType = Awaited<ReturnType<typeof adminGetCourse>>;
