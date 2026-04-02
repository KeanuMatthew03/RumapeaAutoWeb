import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const { nextUrl } = req;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = nextUrl.pathname.startsWith("/login");
  const isRegisterRoute = nextUrl.pathname.startsWith("/register");

  // 1. Blokir halaman registrasi — fitur ini sudah dinonaktifkan, redirect ke beranda
  if (isRegisterRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 2. Jika sudah login dan mengakses /login, langsung arahkan sesuai role
  if (isLoginRoute && isLoggedIn) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
    // BUYER yang iseng ke /login, tendang ke beranda
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 3. Proteksi halaman /admin — hanya ADMIN yang diperbolehkan
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

// Jalankan middleware ini untuk SEMUA route, KECUALI aset statis dan rute API.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
