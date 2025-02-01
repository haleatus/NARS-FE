import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("accessToken");
  const adminAuthToken = req.cookies.get("adminAccessToken");
  const ambulanceAuthToken = req.cookies.get("ambulanceAccessToken");

  const protectedUserRoutes = ["/profile", "/my-requests"];
  const protectedAmbulanceRoutes = ["/driver", "/ambulance-profile"];
  const protectedAdminRoutes = ["/dashboard"];
  const currentPath = req.nextUrl.pathname;

  const isProtectedUserRoute = protectedUserRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  const isProtectedAdminRoute = protectedAdminRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  const isProtectedAmbulanceRoute = protectedAmbulanceRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  // Handle user routes
  if (isProtectedUserRoute && !authToken) {
    const redirectUrl = new URL("/signin", req.url);
    redirectUrl.searchParams.set("message", "unauthorized");
    return NextResponse.redirect(redirectUrl);
  }

  // Handle admin routes
  if (isProtectedAdminRoute && !adminAuthToken) {
    return NextResponse.redirect(new URL("/admin-signin", req.url));
  }

  // Handle ambulance routes
  if (isProtectedAmbulanceRoute && !ambulanceAuthToken) {
    const redirectUrl = new URL("/ambulance-signin", req.url);
    redirectUrl.searchParams.set("message", "unauthorized");
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from signin pages
  if (authToken && currentPath.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (adminAuthToken && currentPath.startsWith("/admin-signin")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (ambulanceAuthToken && currentPath.startsWith("/ambulance-signin")) {
    return NextResponse.redirect(new URL("/driver", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/driver/:path*",
    "/ambulance/:path*",
    "/profile/:path*",
    "/signin",
    "/admin-signin",
    "/ambulance-signin",
    "/dashboard/:path*",
  ],
};
