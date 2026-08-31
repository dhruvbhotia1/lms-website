"use client"
import {Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Controller, useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CrossIcon, Edit3Icon, Loader, PlusIcon, SparkleIcon, XIcon} from "lucide-react";
import {
    changeEmailSchema,
    ChangeEmailSchemaType,
    changeNameSchema,
    ChangeNameSchemaType,
    CourseSchemaType
} from "@/lib/db/zodSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {createCourse} from "@/lib/courses/publisher/create-course-actions";
import {toast} from "sonner";
import {useTransition, useState} from "react";
import {changeName} from "@/lib/auth/publisher-change-name";

interface Props {
    name: string;
}

export function ChangeNameForm({name}: Props) {

    const [pendingTransition, startEditTransition] = useTransition();

    const [isEditActive, setIsEditActive] = useState(false);

    const form = useForm<ChangeNameSchemaType>({
        resolver: zodResolver(changeNameSchema),
        defaultValues: {
            oldName: name,
            newName: "",
        },
    });

    const onSubmit = async (values: ChangeNameSchemaType) => {
        startEditTransition(async () => {
            try {
                const result = await changeName({currentName: values.oldName, newName: values.newName}); //change the api

                if (result.status === "success") {
                    toast.success(result.message);
                    form.reset();

                } else if (result.status === "error") {
                    toast.error(result.message);
                }
            } catch {
                toast.error("An unexpected error occurred. Please try again later.");
            }
        });
    };


    return (

        <div className={`rounded-lg border p-4 transition-colors ${isEditActive ? "border-primary/40 bg-muted/20" : "border-border"}`}>
            <form className={`${isEditActive ? "border-2 p-4 rounded-lg" : ""}`} onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4 mb-4">
                    <div className={"flex gap-4 items-end"}>
                        <FieldGroup>
                            <Controller
                                name={"oldName"}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className={"space-y-3"}>
                                        <FieldLabel htmlFor={field.name}>{isEditActive ? "Current Name" : "Name"}</FieldLabel>

                                        <Input
                                            {...field}
                                            id={field.name}
                                            type={"text"}
                                            aria-invalid={fieldState.invalid}
                                            placeholder={"Your current name is... (FIRST LAST)"}
                                            value={field.value}
                                        />

                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <Button type={"button"} className={"w-fit font-semibold"} onClick={() => setIsEditActive(!isEditActive)}>
                            {isEditActive ? "Cancel" : "Change name"}
                            {isEditActive ? <XIcon className={"ml-1 size-5"} /> : <Edit3Icon className={"mt-1 size-5"}/>}
                        </Button>
                    </div>


                    <div className={`overflow-hidden transition-all duration-500 eas-in-out ${isEditActive ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0 pointer-events-none"}`}>

                        <div className={"flex gap-4 items-end"}>
                            <FieldGroup>
                                <Controller
                                    name={"newName"}
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className={"space-y-3"}>
                                            <FieldLabel htmlFor={field.name}>New Name</FieldLabel>

                                            <Input
                                                {...field}
                                                id={field.name}
                                                type={"text"}
                                                aria-invalid={fieldState.invalid}
                                                placeholder={"First Name Last Name"}
                                                value={field.value}
                                            />

                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>

                            <Button
                                type={"submit"}
                                className={"w-fit font-semibold"}
                                disabled={pendingTransition}
                            >
                                {pendingTransition ? (
                                    <Loader className="size-4 animate-spin" />
                                ) : (
                                    <>
                                        Save Changes <PlusIcon className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </div>

                    </div>



                </div>
            </form>

        </div>

    )


}