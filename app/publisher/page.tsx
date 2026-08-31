
import { SectionCards } from "@/components/sidebar/section-cards";
import CoursePage from "@/app/publisher/courses/_components/courseDisplay";


export default async function PublisherPage() {
  return (
    <>
        <SectionCards />

        <div className="px-4 lg:px-6 mt-5">

            <CoursePage/>

        </div>



    </>
  );
}
