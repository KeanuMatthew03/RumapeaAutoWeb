import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

/**
 * Service Layer: AuthService
 *
 * Menerapkan prinsip OOP: Semua logika bisnis yang berhubungan dengan Autentikasi
 * dikemas dalam satu Class. Ini membuat kode lebih bersih, mudah dibaca, dan bisa dipakai ulang.
 */
export class AuthService {
  /**
   * Fungsi untuk memverifikasi apakah email sudah terdaftar sebelumnya
   */
  public static async isEmailTaken(email: string): Promise<boolean> {
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    return !!existingUser;
  }

  /**
   * Fungsi untuk mendaftarkan akun baru (Register)
   */
  public static async registerUser(data: Prisma.UserCreateInput) {
    // 1. Cek apakah email sudah ada di database
    const emailTaken = await this.isEmailTaken(data.email);
    if (emailTaken) {
      throw new Error("Email ini sudah terdaftar. Silakan gunakan email lain.");
    }

    // 2. Acak password (Hashing) demi keamanan
    // Kita buat 10 "putaran" acakan agar sulit dibobol
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Simpan data user ke database Prisma
    const newUser = await db.user.create({
      data: {
        ...data,
        password: hashedPassword,
        // Secara otomatis di database Role akan menjadi "BUYER"
      },
    });

    // 4. Kembalikan data user baru (tapi kita buang password-nya agar aman)
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
