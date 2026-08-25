import {Card, CardContent} from "@/components/ui/card"
import {XIcon} from "lucide-react";


export default function PaymentCancelPage() {

    return(
        <div className={"w-full min-h-screen flex flex-1 justify-center items-center"}>

            <Card className={"w-87.5 "}>

                <CardContent className={"w-full"}>
                    <div className={"w-full flex justify-center"}>

                        <XIcon className={"size-10 p-2 bg-red-500/3 text-red-500 rounded-full"}/>

                    </div>

                    <div className={"mt-3 text-center sm:mt-5 w-full"}>
                        <h2 className={"text-xl font--semibold"}>
                            Payment Cancelled
                        </h2>
                        <p className={"font-semibold mt-3 "}>
                            Don&apos;t you will not be charged. Please try again later. If you are seeing this page again, please contact support or try a different payment method.
                        </p>
                    </div>
                </CardContent>

            </Card>

        </div>
    )

}