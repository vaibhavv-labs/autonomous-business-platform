import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/logout
 *
 * Server-side logout that directly clears all NextAuth session cookies
 * and redirects to /login. This bypasses next-auth/react's signOut()
 * wrapper entirely — works reliably across all Next.js + React versions.
 */
export async function GET(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  const response = NextResponse.redirect(loginUrl);

  // NextAuth JWT session cookies (HTTP + HTTPS variants)
  const cookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
  ];

  const past = new Date(0);

  for (const name of cookieNames) {
    // Expire via Set-Cookie header — works on both HTTP (dev) and HTTPS (prod)
    response.cookies.set(name, "", {
      expires: past,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }

  return response;
}
