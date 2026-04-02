"use server";

import { AuthService } from "@/services/auth.service";
import { Prisma } from "@prisma/client";

// Karena ini adalah "Server Action", fungsi ini hanya berjalan di server (backend).
// Biasanya dipanggil langsung dari Client Components (tombol Submit pada Form).

/**
 * Controller: registerAction
 * Fungsi ini bertugas sebagai penghubung antara Form tampilan dengan AuthService.
 */
export async function registerAction(data: Prisma.UserCreateInput) {
  try {
    // 1. Panggil class AuthService yang sudah kita buat sebelumnya
    const user = await AuthService.registerUser(data);

    // 2. Jika sukses, kita kembalikan status berhasil (bisa ditangkap oleh fitur Notifikasi)
    // Gunakan trik JSON untuk membuang object kompleks bawaan Prisma yang kadang membuat Next.js Error 500
    return {
      success: true,
      message: "Akun berhasil dibuat! Silakan masuk (login).",
      data: JSON.parse(JSON.stringify(user)),
    };
  } catch (error: any) {
    console.error("Terjadi Error di Server Action:", error);
    // 3. Jika gagal (misal email sudah ada), kita tangkap errornya agar web tidak hancur (crash).
    return {
      success: false,
      message: error.message || "Terjadi kesalahan saat mendaftar.",
    };
  }
}
