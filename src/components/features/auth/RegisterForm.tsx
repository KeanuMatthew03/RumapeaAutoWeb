"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { registerAction } from "@/actions/auth.actions";

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // Panggil Server Action (Controller) yang sudah kita buat menggunakan OOP Service layernya
      const result = await registerAction({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        setSuccessMsg(result.message);
        // Reset form
        setFormData({ name: "", email: "", password: "" });
        // Kita berikan delay sedikit sebelum pindah halaman, supaya pesan suksesnya terbaca
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
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
      {successMsg && (
        <div className="bg-green-50 text-green-700 p-4 border border-green-200 text-sm font-medium">
          {successMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
          Nama Lengkap
        </label>
        <input
          type="text"
          required
          placeholder="Cth: Budi Handoko"
          className="w-full px-5 py-4 border border-stone-300 bg-white placeholder:text-stone-400 focus:outline-none focus:border-[#1A3A2A] transition-colors"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

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
          Buat Kata Sandi (Password)
        </label>
        <input
          type="password"
          required
          placeholder="Pilih password yang kuat"
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
        {isLoading ? "Mendaftar..." : "Buat Akun Sekarang"}
      </Button>

      <div className="text-center mt-4 text-sm text-gray-500">
        Sudah terdaftar? {" "}
        <Link 
          href="/login" 
          className="font-semibold transition-colors hover:underline"
          style={{ color: "#1A3A2A" }}
        >
          Masuk di sini
        </Link>
      </div>
    </form>
  );
}
