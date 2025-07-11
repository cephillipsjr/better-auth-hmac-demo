// next
import { NextRequest, NextResponse } from "next/server";

// third-party
import { getSessionCookie } from "better-auth/cookies";

// ==============================|| MIDDLEWARE ||============================== //

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
