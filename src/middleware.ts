import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const sessionCookie = request.cookies.get('session_id');
  if (sessionCookie) {
    const cookieAttributes = sessionCookie.toString().split(';');
    const maxAgeStr = cookieAttributes.find(attr => attr.trim().startsWith('max-age='));
    
    if (maxAgeStr) {
      const maxAge = parseInt(maxAgeStr.split('=')[1]);
      if (maxAge > 0) {
        response.cookies.set({
          name: 'session_id',
          value: sessionCookie.value,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'lax',
          path: '/',
          maxAge: maxAge // Use the original maxAge
        });
      }
    }
  }


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