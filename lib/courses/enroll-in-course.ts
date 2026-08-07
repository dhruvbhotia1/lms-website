"use server"

import {ApiResponse} from "@/lib/auth/apiResponseTypes";
import {requireUser} from "@/lib/auth/require-user";
import {prisma} from "@/lib/db/prisma";
import {stripe} from "@/lib/stripe";
import Stripe from "stripe";

interface Props {

    courseId: string
}

export async function enrollInCourse({courseId}: Props): Promise<ApiResponse> {

    const {user} = await requireUser();

    let checkoutUrl: string;

    try {

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            select: {
                id: true,
                title: true,
                price: true,
                slug:true
            }
        })

        if(!course) {
            return {
                status: "error",
                message: "Course not found"
            }
        }

        let stripeCustomerId;

        const userWithStripeCustomerId = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                stripeCustomerId: true
            }
        })

        if(userWithStripeCustomerId?.stripeCustomerId) {
            stripeCustomerId = userWithStripeCustomerId.stripeCustomerId; //storing the stripe custome id on the local storage
        } else {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id,
                }
            });

            stripeCustomerId = customer.id;

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    stripeCustomerId: stripeCustomerId,
                }
            });

        }

        const result = await prisma.$transaction(async (tx) => {

            const existingEnrollment = await tx.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: courseId
                    }
                },
                select: {
                    status: true,
                    id: true
                }
            });

            if (existingEnrollment?.status == "Active") {

                return {

                    status: "success",
                    message: "You are already enrolled in this course."
                }

            }

            let enrollment;

            if(existingEnrollment) {

                enrollment = await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id,
                    },
                    data: {
                        amount: course.price,
                        status: "Pending",
                        updatedAt: new Date()
                    }
                });
            } else {
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        amount: course.price,
                        status: "Pending",
                    }
                });

            }

           const checkoutSession = await stripe.checkout.sessions.create({
               customer: stripeCustomerId,
               line_items: [
                   {
                       price: "price_1U1ccvGjVaoj8oFoUVcsyySE",
                       quantity: 1,
                   }
               ],
               mode: 'payment',
               success_url: 'asdf',
               cancel_url: 'asdf',
               metadata: {
                   userId: user.id,
                   courseId: course.id,
                   enrollmentId: enrollment.id,

               }
           });

            return {

                enrollment: enrollment,
                checkoutUrl: checkoutSession.url,
            }
        });

        checkoutUrl = result.checkoutUrl as string;


        return {
            status: "success",
            message: "Enrolled In course",
        }

    } catch (error) {

        if(error instanceof Stripe.errors.StripeError) {
            return {
                status: "error",
                message: "Payment system error. Please try again later."
            }
        }

        return {
            status: "error",
            message: "Failed to enroll in course"
        }

    }
}