const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  const email = "admin@rumapea.auto";
  const password = "rahasia123";
  const name = "Official Admin";

  console.log("⏳ Sedang menyiapkan akun admin untuk database online...");

  try {
    // 1. Cek apakah user sudah ada
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log("✅ Akun admin sudah ada di database!");
      return;
    }

    // 2. Hash password secara manual (BCrypt)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Masukkan ke Database
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("🎉 BERHASIL! Akun Administrator telah dibuat.");
    console.log("-----------------------------------------");
    console.log("Email: " + email);
    console.log("Password: " + password);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat membuat admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
