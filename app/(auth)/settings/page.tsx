import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {  buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {ChangeEmailForm} from "@/app/(auth)/settings/_components/changeEmailForm";
import {requirePublisher} from "@/lib/auth/require-publisher";
import {ChangeNameForm} from "@/app/(auth)/settings/_components/changeNameForm";
import {ChangePasswordForm} from "@/app/(auth)/settings/_components/changePasswordForm";






export default async function SettingsPage() {

    const session = await requirePublisher()

    return (
        <>

            <Card className={"space-y-4 w-full mx-auto"}>
                <CardHeader className={"space-y-2"}>
                    <CardTitle>Your Information</CardTitle>

                    <CardDescription>You can modify your credentials below.</CardDescription>
                </CardHeader>

                <CardContent>

                   <div className={"flex flex-col gap-6"}>
                       <ChangeNameForm name={session.user.name}/>
                       <ChangeEmailForm email={session.user.email} />
                       <ChangePasswordForm userId={session.user.id}/>
                   </div>

                {/*    change password component*/}

                {/*    change name component*/}




                </CardContent>
            </Card>
        </>
    );
}
