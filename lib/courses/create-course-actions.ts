"use server";

import { courseSchema, CourseSchemaType } from "../zodSchema";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "../types";
import { requirePublisher} from "@/app/data/publisher/require-publisher";
import arcjet from "../arcjet";
import { detectBot, fixedWindow } from "../arcjet";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    }),
  );

export async function createCourse(
  values: CourseSchemaType,
): Promise<ApiResponse> {
  const session = await requirePublisher(); //checks for logged in user and publisher roles presence.

  if (!session) {
    return redirect('/become-publisher');
  }

  try {
    const decision = await aj.protect(await request(), {
      fingerprint: session?.user.id,
    }); // rate limiting for creating courses (form submissions).

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "You are a bot or have exceeded the rate limit.",
      };
    }

    const validation = courseSchema.safeParse(values);

    if (!session) {
      return {
        status: "error",
        message:
          "You must be logged in and have publisher privileges to create a course.",
      };
    }

    // const currentUser = await auth.api.getSession({
    //   headers: await headers(),
    // });

    // if (!currentUser) {
    //   return {
    //     status: "error",
    //     message: "You must be logged in to create a course.",
    //   };
    // } commented out this validation because now we can use the session from the requirePublisher function

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session!.user.id,
      },
    });

    return {
      status: "success",
      message: "course created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to create course.Please recheck all values. Remember slugs of your courses should be unique.",
    };
  }
}
