import { Badge } from "@/components/ui/badge";
import { userGetCourse } from "@/hooks/public/course/get-course";
import { BoxesIcon, ChartBarIcon, TimerIcon } from "lucide-react";
import Image from "next/image"
import {Separator} from "@/components/ui/separator";
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";


type Params = Promise<{ slug: string }>;

export default async function UserCoursePage({ params }: { params: Params }) {

  const { slug } = await params;

  const course = await userGetCourse(slug);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">

      <div className="order-1 lg:col-span-2">

        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">

          <Image src={`${process.env.NEXT_PUBLIC_S3_BUCKET_DEVELOPMENT_URL}/${course.thumbnail}`} alt="" fill className="object-cover" priority />

          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent">
          </div>

        </div>

        <div className="mt-8 space-y-6">

          <div className="space-y-4">

            <h1 className={"text-primary font-semibold text-2xl"}>{course.title}</h1>
            <div>
              <RenderDescription json={JSON.parse(course.smallDescription)}/>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">

            <Badge className="flex items-center gap-1 p-3">
              <ChartBarIcon className="size-4!"/>
              <span className="font-semibold">{ course.level}</span>
            </Badge>

            <Badge className="flex items-center gap-1 p-3">
              <BoxesIcon className="size-4!"/>
              <span className="font-semibold">{course.category}</span>
            </Badge>

            <Badge className="flex items-center gap-1 p-3">
              <TimerIcon className="size-4!"/>
              <span className="font-semibold">{course.duration} hours</span>
            </Badge>
          </div>

          <Separator className={"my-8"}/>

          <div className={"space-y-6"}>

            <h2 className={"text-3xl font-semibold tracking-tight"}>Course Description</h2>

            <div>
              <RenderDescription json={JSON.parse(course.description)} />
            </div>
          </div>

          <div className={"mt-12 space-y-6"}>

            <div className={"flex items-center justify-between"}>

              <h2 className={"text-3xl font-semibold tracking-tight"}>Course Content</h2>

              <div>
                {course.chapters.length} chapters |{" "}
                {course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)}
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
