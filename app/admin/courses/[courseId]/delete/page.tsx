import { DeleteDialogBox } from "./_components/DeleteDialogBox";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function DeleteCoursePage({ params }: Props) {
  const { courseId } = await params;

  return (
    <>
      <DeleteDialogBox courseId={courseId} />
    </>
  );
}
