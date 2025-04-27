import { getAuth } from "firebase/auth";
import { NextResponse } from "next/server";
import { auth } from "@/firebase/config";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const user = auth.currentUser;

    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/*"],
};
