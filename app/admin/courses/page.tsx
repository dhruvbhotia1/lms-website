import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

export default function CoursePage() {

    return (
        <div className={"flex items-center justify-between"}>

            <h1 className={"text-2xl font-bold"}>Your courses</h1>

            <Link className={buttonVariants({
                size: 'lg',
                variant: 'default',
                className: "font-semibold",
            })} href={`/admin/courses/create`}>
                Create course
            </Link>


        </div>
    )
}