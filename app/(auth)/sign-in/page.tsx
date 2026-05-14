// sign-in page
"use client"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FaGithub, FaGoogle} from "react-icons/fa6";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {authClient} from "@/lib/auth-client";
import {useState} from "react";
import {useRouter} from "next/navigation";


export default function LoginPage () {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const router = useRouter();

    const handleGithubSignIn = async () => {

        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/"
        });


    }

    const handleGoogleSignIn = async () => {

        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/"
        });


    }

    const handleEmailSignIn = async () => {

        await authClient.signIn.email({
           email,
            password,
            callbackURL: "/"
        });


    }





    return (

        <Card className={"gap-y-6"}>
            <CardHeader>
                <CardTitle className={"text-xl"}>
                    Welcome Back
                </CardTitle>
                <CardDescription>
                    Login using your email or service.
                </CardDescription>
            </CardHeader>

            <CardContent>

               <div className={"flex flex-col gap-y-6"}>
                   <Button className={"text-sm w-full gap-x-4"} onClick={handleGithubSignIn}>
                       <FaGithub className={"size-4"}/>
                       Sign in with Github
                   </Button>

                   <Button className={"text-sm w-full gap-x-4"} onClick={handleGoogleSignIn}>
                       <FaGoogle className={"size-4"}/>
                       Sign in with Google
                   </Button>
               </div>

                <div className={"relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border mt-4"}>
                    <span className={"relative z-10 bg-card px-2 text-muted-foreground"}>Or continue with</span>
                </div>


                <div className={"grid gap-6"}>

                    <div className={"grid gap-y-6"}>
                       <div className={"grid gap-y-3"}>
                           <Label htmlFor={"email"}>Email</Label>

                           <Input type={"email"} placeholder={"Enter your email address"} value={email} onChange={(e) => setEmail(e.target.value)}/>
                       </div>

                        <div className={"grid gap-y-3"}>
                            <Label htmlFor={"password"}>Password</Label>

                            <Input type={"password"} placeholder={"Enter your password"} value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </div>

                    <Button onClick={handleEmailSignIn}>
                        Login
                    </Button>

                    <Button onClick={() => router.push("/sign-up")}>

                         Create a new account
                    </Button>


                </div>
            </CardContent>
        </Card>
    )
}