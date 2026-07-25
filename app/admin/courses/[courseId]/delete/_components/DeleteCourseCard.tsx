"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";
import { deleteCourse } from "@/lib/courses/delete-course";
import { useRouter } from "next/navigation";

interface Props {
  courseId: string;
}

export function DeleteCourseCard({ courseId }: Props) {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [courseName, setCourseName] = useState("");

  const [pendingTransition, startDeleteTransition] = useTransition();

  const deletingCourse = (email: string) => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      startDeleteTransition(async () => {

        const result = await deleteCourse({ courseId, userEmail: email, name: courseName });

        if (result.status === "success") {
          toast.success("Course deleted successfully");
          router.push("/admin/courses");
        } else {
          toast.error(result.message);
        }
      });
    } catch {
      toast.error("An error occurred while deleting the course");
    }
  };

  return (
    <Card className={"gap-y-6"}>
      <CardHeader>
        <CardTitle className={"text-xl"}>Welcome</CardTitle>
        <CardDescription>You can delete the course that you created here.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-y-6">
        <Input
          placeholder={"Please type your email address for verification"}
          type={"email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder={"Please type the name of the course to confirm."}
          type={"text"}
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />

        <Button
          variant={"destructive"}
          className="w-1/2 mx-auto"
          onClick={() => deletingCourse(email)}
          disabled={pendingTransition}
        >
          <TrashIcon className="size-5" />
          Delete this course
        </Button>
      </CardContent>
    </Card>
  );
}
