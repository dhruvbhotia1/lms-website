import { PublisherCourseType } from "@/lib/courses/publisher/publisher-get-courses";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/lib/use-construct-url";

import { School, TimerIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaDollarSign, FaPen } from "react-icons/fa6";
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";

interface Props {
  data: PublisherCourseType;
}

function stripHtml(htmlString: string) {
  return htmlString.replace(/<[^>]*>/g, "");
}

export function PublisherCourseCard({ data }: Props) {
  const { thumbnail } = data;
  const thumbnailUrl = useConstructUrl({key : thumbnail});


  return (
    <Card className="group relative p-0 overflow-hidden">
      <div className="absolute top-2 right-2">
        <Link
          href={`/publisher/courses/${data.id}/delete`}
          className={buttonVariants({ variant: "destructive" })}
        >
          <TrashIcon className="size-4" />
          Delete
        </Link>
      </div>

      <Image
        src={thumbnailUrl}
        height={400}
        width={600}
        alt="logo"
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />

      <CardContent>
        <Link
          href={`/publisher/courses/${data.id}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>

        <div>
          <RenderDescription json={JSON.parse(data.smallDescription)}/>
        </div>

        <div className="flex items-center justify-between pb-4">
          <div className="mt-4 flex items-center gap-x-5">
            <div className="flex gap-2 items-center">
              <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
              <p className="text-sm text-muted-foreground">{data.duration} Hours</p>
            </div>

            <div className="flex gap-2 items-center">
              <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
              <p className="text-sm text-muted-foreground">{data.level}</p>
            </div>

            <div className="flex gap-2 items-center">
              <FaDollarSign className="size-6 p-1 rounded-md text-primary bg-primary/10" />
              <p className="text-sm text-muted-foreground">{data.price}</p>
            </div>
          </div>

          <Link
            href={`/publisher/courses/${data.id}/edit`}
            className={buttonVariants({
              size: "sm",
              className: "flex items-center gap-3 font-semibold mt-4",
            })}
          >
            <FaPen className="size-4" />
            Edit
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function PublisherCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">

      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">

        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="size-8 rounded-md" />

      </div>

      <div className="w-full relative h-fit">

        <Skeleton className="w-full rounded-t-lg aspect-video h-62.5 object-cover"/>

      </div>

      <CardContent className="p-4">

        <Skeleton className="h-6 w-3/4 mb-2 rounded" />

        <Skeleton className="h-4 w-full rounded" />

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">

            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded"/>

          </div>

          <div className="flex items-center gap-x-2">

            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded"/>

          </div>


        </div>

        <Skeleton className="mt-4 h-10 w-full rounded"/>

      </CardContent>

    </Card>
  )
}
