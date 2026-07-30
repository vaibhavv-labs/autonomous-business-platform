// Protect all pages except /login, /api/auth/*, and static files
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
