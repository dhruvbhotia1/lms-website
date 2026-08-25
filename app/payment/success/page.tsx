'use client';

import {Card, CardContent} from "@/components/ui/card"
import {ArrowLeft, Check} from "lucide-react";
import {useConfetti} from "@/lib/use-confetti";
import {useEffect} from "react";
import {Button, buttonVariants} from "@/components/ui/button";
import Link from "next/link";


export default function PaymentSuccessPage() {

    const {triggerConfetti} = useConfetti();

    useEffect(() => {
        triggerConfetti();
    }, [])

    return(
        <div className={"w-full min-h-screen flex flex-1 justify-center items-center"}>

            <Card className={"w-87.5 "}>

                <CardContent className={"w-full flex flex-col gap-y-5"}>
                    <div className={"w-full flex justify-center"}>

                        <Check className={"size-10 p-2 bg-green-500/3 text-green-500 rounded-full"}/>

                    </div>

                    <div className={"mt-3 text-center sm:mt-5 w-full"}>
                        <h2 className={"text-xl font--semibold"}>
                            Payment successful
                        </h2>

                        <p className={"font-semibold mt-3 "}>

                            Congrats your payment was successful. You should have access to the course now.

                        </p>
                    </div>

                    <Link className={buttonVariants({variant: 'default', className: "text-center font-semibold"})} href={"/learner-dashboard"}>
                        <ArrowLeft className={"size-5"}/>
                        Go to Dashboard
                    </Link>

                </CardContent>

            </Card>

        </div>
    )

}