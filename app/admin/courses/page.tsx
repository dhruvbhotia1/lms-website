import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { AdminCourseCard } from "./_components/AdminCourseCard";

export default async function CoursePage() {
  const data = await adminGetCourses();

  return (
    <>
      <div className={"flex items-center justify-between"}>
        <h1 className={"text-2xl font-bold"}>Your courses</h1>

        <Link
          className={buttonVariants({
            size: "lg",
            variant: "default",
            className: "font-semibold",
          })}
          href={`/admin/courses/create`}
        >
          Create course
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
        {data.map((course) => (
          <AdminCourseCard data={course} key={course.id} />
        ))}
      </div>
    </>
  );
}
