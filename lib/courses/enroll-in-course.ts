"use server"

import {ApiResponse} from "@/lib/auth/apiResponseTypes";
import {requireUser} from "@/lib/auth/require-user";
import {prisma} from "@/lib/db/prisma";
import {stripe} from "@/lib/stripe";
import Stripe from "stripe";
import {redirect} from "next/navigation";
import arcjet, {fixedWindow} from "../auth/arcjet"
import {request} from "@arcjet/next";

interface Props {

    courseId: string
}

const aj = arcjet.withRule(
    fixedWindow({
        mode: "LIVE",
        window: "1m",
        max: 5
    })
)

export async function enrollInCourse({courseId}: Props): Promise<ApiResponse | never> {

    const {user} = await requireUser(); //destructuring user from the session.

    let checkoutUrl: string;

    try {

        const req = await request();

        const decision = await aj.protect(req, {
            fingerprint: user.id,
        });

        if(decision.isDenied()) {
            return {
                status: "error",
                message: "You have been blocked."
            }
        }


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

        let stripeCustomerId: string;

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
                } //metadata is the object of things we want stripe to store
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
            }); //searching for an existing enrollment

            if (existingEnrollment?.status == "Active") {

                return {

                    status: "success",
                    message: "You are already enrolled in this course."
                }

            } //if the enrollment status is active we return the message and break the execution

            let enrollment; //setting a new enrollment.

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
                        courseOwnerId: user.id,
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
               success_url: `${process.env.BETTER_AUTH_URL}/payment/success`,
               cancel_url: `${process.env.BETTER_AUTH_URL}/payment/cancel`,
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

    redirect(checkoutUrl);
}