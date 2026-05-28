// sign-in page
"use client"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FaGithub, FaGoogle} from "react-icons/fa6";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {authClient} from "@/lib/auth-client";
import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Loader2Icon} from "lucide-react";
import {TriangleAlert} from "lucide-react";

export default function SignInForm () {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const router = useRouter();

    const [githubPending, githubTransition] = useTransition();

    const [googlePending, googleTransition] = useTransition();

    const [emailPending, emailTransition] = useTransition();

    const [loginError, setLoginError] = useState("");

    const handleGithubSignIn = async () => {

        githubTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/"
            }, {
                onSuccess: () => {
                    toast.success("Login successful!");

                },

                onError: (error) => {

                    setLoginError(error.error.message);
                    toast.error("An error occurred!");

                }

            });
        })
    }


    const handleGoogleSignIn = async () => {


        googleTransition( async () => {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/"
            }, {
                onSuccess: () => {
                    toast.success("Login successful!")
                },

                onError: (error) => {

                    setLoginError(error.error.message);
                    toast.error("An error occurred!");

                }
            });
        })

    }

    const handleEmailSignIn = async () => {

        emailTransition(async () => {
           const {data, error} = await authClient.signIn.email({
               email,
               password,
               fetchOptions: {
                   onSuccess: () => {
                       toast.success("Login successful!");
                       router.replace('/');

                   },

                   onError: (error) => {

                       setLoginError(error.error.message);
                       toast.error("An error occurred!");

                   }
               }
           })
        })


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
                    <Button className={"text-sm w-full gap-x-4"} onClick={handleGithubSignIn} disabled={githubPending}>
                        {
                            githubPending ? (
                                <Loader2Icon className={"size-4 animate-spin"}/>
                            ) : (

                                <>
                                    <FaGithub className={"size-4"}/>
                                    Sign in with Github
                                </>
                            )
                        }
                    </Button>

                    <Button className={"text-sm w-full gap-x-4"} onClick={handleGoogleSignIn} disabled={googlePending}>
                        {
                            googlePending ? (
                                <Loader2Icon className={"size-4 animate-spin"}/>
                            ) : (
                                <>
                                    <FaGoogle className={"size-4"}/>
                                    Sign in with Google
                                </>
                            )
                        }
                    </Button>
                </div>

                <div className={"relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border mt-4"}>
                    <span className={"relative z-10 bg-card px-2 text-muted-foreground"}>Or continue with</span>
                </div>


                <div className={"grid gap-y-4"}>

                    <div className={"grid gap-y-6 mb-3"}>
                        <div className={"grid gap-y-3"}>
                            <Label htmlFor={"email"}>Email</Label>

                            <Input type={"email"} placeholder={"Enter your email address"} value={email} onChange={(e) => setEmail(e.target.value)} disabled={emailPending}/>
                        </div>

                        <div className={"grid gap-y-3"}>
                            <Label htmlFor={"password"}>Password</Label>

                            <Input type={"password"} placeholder={"Enter your password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={emailPending}/>
                        </div>
                    </div>

                    {
                        !!loginError && (

                            <div className={"bg-destructive p-3 rounded-md flex items-center gap-x-2 text-sm  mb-4 text-white font-semibold justify-center"}>
                                <TriangleAlert className={"size-5"}/>
                                <p className={"font-semibold"}>{loginError}</p>
                            </div>
                        )
                    }

                    <Button onClick={handleEmailSignIn} disabled={emailPending}>

                        {
                            emailPending ? (
                                <Loader2Icon className={"size-4 animate-spin"}/>
                            ) : (
                                <>
                                    <p className={"text-sm font-semibold"}>Login</p>
                                </>
                            )
                        }
                    </Button>

                    <Button onClick={() => router.push("/sign-up")}>

                        Create a new account
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}