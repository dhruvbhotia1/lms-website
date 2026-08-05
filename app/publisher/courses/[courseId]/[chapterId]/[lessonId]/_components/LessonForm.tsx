"use client"

import {  buttonVariants } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { PublisherLessonType } from "@/lib/courses/lessons/publisher-get-lesson"
import { lessonSchema, LessonSchemaType } from "@/lib/db/zodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/rich-text-editor/Editor"
import { Uploader } from "@/components/file-uploader/Uploader"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { Loader } from "lucide-react"
import { PlusIcon } from "lucide-react"
import { lessonConfigure } from "@/lib/courses/lessons/lesson-configure"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Props {
  data: PublisherLessonType
  chapterId: string
  courseId: string

}

export function LessonForm({ data, chapterId, courseId }: Props) {

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: data.title ?? "",
      chapterId: chapterId,
      courseId: courseId,
      description: data.description ?? undefined,
      thumbnailKey: data.thumbnailKey ?? undefined,
      videoKey: data.videoKey ?? undefined,
    }
  });

  const [lessonTransitionPending, startLessonTransition] = useTransition();

  const router = useRouter();

  const onSubmit = (values: LessonSchemaType) => {

    //edit logic goes here.
    startLessonTransition(async () => {
      try {
        const result = await lessonConfigure({ data: values, lessonId: data.id });

        if (result.status === "success") {
          toast.success(result.message);
          form.reset();
          router.push(`/publisher/courses/${courseId}/edit/`)
        } else {
          toast.error(result.message)
        }

      } catch {

        toast.error("Something went wrong while configuring the lesson.")

      }
    })

  }



  return (

    <div>
      <Link href={`/publisher/courses/${courseId}/edit`} className={buttonVariants({variant: "outline", size: "sm", className: "mb-6"})}>

        <ArrowLeft className="size-4" />

        Go Back
      </Link>

      <Card>
        <CardHeader>

          <CardTitle>Lesson Configuration</CardTitle>

          <CardDescription>
            Configure the video and description for this lesson.
          </CardDescription>

          <CardContent>

            <form onSubmit={form.handleSubmit(onSubmit)} id={"lesson-configure-form"}>

              <div className="flex flex-col gap-y-7 mt-4">

                <FieldGroup>
                  <Controller
                    name={"title"}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Title</FieldLabel>

                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder={"Title of the lesson will be..."}
                        />

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name={"description"}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Description</FieldLabel>

                        <RichTextEditor field={field} />

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name={"thumbnailKey"}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Thumbnail</FieldLabel>

                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="image"/>

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name={"videoKey"}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Video</FieldLabel>

                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="video"/>

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>


                <Button
                  type={"submit"}
                  form={"lesson-configure-form"}
                  className={"w-1/2 mx-auto font-semibold"}
                  disabled={lessonTransitionPending}
                >
                  {lessonTransitionPending ? (
                    <Loader className="size-4 animate-spin" />
                  ) : (
                    <>
                      Configure lesson <PlusIcon className="w-5 h-5" />
                    </>
                  )}
                </Button>

              </div>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )

}
