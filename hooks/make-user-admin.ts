"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const makeUserAdmin = async (email: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (session.user.role === "admin") {
    return redirect("/admin");
  }

  if (email !== session.user.email) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      role: "admin",
    },
  });

  return redirect("/admin");
};
