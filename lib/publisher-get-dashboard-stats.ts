import {requirePublisher} from "@/lib/auth/require-publisher";
import {notFound} from "next/navigation";
import {prisma} from "@/lib/db/prisma";

export async function getDashboardStats() {

    const session = await requirePublisher();

    if(!session) {
        notFound();
    }

    const [totalCourses, totalCustomers, totalRevenue] = await Promise.all([
        prisma.course.count({
            where: {
                userId: session.user.id,
            },
        }),

        prisma.enrollment.count({
            where: {
                courseOwnerId: session.user.id,
            }
        }),

        prisma.enrollment.aggregate({
            where: {
                courseOwnerId: session.user.id,
            },

            _sum: {
                amount: true
            }
        })


    ])

    return {
        totalCourses,
        totalCustomers,
        totalRevenue: totalRevenue._sum.amount ?? 0,
    }


}