import "dotenv/config";
import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

const prisma = db;

async function main() {
  console.log("Sedang menyiapkan akun Admin...");

  // Cek apakah sudah ada admin sebelumnya
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (existingAdmin) {
    console.log("Akun admin sudah ada di database. Lewati.");
    return;
  }

  // Acak password khusus untuk si Admin Utama
  const hashedPassword = await bcrypt.hash("rahasia123", 10);

  // Buat datanya!
  await prisma.user.create({
    data: {
      name: "Bapak Rumapea",
      email: "admin@rumapea.auto",
      password: hashedPassword,
      role: "ADMIN", // Nah ini kuncinya, dia jadi ADMIN, bukan BUYER.
    },
  });

  console.log("✅ Akun Admin berhasil dibuat!");
  console.log("Email    : admin@rumapea.auto");
  console.log("Password : rahasia123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
