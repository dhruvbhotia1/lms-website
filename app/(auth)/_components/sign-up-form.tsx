// sign-in page
"use client"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FaGithub, FaGoogle} from "react-icons/fa6";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {authClient} from "@/lib/auth/auth-client";
import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Loader2Icon, TriangleAlert} from "lucide-react";


export default function SignUpForm () {

    const [email, setEmail] = useState("");

    const [name, setName] = useState("");

    const [password, setPassword] = useState("");

    const router = useRouter();


    const [githubPending, githubTransition] = useTransition();

    const [googlePending, googleTransition] = useTransition();

    const [emailPending, emailTransition] = useTransition();

    const [signUpError, setSignUpError] = useState("");

    const handleGithubSignUp = async () => {

        githubTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/"
            }, {
                onSuccess: () => {
                    toast.success("Sign up successful!");

                },
                onError: (error) => {

                    setSignUpError(error.error.message);

                }

            });
        })
    }


    const handleGoogleSignUp = async () => {


        googleTransition( async () => {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/"
            }, {
                onSuccess: () => {
                    toast.success("Sign up successful!")
                },
                onError: (error) => {

                    setSignUpError(error.error.message);

                }
            });
        })

    }

    const handleEmailSignUp = async () => {

        emailTransition(async () => {
            await authClient.signUp.email({
                name,
                email,
                password,
                fetchOptions: {
                    onSuccess: async () => {

                        await authClient.emailOtp.sendVerificationOtp({
                            email,
                            type: "email-verification",
                            fetchOptions: {
                                onSuccess: () => {

                                    toast.success("Sign up successful!. Check your email for an OTP to verify it. ")

                                    router.push("/verify-request")
                                },
                                onError: (error) => {

                                    setSignUpError(error.error.message);

                                }
                            }

                        })
                    },
                    onError: (ctx) => {
                        router.push('/sign-up');
                        setSignUpError(ctx.error.message);
                        toast.error("An error occurred while trying to create your account.");
                    }
                }
            })
        })


    }




    return (

        <Card className={"gap-y-6"}>
            <CardHeader>
                <CardTitle className={"text-xl"}>
                    Welcome
                </CardTitle>
                <CardDescription>
                    Sign up using your email or service.
                </CardDescription>
            </CardHeader>

            <CardContent>

                <div className={"flex flex-col gap-y-6"}>
                    <Button className={"text-sm w-full gap-x-4"} onClick={handleGithubSignUp} disabled={githubPending}>
                        {
                            githubPending ? (
                                <Loader2Icon className={"size-4 animate-spin"}/>
                            ) : (

                                <>
                                    <FaGithub className={"size-4"}/>
                                    Sign up with Github
                                </>
                            )
                        }
                    </Button>

                    <Button className={"text-sm w-full gap-x-4"} onClick={handleGoogleSignUp} disabled={googlePending}>
                        {
                            googlePending ? (
                                <Loader2Icon className={"size-4 animate-spin"}/>
                            ) : (
                                <>
                                    <FaGoogle className={"size-4"}/>
                                    Sign up with Google
                                </>
                            )
                        }
                    </Button>
                </div>

                <div className={"relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border mt-4"}>
                    <span className={"relative z-10 bg-card px-2 text-muted-foreground"}>Or continue with</span>
                </div>


                <div className={"grid gap-6"}>

                    <div className={"grid gap-y-6"}>

                        <div className={"grid gap-y-3"}>
                            <Label htmlFor={"name"}>Full Name</Label>

                            <Input type={"name"} placeholder={"Enter your full name"} value={name} onChange={(e) => setName(e.target.value)} disabled={emailPending}/>
                        </div>


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
                        !!signUpError && (

                            <div className={"bg-destructive p-3 rounded-md flex items-center gap-x-2 text-sm  mb-4 text-white font-semibold justify-center"}>
                                <TriangleAlert className={"size-5"}/>
                                <p className={"font-semibold"}>{signUpError}</p>
                            </div>
                        )
                    }

                    <Button onClick={handleEmailSignUp}>
                        {
                            emailPending ? (
                                <Loader2Icon className={"size-4 animate-spin"}/>
                            ) : (
                                <>
                                    <p className={"text-sm font-semibold"}>Sign Up</p>
                                </>
                            )
                        }
                    </Button>

                    <Button onClick={() => router.push("/sign-in")}>

                        Continue to sign in
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}