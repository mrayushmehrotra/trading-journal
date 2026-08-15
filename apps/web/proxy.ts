import { auth } from "@/lib/auth/server";

export default auth.middleware({
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/trades/:path*",
    "/journal/:path*",
    "/api/trades/:path*",
    "/api/journal/:path*",
  ],
};