import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Route protection. Runs on the edge — reads the JWT only (no DB, no bcrypt).
 *
 *  /admin/*   → ADMIN or STAFF
 *  /portal/*  → any signed-in user (CLIENT/STAFF/ADMIN)
 *
 * Row-level ownership (a client only seeing their own company's data) is
 * enforced in the data layer, not here — see lib/auth/guards.ts.
 */
export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const role = session?.user?.role;
  const isLoggedIn = !!session?.user;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isPortalRoute = nextUrl.pathname.startsWith("/portal");

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl),
      );
    }
    if (role !== "ADMIN" && role !== "STAFF") {
      // Signed-in clients get bounced to their portal.
      return NextResponse.redirect(new URL("/portal", nextUrl));
    }
  }

  if (isPortalRoute && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
