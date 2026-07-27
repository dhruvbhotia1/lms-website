import { Badge } from "@/components/ui/badge";
import { userGetCourse } from "@/hooks/public/course/get-course";
import { Boxes, CatIcon, ChartBarIcon } from "lucide-react";
import Image from "next/image"
import { FaFoursquare } from "react-icons/fa6";

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

            <h1>{course.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">{ course.smallDescription} </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <Badge className="flex items-center gap-1 px-3 py-1">
              <ChartBarIcon className="h-6 w-6"/>
              <span>{ course.level}</span>
            </Badge>

            <Badge className="flex items-center gap-1 px-3 py-1">
              <Boxes className="h-6 w-6"/>
              <span>{ course.category}</span>
            </Badge>

          </div>

        </div>

      </div>

    </div>
  );
}
