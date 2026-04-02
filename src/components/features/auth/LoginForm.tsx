"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Panggil fungsi signIn bawaan NextAuth
      // Kita matikan redirect otomatis agar bisa dikontrol secara manual lewat router
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError("Email atau password Salah.");
      } else {
        // Jika berhasil, arahkan ke halaman utama Dashboard (Admin Route)
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 border border-red-200 text-sm font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
          Alamat Email
        </label>
        <input
          type="email"
          required
          placeholder="budi@contoh.com"
          className="w-full px-5 py-4 border border-stone-300 bg-white placeholder:text-stone-400 focus:outline-none focus:border-[#1A3A2A] transition-colors"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
          Kata Sandi (Password)
        </label>
        <input
          type="password"
          required
          placeholder="Masukkan passsword Anda"
          className="w-full px-5 py-4 border border-stone-300 bg-white placeholder:text-stone-400 focus:outline-none focus:border-[#1A3A2A] transition-colors"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="text-white text-base font-bold py-6 rounded-none transition-all duration-300 w-full disabled:opacity-50 hover:opacity-90 mt-2"
        style={{ backgroundColor: "#1A3A2A" }}
      >
        {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
      </Button>

      <div className="text-center mt-4 text-xs text-gray-400 leading-relaxed">
        <p>Halaman ini khusus untuk Admin & Owner.</p>
        <p>Jika Anda pembeli, silakan kembali ke{" "}
          <Link 
            href="/" 
            className="font-semibold transition-colors hover:underline"
            style={{ color: "#C8961A" }}
          >
            Beranda Katalog
          </Link>
        </p>
      </div>
    </form>
  );
}
