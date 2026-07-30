import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/logout
 * Clears all NextAuth session cookies server-side and redirects to /login.
 * This is the most reliable sign-out method — no client-side JS required.
 */
export async function GET(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);

  // Build redirect response
  const response = NextResponse.redirect(loginUrl, { status: 302 });

  // All possible NextAuth cookie names (HTTP dev + HTTPS prod variants)
  const httpCookies = [
    "next-auth.session-token",
    "next-auth.csrf-token",
    "next-auth.callback-url",
  ];

  const secureCookies = [
    "__Secure-next-auth.session-token",
    "__Secure-next-auth.callback-url",
  ];

  const hostCookies = [
    "__Host-next-auth.csrf-token",
  ];

  // Delete HTTP cookies (dev)
  for (const name of httpCookies) {
    response.cookies.set(name, "", {
      maxAge:   0,
      expires:  new Date(0),
      path:     "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }

  // Delete __Secure- cookies (prod HTTPS) — must include secure:true
  for (const name of secureCookies) {
    response.cookies.set(name, "", {
      maxAge:   0,
      expires:  new Date(0),
      path:     "/",
      httpOnly: true,
      sameSite: "lax",
      secure:   true,
    });
  }

  // Delete __Host- cookies — must have secure:true, path:"/", no domain
  for (const name of hostCookies) {
    response.cookies.set(name, "", {
      maxAge:   0,
      expires:  new Date(0),
      path:     "/",
      httpOnly: true,
      sameSite: "lax",
      secure:   true,
    });
  }

  return response;
}
