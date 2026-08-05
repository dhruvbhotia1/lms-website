
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { chapterSchema, ChapterSchemaType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { useTransition } from "react";
import { Loader, PlusIcon } from "lucide-react";
import { createChapter } from "@/lib/courses/create-chapter";
import { toast } from "sonner";



interface Props {
  courseId: string;
}


export function NewChapterModal({ courseId }: Props) {

  const [createPending, startCreateTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: "",
      courseId: courseId,
    },
  });

  const onSubmit = async (values: ChapterSchemaType) => {

    startCreateTransition(async () => {

      try {
        const result = await createChapter(values);

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
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="size-4"/> New Chapter
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">

        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>What would like to name your chapter?</DialogDescription>
        </DialogHeader>

        {/*yet to add handle function*/}

        <form id={"chapter-create-form"} onSubmit={form.handleSubmit(onSubmit)}>
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
                      placeholder={"Please enter a name for your chapter"}
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button
              type={"submit"}
              form={"chapter-create-form"}
              className={"w-1/2 mx-auto font-semibold"}
              disabled={createPending}
            >
              {createPending ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <>
                  Create chapter <PlusIcon className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
