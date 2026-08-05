import SignUpForm from "@/app/(auth)/_components/sign-up-form"
import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

export default async function SignUpPage() {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(session) {

        return redirect("/");

    }

    return (
        <SignUpForm/>
    )
}