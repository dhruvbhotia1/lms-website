import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { AdminCourseCard } from "./_components/AdminCourseCard";
import { EmptyState } from "@/components/EmptyState";
import { Suspense } from "react";
import { AdminCourseCardSkeleton } from "./_components/AdminCourseCard";

export default function CoursePage() {

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

      <Suspense fallback={ <AdminCourseCardSkeletonLayout/> }>
        <RenderCourses/>
      </Suspense>
    </>
  );
}

async function RenderCourses() {

  const data = await adminGetCourses();

  return (

    <>
      {data.length === 0 ? (
        <EmptyState title="No courses to show." description="You currently have 0 courses created. you can create your first course by click the button below." buttonText="Create Course" redirectLink={`/admin/courses/create` } />
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {
              data.map((course) => (
                <AdminCourseCard data={course} key={course.id} />
              ))
            }
         </div>
      )}
    </>
  )
}

export function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">

      {
        Array.from({ length: 5 }).map((_, index) => (
          <AdminCourseCardSkeleton key={index}/>

        ))
      }

    </div>
  )
}
