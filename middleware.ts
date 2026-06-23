import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { Role } from "@prisma/client";

const SESSION_COOKIE = "mtt_session";

const CHEF_ROUTES = ["/dashboard", "/events", "/menu-templates"];
const CLIENT_ROUTES = ["/bookings"];

async function getRoleFromRequest(
  request: NextRequest
): Promise<Role | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload.role as Role;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = await getRoleFromRequest(request);

  const isChefRoute = CHEF_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isClientRoute = CLIENT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if ((isChefRoute || isClientRoute) && !role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isChefRoute && role === "CLIENT") {
    return NextResponse.redirect(new URL("/explore", request.url));
  }

  if (isClientRoute && role === "CHEF") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/events/:path*",
    "/menu-templates/:path*",
    "/bookings/:path*",
  ],
};
