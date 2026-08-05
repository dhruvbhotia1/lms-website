import { Card, CardContent } from "@/components/ui/card"
import { UserGetAllCoursesType } from "@/lib/courses/user-get-all-courses"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useConstructUrl } from "@/lib/use-construct-url"
import Link from "next/link"
import { School, TimerIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";

interface Props {
  data: UserGetAllCoursesType
}

export function PublicCourseCard({ data }: Props) {

  const thumbnailUrl = useConstructUrl({ key: data.thumbnail });

  return (

    <Card className="group relative py-0 gap-0">

      <Badge className="absolute top-2 right-2 z-10">

        {data.level}

      </Badge>

      <Image width={600} height={ 400 } src={thumbnailUrl} alt={" course thumbnail.."} className="w-full rounded-t-xl aspect-video h-full object-cover" />

      <CardContent className="p-4">
        <Link href={`/courses/${data.slug}`}>

          { data.title }

        </Link>

        <div>
          <RenderDescription json={JSON.parse(data.smallDescription)}/>
        </div>

        <div className="mt-5 flex items-center justify-between">

          <div className="flex items-center gap-x-5">
            <div className="flex flex-row items-center gap-x-2">
              <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
              <p className="text-sm text-muted-foreground">{data.duration}</p>
            </div>

            <div className="flex flex-row items-center gap-x-2">
              <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
              <p className="text-sm text-muted-foreground">{data.category}</p>
            </div>
          </div>

          <Link href={`/courses/${data.slug}`} className={buttonVariants({variant:"default", size:"sm"})}>
            Learn More
          </Link>

        </div>
      </CardContent>

    </Card>

  )
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">

      <div className="absolute top-2 right-2 z-10 items-center">

        <Skeleton className="h-6 w-20 rounded-full" />

      </div>

      <div className="w-full relative h-fit">

        <Skeleton className="w-full rounded-t-xl aspect-video"/>

      </div>

      <CardContent className="p-4">

        <div className="space-y-2">

          <Skeleton className="h-6 w-full" />

          <Skeleton className="h-6 w-3/4"/>

        </div>

        <div className="space-y-2">

          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3"/>
        </div>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">

            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8"/>

          </div>

          <div className="flex items-center gap-x-2">

            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8"/>

          </div>

        </div>


        <Skeleton className="mt-4 w-full h-10 rounded-md"/>

      </CardContent>

    </Card>
  )
}
