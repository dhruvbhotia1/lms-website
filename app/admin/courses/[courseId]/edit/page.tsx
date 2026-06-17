import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditFormCourse } from "./_components/EditCourseForm";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ courseId: string }>;
}
export default async function CourseEditPage({ params }: Props) {
  const { courseId } = await params;

  const course = await adminGetCourse({ courseId });

  console.log(course.category);

  const session = await requireAdmin();

  if (!course || course.userId !== session.user.id) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Edit Course {} <span className="text-primary underline">{course.title}</span>
      </h1>

      <Tabs defaultValue="" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="basic-info" className="cursor-pointer">
            Basic Info
          </TabsTrigger>

          <TabsTrigger value="course-structure" className="cursor-pointer">
            Course Structure
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>

              <CardDescription>Edit basic information about the course.</CardDescription>
            </CardHeader>

            <CardContent>
              <EditFormCourse course={course} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
