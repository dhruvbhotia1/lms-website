import {auth} from "@/lib/auth/auth"
import {headers} from "next/headers";
import {prisma} from "@/lib/db/prisma";

interface Props {
    courseId: string;
}

export async function checkIfCourseBought({courseId}: Props) {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session?.user) {
        return false
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                courseId: courseId,
                userId: session?.user?.id,
            }
        },
        select: {
            status: true,
        }
    });

    return enrollment?.status === "Active";
}