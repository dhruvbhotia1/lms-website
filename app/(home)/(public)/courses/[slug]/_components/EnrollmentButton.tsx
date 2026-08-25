"use client";

import {Button} from "@/components/ui/button";
import {useTransition} from "react";
import {enrollInCourse} from "@/lib/courses/enroll-in-course";

interface Props {
    courseId: string;
}

export function EnrollmentButton({courseId}: Props) {

    const [pendingEnrollement, startEnrollmentTransition] = useTransition();

    function onSubmit() {

        startEnrollmentTransition(async () => {

            const result = await enrollInCourse({courseId});
        })

    }


    return (
        <Button className={"w-full "}>
            Enroll Now
        </Button>
    )
}