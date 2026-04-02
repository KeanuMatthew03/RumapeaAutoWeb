import { RegisterForm } from "@/components/features/auth/RegisterForm";
import Link from "next/link";

export const metadata = {
  title: "Daftar Akun - Rumapea Auto",
};

export default function RegisterPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="max-w-md w-full">
        {/* LOGO */}
        <div className="text-center mb-10">
          <Link href="/">
            <span className="text-2xl font-bold tracking-widest uppercase text-gray-900 inline-block hover:opacity-80 transition-opacity">
              Rumapea <span style={{ color: "#1A3A2A" }}>Auto</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500 mt-3 font-medium tracking-wide uppercase">
            Gabung bersama kami
          </p>
        </div>

        {/* FORM CONTAINER */}
        <div
          className="p-10 border border-stone-200 shadow-sm"
          style={{ backgroundColor: "#FAF7F0" }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buat Akun Baru
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Daftar sekarang untuk segera dapat mengelola koleksi mobil Anda.
          </p>

          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
