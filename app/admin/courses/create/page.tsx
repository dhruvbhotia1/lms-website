"use client"
import Link from "next/link";
import {ArrowLeft, PlusIcon, SparkleIcon} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card";
import {useForm} from 'react-hook-form';
import {courseLevel, courseSchema, CourseSchemaType, courseStatus} from "@/lib/zodSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Controller} from "react-hook-form";
import {Input} from "@/components/ui/input";
import slugify from "slugify";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {courseCategories} from "@/lib/zodSchema";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import {Uploader} from "@/components/file-uploader/Uploader";

export default function CourseCreatePage() {


    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "",
            description: "",
            fileKey: "",
            price: 0,
            duration: 0,
            level: "Beginner",
            category: "Other",
            courseStatus: "Draft",
            slug: "",
            smallDescription: "",
            thumbnail: ""
        }
    })


    const onSubmit = (values: CourseSchemaType) => {
        console.log(values);
    }


    const generateSlug = () => {

        const titleValue = form.getValues("title");

        const slug = slugify(titleValue);

        form.setValue('slug', slug, {
            shouldValidate: true
        })

    }

    return (
        <>

            <div className={"flex items-center gap-4"}>
                <Link href={"/admin/courses"} className={buttonVariants({
                    size: 'lg',
                    variant: 'outline',
                    className: "font-semibold",
                })}>

                    <ArrowLeft className={"size-5"}/>

                    Go Back

                </Link>
            </div>

            <h1 className={"text-2xl font-bold"}>Create Courses</h1>

            <Card className={"space-y-4 w-3/4 mx-auto"}>
                <CardHeader className={"space-y-2"}>

                    <CardTitle>
                        Basic Information
                    </CardTitle>

                    <CardDescription>Provide basic information about the course.</CardDescription>

                </CardHeader>

                <CardContent>

                    <form id={"course-create-form"} onSubmit={form.handleSubmit(onSubmit)}>

                        <div className="flex flex-col gap-7">

                            <FieldGroup>
                                <Controller name={"title"} control={form.control} render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid} className={"space-y-3"}>
                                        <FieldLabel htmlFor={field.name}>
                                            Title
                                        </FieldLabel>

                                        <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder={"Title of the course will be..."}/>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}/>
                            </FieldGroup>

                            <div className={"flex gap-4 items-end"}>

                                <FieldGroup>
                                    <Controller name={"slug"} control={form.control} render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid} className={"space-y-3"}>

                                            <FieldLabel htmlFor={field.name}>

                                                Slug

                                            </FieldLabel>

                                            <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder={"Slug for the title"} value={field.value}/>
                                        </Field>
                                    )}/>
                                </FieldGroup>

                                <Button type={'button'} className={'w-fit'} onClick={generateSlug}>
                                    Generate slug

                                    <SparkleIcon className={"ml-1 size-5"}/>
                                </Button>
                            </div>


                            <FieldGroup>
                                <Controller name={"fileKey"} control={form.control} render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid} className={"space-y-3"}>
                                        <FieldLabel htmlFor={field.name}>
                                            File Key
                                        </FieldLabel>

                                        <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder={"Please enter the link to your course."}/>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}/>
                            </FieldGroup>

                            <FieldGroup>
                                <Controller name={"thumbnail"} control={form.control} render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid} className={"space-y-3"}>
                                        <FieldLabel htmlFor={field.name}>
                                            Thumbnail
                                        </FieldLabel>

                                        <Uploader/>

                                        {/*<Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder={"Please provide the url for the thumbnail of this course."}/>*/}

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}/>
                            </FieldGroup>

                            {/*add a button to generate descriptions with ai*/}

                            <FieldGroup>
                                <Controller name={"smallDescription"} control={form.control} render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid} className={"space-y-3"}>
                                        <FieldLabel htmlFor={field.name}>

                                            Small Description

                                        </FieldLabel>

                                        <RichTextEditor field={field}/>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}/>
                            </FieldGroup>


                            <FieldGroup>
                                <Controller name={"description"} control={form.control} render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid} className={"space-y-3"}>
                                        <FieldLabel htmlFor={field.name}>
                                            Description
                                        </FieldLabel>

                                        <RichTextEditor field={field}/>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}/>
                            </FieldGroup>

                            <FieldGroup>
                                <Controller name={"category"} control={form.control} render={({field, fieldState}) => (
                                    <Field orientation={'responsive'} data-invalid={fieldState.invalid}>

                                        <FieldContent className={"gap-y-3"}>
                                            <FieldLabel htmlFor={field.name}>
                                                Category
                                            </FieldLabel>

                                            <FieldDescription>
                                                Select a category of field of academia this course is built around.
                                            </FieldDescription>

                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>

                                        <Select name={field.name} value={field.value} onValueChange={field.onChange}>

                                            <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                                                <SelectValue placeholder={"Select"}/>
                                            </SelectTrigger>

                                            <SelectContent position={"item-aligned"}>
                                                {courseCategories.map((category) => (
                                                    <SelectItem key={category} value={category}>

                                                        {category}

                                                    </SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>

                                    </Field>
                                )}/>
                            </FieldGroup>

                            <FieldGroup>
                                <Controller name={"level"} control={form.control} render={({field, fieldState}) => (
                                    <Field orientation={'responsive'} data-invalid={fieldState.invalid}>

                                        <FieldContent className={'gap-y-3'}>
                                            <FieldLabel htmlFor={field.name}>
                                                Level
                                            </FieldLabel>

                                            <FieldDescription>
                                                Select a level of knowledge this course contains
                                            </FieldDescription>

                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>

                                        <Select name={field.name} value={field.value} onValueChange={field.onChange}>

                                            <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                                                <SelectValue placeholder={"Select"}/>
                                            </SelectTrigger>

                                            <SelectContent position={"item-aligned"}>
                                                {courseLevel.map((level) => (
                                                    <SelectItem key={level} value={level}>
                                                        {level}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>

                                    </Field>
                                )}/>
                            </FieldGroup>


                            <FieldGroup>
                                <Controller name={"duration"} control={form.control} render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid} className={"flex flex-row space-y-3"}>
                                        <FieldLabel htmlFor={field.name}>
                                            Duration (hours)
                                        </FieldLabel>

                                        <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder={"Please enter the duration of this course."} type={"number"} onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}/>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}/>
                            </FieldGroup>

                            <FieldGroup>
                                <Controller name={"price"} control={form.control} render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid} className={"flex flex-row space-y-3"}>
                                        <FieldLabel htmlFor={field.name}>
                                            Price (USD)
                                        </FieldLabel>

                                        <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder={"Please enter the cost to access this course in USD."} type={"number"} onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}/>

                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}/>
                            </FieldGroup>



                            <FieldGroup>
                                <Controller name={"courseStatus"} control={form.control} render={({field, fieldState}) => (
                                    <Field orientation={'responsive'} data-invalid={fieldState.invalid}>

                                        <FieldContent className={'gap-y-3'}>
                                            <FieldLabel htmlFor={field.name}>
                                                Status
                                            </FieldLabel>

                                            <FieldDescription>
                                                Select the current status of this course.
                                            </FieldDescription>

                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>

                                        <Select name={field.name} value={field.value} onValueChange={field.onChange}>

                                            <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                                                <SelectValue placeholder={"Select"}/>
                                            </SelectTrigger>

                                            <SelectContent position={"item-aligned"}>
                                                {courseStatus.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>

                                    </Field>
                                )}/>
                            </FieldGroup>

                            <Button type={'submit'} form={"course-create-form"} className={'w-1/2 mx-auto font-semibold'}>

                                Create course <PlusIcon className="w-5 h-5" />

                            </Button>
                        </div>

                    </form>


                </CardContent>
            </Card>
        </>
    )
}