import SignInForm from "@/app/(auth)/_components/sign-in-form";
import {headers} from "next/headers";
import {auth} from "@/lib/auth/auth";
import {redirect} from "next/navigation";

export default async function SignInPage () {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(session) {

        return redirect("/");

    }

    return (

        <SignInForm />
    )
}