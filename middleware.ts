import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { rateLimiter } from "./lib/redis/rate-limit";

const isProtectedRoute = createRouteMatcher([
  "/home",
  "/my-files",
  "/starred",
  "/trash",
]);
const isAuthRoute = createRouteMatcher(["/sign-in", "/sign-up"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Get IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown-ip";

  // Apply Rate Limiting
  const { success } = await rateLimiter.limit(ip);
  if (!success) {
    return NextResponse.redirect(new URL("/rate-limit-exceeded", request.url));
  }

  // Redirect logged-in users away from auth routes
  if (userId && isAuthRoute(request)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Redirect unauthenticated users from protected routes
  if (!userId && isProtectedRoute(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
