import { DeleteCourseCard } from "./_components/DeleteCourseCard";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function DeleteCoursePage({ params }: Props) {
  const { courseId } = await params;

  return (
    <>
      <DeleteCourseCard courseId={courseId} />
    </>
  );
}
