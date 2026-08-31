"use server"

import {requirePublisher} from "@/lib/auth/require-publisher";
import {notFound} from "next/navigation";
import {ApiResponse} from "@/lib/auth/apiResponseTypes";
import {prisma} from "@/lib/db/prisma";
import {refresh, revalidatePath} from "next/cache";

interface Props {

    currentName: string;
    newName: string;

}

export async function changeName({currentName, newName}: Props): Promise<ApiResponse> {

    const session = await requirePublisher();

    if(!session) {
        notFound();
    }

    if(newName === currentName) {
        return {status: "error", message: "Please choose a new name"};
    }

    try {

        await prisma.user.update({

            where: {
                id: session.user.id,
            },

            data: {
                name: newName
            }
        })

        revalidatePath('/publisher/settings');


        return {status: "success", message: "Name updated successfully."};

    } catch (error) {

        return {status: "error", message: `${error instanceof Error ? error.message : String(error)}`};

    }


}