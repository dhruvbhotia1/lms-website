import { publisherGetLesson } from "@/lib/lessons/publisher-get-lesson";
import { LessonForm } from "./_components/LessonForm";

interface Props {
  params: Promise<{courseId: string, chapterId: string, lessonId: string}>
}


export default async function LessonPage({ params }: Props) {

  const { courseId, chapterId, lessonId } = await params;

  const lesson = await publisherGetLesson({ lessonId });

  return (
    <LessonForm data={lesson} chapterId={chapterId} courseId={ courseId }/>
  )

}
