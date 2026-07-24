
import "server-only"
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "../prisma";

interface Props {
  lessonId: string;
}
export async function adminGetLesson({ lessonId }: Props) {

  const session = await requireAdmin();

  if (!session) {
    redirect("/become-admin");
  }

  const data = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    }
  })

  if (!data) {
    return notFound();
  }

  return data;

}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
