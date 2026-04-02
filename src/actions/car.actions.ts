"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { carSchema, CarInput } from "@/validations/car.schema";

// Helper internal: Cek keamanan berlapis (Validasi Administrator)
async function verifyAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("⛔ Akses ditolak! Hanya Administrator yang dapat mengubah inventaris.");
  }
}

// ----------------------------------------------------------------------------
// 1. Fungsi Tambah Mobil (Create)
// ----------------------------------------------------------------------------
export async function addCarAction(formData: CarInput) {
  try {
    // 1. Pastikan yang menambahkan adalah Admin
    await verifyAdmin();

    // 2. Validasi inputan menggunakan Zod 
    //    (Untuk memastikan tidak ada data aneh seperti huruf di kolom Harga)
    const validData = carSchema.parse(formData);

    // 3. Masukkan ke Database Prisma
    await db.car.create({
      data: {
        brand: validData.brand,
        model: validData.model,
        year: validData.year,
        price: validData.price,
        mileage: validData.mileage,
        condition: validData.condition,
        transmission: validData.transmission,
        fuelType: validData.fuelType,
        color: validData.color,
        description: validData.description,
        status: validData.status,
        
        // Buatkan tautan Gambar di tabel CarImage
        // Mendukung banyak URL yang dipisahkan koma (dengan filter link kosong)
        images: validData.imageUrl
          ? {
              create: validData.imageUrl
                .split(",")
                .map((url) => url.trim())
                .filter((url) => url !== "") // Pastikan tidak menyimpan link kosong
                .map((url, index) => ({
                  url,
                  isPrimary: index === 0,
                })),
            }
          : undefined,
      },
    });

    // 4. Perbarui antarmuka (UI) tanpa perlu refresh browser
    revalidatePath("/admin/cars");
    revalidatePath("/"); // Update juga di layar depan

    return { 
      success: true, 
      message: "Berhasil! Produk Mobil baru telah masuk ke Etalase." 
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Kesalahan Sistem Add Car:", error.message);
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Terjadi kesalahan internal. Silakan periksa kembali input Anda.",
    };
  }
}

// ----------------------------------------------------------------------------
// 2. Fungsi Hapus Mobil (Delete)
// ----------------------------------------------------------------------------
export async function deleteCarAction(carId: string) {
  try {
    await verifyAdmin();
    await db.car.delete({
      where: { id: carId },
    });
    
    revalidatePath("/admin/cars");
    revalidatePath("/");
    
    return { success: true, message: "Mobil berhasil dilenyapkan dari database." };
  } catch {
    return {
      success: false,
      message: "Gagal menghapus mobil, data mungkin terkunci atau tidak ditemukan.",
    };
  }
}

// ----------------------------------------------------------------------------
// 3. Fungsi Ubah Status (Tersedia -> Terjual)
// ----------------------------------------------------------------------------
export async function updateCarStatusAction(carId: string, newStatus: string) {
  try {
    await verifyAdmin();
    
    await db.car.update({
      where: { id: carId },
      data: { status: newStatus as "AVAILABLE" | "RESERVED" | "SOLD" },
    });
    
    revalidatePath("/admin/cars");
    revalidatePath("/cars");
    revalidatePath("/admin/analytics");
    revalidatePath("/");
    
    return { success: true, message: "Status penjualan berhasil diubah!" };
  } catch {
    return { success: false, message: "Gagal mengubah status mobil." };
  }
}

// ----------------------------------------------------------------------------
// 4. Fungsi Edit Mobil (Update)
// ----------------------------------------------------------------------------
export async function updateCarAction(carId: string, formData: CarInput) {
  try {
    await verifyAdmin();
    const validData = carSchema.parse(formData);

    await db.car.update({
      where: { id: carId },
      data: {
        brand: validData.brand,
        model: validData.model,
        year: validData.year,
        price: validData.price,
        mileage: validData.mileage,
        condition: validData.condition,
        transmission: validData.transmission,
        fuelType: validData.fuelType,
        color: validData.color,
        description: validData.description,
        status: validData.status,
      },
    });

    // Jika ada URL gambar baru, update galeri foto
    if (validData.imageUrl) {
      // Hapus semua foto lama, ganti dengan yang baru
      await db.carImage.deleteMany({ where: { carId } });
      
      const imageUrls = validData.imageUrl
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== "");

      await db.carImage.createMany({
        data: imageUrls.map((url, index) => ({
          url,
          isPrimary: index === 0,
          carId: carId,
        })),
      });
    }

    revalidatePath("/admin/cars");
    revalidatePath("/cars");
    revalidatePath(`/cars/${carId}`);
    revalidatePath("/admin/analytics");
    revalidatePath("/");

    return { success: true, message: "Data mobil berhasil diperbarui!" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Gagal memperbarui data mobil." };
  }
}

// ----------------------------------------------------------------------------
// 5. Fungsi Ambil Detail Mobil (untuk form Edit)
// ----------------------------------------------------------------------------
export async function getCarByIdAction(carId: string) {
  const car = await db.car.findUnique({
    where: { id: carId },
    include: { images: { orderBy: { isPrimary: "desc" } } },
  });
  return car;
}
