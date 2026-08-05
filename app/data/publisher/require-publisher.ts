import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requirePublisher() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
     redirect("/login");
  }

  if (session.user.role !== "Publisher") {
     redirect("/not-publisher");

    //make a page that says "you are not an publisher" and a button to become an publisher, add logic to change the role to publisher for a specific user.
  }

  return session;
}
