"use client"
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Controller, useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Edit3Icon, Loader, PlusIcon, XIcon} from "lucide-react";
import {changeEmailSchema, ChangeEmailSchemaType} from "@/lib/db/zodSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {useTransition, useState} from "react";
import {changeEmail} from "@/lib/auth/publisher-change-email";

interface Props {
    email: string;
}

export function ChangeEmailForm({email}: Props) {

    const [pendingTransition, startEditTransition] = useTransition();

    const [isEditActive, setIsEditActive] = useState(false);

    const form = useForm<ChangeEmailSchemaType>({
        resolver: zodResolver(changeEmailSchema),
        defaultValues: {
            oldEmail: email,
            newEmail: "",
        },
    });

    const onSubmit = async (values: ChangeEmailSchemaType) => {
        startEditTransition(async () => {
            try {
                const result = await changeEmail({currentEmail: values.oldEmail, newEmail: values.newEmail});

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
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4 mb-4">
                    <div className={"flex gap-4 items-end"}>
                        <FieldGroup>
                            <Controller
                                name={"oldEmail"}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className={"space-y-3"}>
                                        <FieldLabel htmlFor={field.name}>{isEditActive ? "Current Email" : "Email"}</FieldLabel>

                                        <Input
                                            {...field}
                                            id={field.name}
                                            type={"email"}
                                            aria-invalid={fieldState.invalid}
                                            placeholder={"Your current email is..."}
                                            value={field.value}
                                        />

                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <Button type={"button"} className={"w-fit items-center shrink-0 font-semibold"} variant={isEditActive ? "outline" : "default"} onClick={() => setIsEditActive(!isEditActive)}>
                            {isEditActive ? "Cancel" : "Change email"}
                            {isEditActive ? <XIcon className={"ml-1 size-5"} /> : <Edit3Icon className={"ml-1 size-5"}/>}
                        </Button>
                    </div>


                    <div className={`overflow-hidden transition-all duration-500 eas-in-out ${isEditActive ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0 pointer-events-none"}`}>

                        <div className={"flex gap-4 items-end"}>
                            <FieldGroup className="flex-1 min-w-0">
                                <Controller
                                    name={"newEmail"}
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className={"space-y-3"}>
                                            <FieldLabel htmlFor={field.name}>New Email</FieldLabel>

                                            <Input
                                                {...field}
                                                id={field.name}
                                                type={"email"}
                                                aria-invalid={fieldState.invalid}
                                                placeholder={"Your new email should be..."}
                                                value={field.value}
                                            />

                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                                        </Field>
                                    )}
                                />
                            </FieldGroup>

                            <Button
                                type={"submit"}
                                className={"w-fit shrink-0 font-semibold"}
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