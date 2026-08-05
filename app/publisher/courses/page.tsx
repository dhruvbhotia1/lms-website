import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { publisherGetCourses } from "@/lib/courses/publisher-get-courses";
import { PublisherCourseCard } from "./_components/PublisherCourseCard";
import { EmptyState } from "@/components/EmptyState";
import { Suspense } from "react";
import { PublisherCourseCardSkeleton } from "./_components/PublisherCourseCard";

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
          href={`/publisher/courses/create`}
        >
          Create course
        </Link>
      </div>

      <Suspense fallback={ <PublisherCourseCardSkeletonLayout/> }>
        <RenderCourses/>
      </Suspense>
    </>
  );
}

async function RenderCourses() {

  const data = await publisherGetCourses();

  return (

    <>
      {data.length === 0 ? (
        <EmptyState title="No courses to show." description="You currently have 0 courses created. you can create your first course by click the button below." buttonText="Create Course" redirectLink={`/publisher/courses/create` } />
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {
              data.map((course) => (
                <PublisherCourseCard data={course} key={course.id} />
              ))
            }
         </div>
      )}
    </>
  )
}

export function PublisherCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">

      {
        Array.from({ length: 5 }).map((_, index) => (
          <PublisherCourseCardSkeleton key={index}/>

        ))
      }

    </div>
  )
}
