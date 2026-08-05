"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";

export const makeUserPublisher = async (email: string): Promise<ApiResponse> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { status: "error", message: "Unauthorized. User Not Logged In." };
  }

  if (session.user.role === "Publisher") {
    return {
      status: "error",
      message: "Unauthorized. User is already a Publisher.",
    };
  }

  if (email !== session.user.email) {
    return { status: "error", message: "Unauthorized. Email does not match." };
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      role: "Publisher",
    },
  });

  return {
    status: "success",
    message: "User promoted to Publisher successfully",
  };
};
