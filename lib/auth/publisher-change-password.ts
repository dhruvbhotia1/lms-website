"use server"

import {requirePublisher} from "@/lib/auth/require-publisher";
import {notFound} from "next/navigation";
import {ApiResponse} from "@/lib/auth/apiResponseTypes";
import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";

interface Props {

    currentPassword: string;
    newPassword: string;
}

export async function changePassword({currentPassword, newPassword}: Props): Promise<ApiResponse> {

    const session = await requirePublisher();

    if(!session) {
        notFound();
    }

    const isValidPassword = currentPassword !== newPassword;

    if(isValidPassword) {
        try {

            const data = await auth.api.changePassword({
                body: {
                    newPassword, // required, The new password to set
                    currentPassword, // required, The current user password
                    revokeOtherSessions: true, // When set to true, all other active sessions for this user will be invalidated
                },

                headers: await headers()
            });


            return {status: "success", message: "Password changed successfully."};

        } catch (error) {

            return {status: "error", message: `${error instanceof Error ? error.message : String(error)}`};

        }
    }

    return {status: "error", message: "internal server error."};
}