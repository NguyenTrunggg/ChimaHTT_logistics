import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Kiểm tra nếu đang truy cập route admin (trừ login)
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    // Kiểm tra cookie hoặc header authentication
    // Tạm thời skip cho demo, trong thực tế cần verify JWT token
    const isAuthenticated = request.cookies.get("admin_session")?.value;

    if (!isAuthenticated) {
      // Redirect đến trang login admin
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
