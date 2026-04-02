import type { NextAuthConfig } from "next-auth";

// Konfigurasi "ringan" untuk Middleware agar tetap di bawah limit 1MB Vercel.
// Di sini tidak boleh ada import db (Prisma) atau bcryptjs.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginRoute = nextUrl.pathname.startsWith("/login");
      const isRegisterRoute = nextUrl.pathname.startsWith("/register");

      // Blokir registrasi manual
      if (isRegisterRoute) {
        return Response.redirect(new URL("/", nextUrl));
      }

      // Proteksi Admin
      if (isAdminRoute) {
        if (isLoggedIn && auth.user.role === "ADMIN") return true;
        return false; // Redirect ke login otomatis oleh NextAuth
      }

      // Redirect jika sudah login tapi mau ke /login
      if (isLoginRoute && isLoggedIn) {
        return Response.redirect(new URL(auth.user.role === "ADMIN" ? "/admin" : "/", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // Providers akan diisi di src/lib/auth.ts (Server-side)
} satisfies NextAuthConfig;
