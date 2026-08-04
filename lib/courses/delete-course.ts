"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { deleteThumbnail } from "./delete-thumbnail";
import arcjet from "../arcjet";
import { detectBot, fixedWindow } from "arcjet";
import { request } from "@arcjet/next";

interface Props {
  courseId: string;
  userEmail: string;
  name: string;
}

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

export const deleteCourse = async ({ courseId, userEmail, name }: Props): Promise<ApiResponse> => {
  const session = await requireAdmin(); // authenticate before calling this api.

  if (!session) {
    return {
      status: "error",
      message: "Unauthorized",
    };
  }

  const decision = await aj.protect(await request(), {
        fingerprint: session?.user.id,
  }); // rate limiting for creating courses (form submissions).

  if (decision.isDenied()) {
    return {
       status: "error",
       message: "You are a bot or have exceeded the rate limit.",
     };
  }

  const courseToDelete = await prisma.course.findUnique({
    where: {
      id: courseId
    },
    select: {
      userId: true,
      title: true,
      thumbnail: true,
    }
  });

  if (!courseToDelete) {
    return {
      status: "error",
      message: "No course to delete."
    }
  }

  //IMPLEMENT PASSWORD COMPARISON OR OTP VERIFICATION BEFORE DELETING.

  const isAuthorized = session.user.id === courseToDelete.userId! && session.user.email === userEmail;

  if (isAuthorized && courseToDelete.title === name) {
    const deleteThumbnailResult = await deleteThumbnail({ courseThumbnailKey: courseToDelete.thumbnail });

    if (deleteThumbnailResult.status === "error") {
      return {
        status: "error",
        message: deleteThumbnailResult.message,
      };
    }

    await prisma.course.deleteMany({
      where: {
        id: courseId,
        userId: session.user.id,
      },
    }); //only going to delete on in any case because of the id: courseId, id will be unique, check is for extra security for the userid.

    return {
      status: "success",
      message: "Course deleted successfully",
    };
  } else {
    return {
      status: "error",
      message: "Oops! Couldn't delete this course. Please recheck the credentials. If the error persists, please contact support.",
    };
  }
};
