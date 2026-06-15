import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { admin, emailOTP } from "better-auth/plugins";
import { resend } from "@/lib/resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        const { data, error } = await resend.emails.send({
          from: "LearnersHub <onboarding@resend.dev>",
          to: [email],
          subject: "Verify your email using this OTP",
          html: `Your OTP to verify your email for LearnersHub is ${otp}`,
        });

        if (error) {
          console.error("🚨 RESEND ERROR:", error);
          throw new Error("Failed to send verification email");
        }

        console.log("Email sent. with id", data?.id);
      },
    }),
    admin(),
  ],

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },

    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
