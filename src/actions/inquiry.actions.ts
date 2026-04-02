"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Helper internal: Cek keamanan berlapis (Validasi Administrator)
async function verifyAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("⛔ Akses ditolak! Anda bukan Administrator.");
  }
}

// ----------------------------------------------------
// 1. Tandai Pesan sebagai "Sudah Dibaca"
// ----------------------------------------------------
export async function markAsReadAction(inquiryId: string) {
  try {
    await verifyAdmin();
    
    await db.inquiry.update({
      where: { id: inquiryId },
      data: { isRead: true },
    });
    
    // Perbarui seluruh layout admin agar badge notifikasi sinkron
    revalidatePath("/", "layout");
    revalidatePath("/admin/inquiries");
    
    return { success: true, message: "Pesan berhasil ditandai sebagai 'Terbaca'." };
  } catch {
    return { success: false, message: "Kesalahan server saat menandai pesan." };
  }
}

// ----------------------------------------------------
// 2. Hapus Pesan Permanen (Delete)
// ----------------------------------------------------
export async function deleteInquiryAction(inquiryId: string) {
  try {
    await verifyAdmin();
    
    await db.inquiry.delete({
      where: { id: inquiryId },
    });
    
    // Perbarui seluruh sistem agar UI sinkron
    revalidatePath("/", "layout");
    revalidatePath("/admin/inquiries");
    
    return { success: true, message: "Pesan dihapus dari riwayat." };
  } catch {
    return { success: false, message: "Pesan gagal dihapus. Kemungkinan sudah tidak ada." };
  }
}

// ----------------------------------------------------
// 3. (PUBLIK) Tangkap Pesan dari Pembeli Tanpa Login
// ----------------------------------------------------
export async function submitInquiryAction(formData: { name: string, email: string, phone: string, message: string, carId: string }) {
  try {
    // Note: Tidak memakai verifyAdmin() karena ini diakses oleh tamu website (pembeli anonim)
    await db.inquiry.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        carId: formData.carId,
        isRead: false,
      }
    });

    // Peringatkan Panel Dasbor Admin kalo ada pesan baru!
    revalidatePath("/admin/inquiries");
    revalidatePath("/", "layout");

    return { success: true, message: "Pesan sukses terkirim ke Pemilik Showroom!" };
  } catch(error) {
    return { success: false, message: "Waduh, koneksi pengiriman pesan gagal." };
  }
}
