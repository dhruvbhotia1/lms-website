import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
     redirect("/login");
  }

  if (session.user.role !== "admin") {
     redirect("/not-admin");

    //make a page that says "you are not an admin" and a button to become an admin, add logic to change the role to admin for a specific user.
  }

  return session;
}
