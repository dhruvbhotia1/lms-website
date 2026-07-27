import { userGetAllCourses } from "@/hooks/public/course/user-get-all-courses"
import { PublicCourseCard, PublicCourseCardSkeleton } from "./_components/PublicCourseCard";
import { Suspense } from "react";

export default function PublicCoursesRoute() {
  return (
    <div className="flex flex-col space-y-2 mb-10 mt-5">

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Explore courses</h1>

      <p className="text-mutedtext-muted-foreground">Discover our video range of courses designed to help you achieve your learning goals.</p>

      <Suspense fallback={ <LoadingSkeletonLayout/> }>

        <RenderCourses/>

      </Suspense>

    </div>
  )
}

async function RenderCourses() {
  const courses = await userGetAllCourses();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {courses.map((course) => (

        <PublicCourseCard key={course.id} data={course}/>

      ))}

    </div>
  )
};

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {
        Array.from({ length: 9 }).map((_, index) => (

          <PublicCourseCardSkeleton key={index}/>

        ))
      }

    </div>
  )
}
