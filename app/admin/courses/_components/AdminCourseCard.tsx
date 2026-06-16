import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, PenIcon, School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaDollarSign, FaPen } from "react-icons/fa6";

interface Props {
  data: AdminCourseType;
}

function stripHtml(htmlString: string) {
  return htmlString.replace(/<[^>]*>/g, "");
}

export function AdminCourseCard({ data }: Props) {
  const plainTextDescription = stripHtml(data.smallDescription || "");

  return (
    <Card className="group relative">
      <Image
        src={`${process.env.NEXT_PUBLIC_S3_BUCKET_DEVELOPMENT_URL}/${data.thumbnail}`}
        height={400}
        width={600}
        alt="logo"
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />

      <CardContent>
        <Link
          href={`/admin/courses/${data.id}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>

        <p className="line-clamp-2 text-muted-foreground leading-tight mt-2">
          {plainTextDescription}
        </p>

        <div className="flex items-center justify-between">
          <div className="mt-4 flex items-center gap-x-5">
            <div className="flex gap-2 items-center">
              <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
              <p className="text-sm text-muted-foreground">
                {data.duration} Hours
              </p>
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
            href={`/admin/courses/${data.id}/edit`}
            className={buttonVariants({
              size: "sm",
              className: "flex items-center gap-3 font-semibold",
            })}
          >
            Edit
            <FaPen className="size-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
