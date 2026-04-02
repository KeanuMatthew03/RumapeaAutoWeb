// src/lib/auth.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Kita pakai login email + password
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // Cari user di database berdasarkan email
        const user = await db.user.findUnique({
          where: { email },
        });

        // Kalau user tidak ditemukan → tolak login
        if (!user || !user.password) return null;

        // Cek apakah password yang diketik cocok dengan yang di database
        // bcrypt dipakai karena password di database disimpan dalam bentuk hash
        // (tidak bisa dibaca langsung — untuk keamanan)
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // Kalau cocok → return data user
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Tambahkan role ke dalam JWT token
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    // Tambahkan role ke dalam session
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role as string;
      return session;
    },
  },

  // Halaman login custom kita
  pages: {
    signIn: "/login",
  },

  // Pakai JWT untuk menyimpan session (tidak perlu tabel session di DB)
  session: { strategy: "jwt" },
});