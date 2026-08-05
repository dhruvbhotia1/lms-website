import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useState } from "react";
import { deleteChapter } from "@/lib/courses/delete-chapter";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";


interface Props {
  chapterId: string;
  courseId: string;
}
export function DeleteChapter({ chapterId, courseId }: Props) {

  const [pendingTransition, deletingChapter] = useTransition();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [isOpen, setIsOpen] = useState(false);


  const handleDelete = (name: string, email: string) => {

    deletingChapter(async () => {
      try {

        const result = await deleteChapter({ name, chapterId, courseId, email});

        if (result.status === "success") {
          toast.success("Chapter deleted successfully");
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

          <Trash2 className="size-4"/>

        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-106.25 ">

        <AlertDialogHeader>
          <AlertDialogTitle className="text-white font-semibold">Are you sure you want to delete this chapter?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground mt-2">
            This action cannot be undone. Deleting this chapter will remove it from the course and delete all its lessons.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-y-6">
          <Input
            placeholder={"Please type your email to verify ownership."}
            type={"email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}

          />

          <Input
            placeholder={"Please confirm the name of the chapter to delete."}
            type={"text"}
            value={name}
            onChange={(e) => setName(e.target.value)}

          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <Button variant="destructive" onClick={() => handleDelete(name, email)} disabled={pendingTransition}>
            <Trash2 className="size-4" />
            Delete this lesson
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

}
