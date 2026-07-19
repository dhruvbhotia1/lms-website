import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { useTransition } from "react";
import { Loader, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { createLesson } from "@/lib/courses/create-lesson";
import { refresh } from "next/cache";



interface Props {
  courseId: string
  chapterId: string;
}


export function NewLessonModal({ courseId, chapterId }: Props) {

  const [createPending, startCreateTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: "",
      chapterId: chapterId,
      courseId: courseId,
      description: "",
      thumbnailKey: "",
      videoKey: "",
    },
  });

  const onSubmit = async (values: LessonSchemaType) => {

    startCreateTransition(async () => {

      try {
        const result = await createLesson(values);

        if (result.status === "success") {

          toast.success(result.message);
          form.reset();
          setIsOpen(!isOpen);

        } else {
          toast.error(result.message);
        }
      } catch {
        toast.error("An error occurred while creating the chapter.");
      }

    })

  };

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>

      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-1/2 gap-2">
          <Plus className="size-4"/> New Lesson
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">

        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
          <DialogDescription>What would like to name your lesson?</DialogDescription>
        </DialogHeader>

        {/*yet to add handle function*/}

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-6">

            <FieldGroup>
              <Controller
                name={"name"}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className={"space-y-3"}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder={"Please enter a name for your lesson"}
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button
              type={"submit"}
              className={"w-1/2 mx-auto font-semibold"}
              disabled={createPending}
            >
              {createPending ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <>
                  Create lesson <PlusIcon className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
