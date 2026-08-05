import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!session.user.emailVerified) {
    return NextResponse.redirect(new URL("/verify-request", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/publisher"], // Specify the routes the middleware applies to
};


//implement arcjet here...