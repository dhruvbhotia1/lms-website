import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useState } from "react";
import { deleteLesson } from "@/lib/courses/delete-lesson";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";


interface Props {

  chapterId: string;
  lessonId: string;
  courseId: string;
}
export function DeleteLesson({ chapterId, lessonId, courseId }: Props) {

  const [pendingTransition, deletingLesson] = useTransition();

  const [name, setName] = useState("");

  const [isOpen, setIsOpen] = useState(false);


  const handleDelete = (name: string) => {

    deletingLesson(async () => {
      try {

        const result = await deleteLesson({ name, lessonId, courseId, chapterId });

        if (result.status === "success") {
          toast.success("Lesson deleted successfully");
          onToggleHandler();
        } else {
          toast.error(result.message);
        }

      } catch {

        toast.error("Something went wrong.");

      }
    })

  }

  const onToggleHandler = () => {
    setIsOpen(!isOpen);
  }


  return (

    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>

      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon" onClick={() => onToggleHandler()}>

          <XIcon className="size-4"/>

        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-106.25 ">

        <AlertDialogHeader>
          <AlertDialogTitle className="text-white font-semibold">Are you sure you want to delete this lesson?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground mt-2">
            This action cannot be undone. Deleting this lesson will remove it from the course.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          placeholder={"Please type the name of the lesson to delete"}
          type={"text"}
          value={name}
          onChange={(e) => setName(e.target.value)}

        />

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <Button variant="destructive" onClick={() => handleDelete(name)} disabled={pendingTransition}>
            <Trash2 className="size-4" />
            Delete this lesson
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

}
