import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  // const headers = new Headers(request.headers);
  response.headers.set("x-current-path", request.nextUrl.pathname);
  response.headers.set("x-user-country", request.geo?.country || "Unknown");
  return response;
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};