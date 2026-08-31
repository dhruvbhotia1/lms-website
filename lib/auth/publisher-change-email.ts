"use server"

import {requirePublisher} from "@/lib/auth/require-publisher";
import {notFound} from "next/navigation";
import {ApiResponse} from "@/lib/auth/apiResponseTypes";
import {prisma} from "@/lib/db/prisma";
import {revalidatePath} from "next/cache";

interface Props {

    currentEmail: string;
    newEmail: string;
}

export async function changeEmail({currentEmail, newEmail}: Props): Promise<ApiResponse> {

    const session = await requirePublisher();

    if(!session) {
        notFound();
    }

    if(newEmail === currentEmail) {
        return {status: "error", message: "Please choose a new email"};
    }

    const isCorrectEmail = currentEmail === session.user.email ;

    if(!isCorrectEmail) {
        return {status: "error", message: "Email doesn't match"};
    }


    if(isCorrectEmail) {

        try {

            await prisma.user.update({

                where: {
                    id: session.user.id,
                },

                data: {
                    email: newEmail
                }
            })

            revalidatePath('/publisher/settings')

            return {status: "success", message: "Email updated successfully."};

        } catch (error) {

            return {status: "error", message: `${error instanceof Error ? error.message : String(error)}`};

        }
    }

    return {status: "error", message: "internal Server Error"};
}