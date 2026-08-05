
import "server-only"
import { notFound, redirect } from "next/navigation";
import { requirePublisher } from "@/app/data/publisher/require-publisher";
import { prisma } from "../prisma";

interface Props {
  lessonId: string;
}
export async function publisherGetLesson({ lessonId }: Props) {

  const session = await requirePublisher();

  if (!session) {
    redirect("/become-publisher");
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

export type PublisherLessonType = Awaited<ReturnType<typeof publisherGetLesson>>;
