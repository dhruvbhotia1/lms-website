"use client"

import {Card, CardContent, CardTitle, CardHeader, CardDescription} from "@/components/ui/card";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {useEffect, useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {Loader2Icon} from "lucide-react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";


export default function VerifyRequest() {


    const [otp, setOtp] = useState("");

    const [verificationPending, startVerificationTransition] = useTransition();

    const [resendPending, startResendTransition] = useTransition();

    const [countdown, setCountdown] = useState(0);

    const [error, setError] = useState("");

    const {data: session, isPending: sessionPending} = authClient.useSession();

    const router = useRouter();

    useEffect(() => {
        if(countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);

            return () => clearTimeout(timer);
        }
    }, [countdown])



    if(sessionPending) {

        return (

            <div className={"h-full flex items-center justify-center"}>

                <Loader2Icon className={"size-6 animate-spin text-muted-foreground"}/>

            </div>
        )

    }



    function resendOTP() {

        setCountdown(60);

        if(!session?.user?.email) {

            return;
        }

        startResendTransition(async () => {

            await authClient.emailOtp.sendVerificationOtp({
                email: session.user.email,
                type: "email-verification",
                fetchOptions: {
                    onSuccess: () => {

                        toast.success("Resent. Check your email for an OTP to verify it.")
                    }
                }

            })

        })

    }


    function verifyOtp() {

        if(!session?.user?.email) {

            return;
        }

        startVerificationTransition(async () => {



            const {data, error} = await authClient.emailOtp.verifyEmail({
                email: session.user.email,
                otp,
                fetchOptions: {
                    onSuccess: () => {

                        router.push("/");
                    },
                    onError: (error) => {

                        setError(error.error.message);
                    }
                }
            })
        })
    }



    return (
        <Card className={"w-full mx-auto"}>
            <CardHeader className={"text-center"}>
                <CardTitle className={"text-xl"}>
                    Please check your email
                </CardTitle>

                <CardDescription>
                    Enter the code sent by us to your email address to verify your account.
                </CardDescription>
            </CardHeader>


            <CardContent className={"text-center"}>
                <div className={"flex flex-col items-center space-y-2 gap-y-4"}>
                    <InputOTP maxLength={6} className={"gap-2"} value={otp} onChange={(value) => setOtp(value)}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0}/>
                            <InputOTPSlot index={1}/>
                            <InputOTPSlot index={2}/>
                        </InputOTPGroup>



                        <InputOTPGroup>
                            <InputOTPSlot index={3}/>
                            <InputOTPSlot index={4}/>
                            <InputOTPSlot index={5}/>
                        </InputOTPGroup>
                    </InputOTP>

                    <p className={"text-sm text-muted-foreground"}>Enter the 6-digit code sent to your email.</p>

                    <p className={"text-sm text-muted-foreground"}>{error}</p>
                </div>

                <Button className={"w-full flex justify-center mt-4 font-semibold"} onClick={verifyOtp} disabled={verificationPending}>
                    Verify
                </Button>

                <Button className={"w-full flex justify-center mt-4 font-semibold"} onClick={resendOTP} disabled={resendPending || countdown > 0}>
                    {countdown > 0 ? `${countdown} seconds to resend again.` : "Resend OTP"}
                </Button>


            </CardContent>
        </Card>
    )
}