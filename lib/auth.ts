import {betterAuth} from "better-auth"
import {prismaAdapter} from "better-auth/adapters/prisma"
import {prisma} from "@/lib/prisma";
import {emailOTP} from "better-auth/plugins";
import {resend} from "@/lib/resend";

export const auth = betterAuth({

    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),

    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },

    plugins: [
        emailOTP({
            async sendVerificationOTP({email, otp}) {

                await resend.emails.send({
                    from: "LearnersHub <onboarding@resend.com>",
                    to: [email],
                    subject: "LearnersHub - verify your Email",
                    html: `<p>Your OTP is <strong>${otp}</strong></p>`
                })
            }
        })
    ],



    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        },

        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    }

})