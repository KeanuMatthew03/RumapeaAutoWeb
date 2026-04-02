import { z } from "zod";
import { CarCondition, Transmission, FuelType, CarStatus } from "@prisma/client";

// Skema Validasi untuk menambahkan atau mengedit Mobil
export const carSchema = z.object({
  brand: z.string().min(1, "Merek mobil tidak boleh kosong"),
  model: z.string().min(1, "Model mobil tidak boleh kosong"),
  year: z.coerce
    .number({
      message: "Tahun pembuatan wajib diisi dengan deret angka",
    })
    .min(1980, "Tahun mobil terlalu tua (>1980)")
    .max(new Date().getFullYear() + 1, "Tahun mobil belum dirilis"),
  price: z.coerce
    .number({
      message: "Harga wajib diisi dengan format angka murni",
    })
    .min(1000000, "Harga terlalu tidak wajar (< 1 Juta Rupiah)"),
  mileage: z.coerce
    .number({
      message: "Jarak tempuh wajib diisi berbentuk angka",
    })
    .min(0, "Jarak tempuh (KM) tidak boleh negatif"),
  condition: z.nativeEnum(CarCondition, {
    message: "Silakan pilih Kondisi (Baru/Bekas)",
  }),
  transmission: z.nativeEnum(Transmission, {
    message: "Silakan pilih tipe Transmisi",
  }),
  fuelType: z.nativeEnum(FuelType, {
    message: "Silakan pilih bahan bakar",
  }),
  color: z.string().min(1, "Warna tidak boleh kosong"),
  description: z.string().optional(),
  status: z.nativeEnum(CarStatus).default(CarStatus.AVAILABLE),
  // Untuk Multi-foto: Masukkan link gambar dipisah koma (contoh: link1.jpg, link2.jpg)
  imageUrl: z.string().optional(),
});

export type CarInput = z.infer<typeof carSchema>;
