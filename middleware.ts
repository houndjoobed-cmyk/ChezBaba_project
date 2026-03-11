import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";
import {
  PRIVATE_ROUTES,
  AUTH_ROUTES,
  VERIFY_EMAIL,
} from "@/lib/constants/routes";

const { auth } = NextAuth(authConfig);

export async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  console.log("Middleware : ", pathname);

  // Auth routes should not be accessible to authenticated users
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Protect private routes
  if (PRIVATE_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!session || !session.user) {
      const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url)
      );
    }

    // Email not verified
    if (!session.user.emailVerifie) {
      return NextResponse.redirect(
        new URL(`${VERIFY_EMAIL}?refresh=true`, req.url)
      );
    }

    // Already verified, shouldn't access verify-email page
    if (pathname === VERIFY_EMAIL && session.user.emailVerifie) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Role-based protection
    const role = session.user.role;
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/vendor") && role !== "VENDEUR") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/client") && role !== "CLIENT") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to all routes except :
export const config = {
  matcher: [
    "/((?!api|icons|images|manifest|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|sitemap.xml|robots.txt).*)",
  ],
};
