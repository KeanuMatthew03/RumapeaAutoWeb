"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { addCarAction } from "@/actions/car.actions";
import { carSchema } from "@/validations/car.schema";
import { CarCondition, Transmission, FuelType, CarStatus } from "@prisma/client";

export default function NewCarForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  async function clientSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMap({});
    setGlobalError("");

    const formData = new FormData(e.currentTarget);
    const formVals = Object.fromEntries(formData.entries()) as Record<string, string>;
    
    // Parse angka agar Zod coerce bekerja secara ideal dari client string (FormData)
    const rawData = {
      ...formVals,
      year: Number(formVals.year),
      price: Number(formVals.price),
      mileage: Number(formVals.mileage),
    };

    // Validasi Zod Lokal
    const parsed = carSchema.safeParse(rawData);
    
    if (!parsed.success) {
      // Petakan error Zod agar kita bisa menampilkannya merah di bawah tiap field
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err: any) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrorMap(fieldErrors);
      showToast("Ada kolom yang belum diisi dengan benar. Periksa kembali formulir di bawah.", "warning");
      setIsSubmitting(false);
      return;
    }

    // Jika aman, lempar ke Server Action!
    const res = await addCarAction(parsed.data);
    
    if (res.success) {
      showToast("Mobil berhasil ditambahkan ke etalase! 🎉", "success");
      router.push("/admin/cars");
    } else {
      setGlobalError(res.message);
      showToast(res.message, "error");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      
      {/* HEADER Form */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/admin/cars"
          className="p-2 rounded-full hover:bg-zinc-200 transition-colors text-zinc-600"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Tambahkan Mobil Ke Etalase</h1>
          <p className="text-sm text-zinc-500">Masukkan spesifikasi detail armada yang siap dipasarkan.</p>
        </div>
      </div>

      {globalError && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 font-medium text-sm flex items-start space-x-3">
          <Info size={16} className="mt-0.5 shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* FORM UTAMA */}
      <form onSubmit={clientSubmit} className="space-y-10">
        
        {/* BAGIAN A: Identitas Utama (Grid) */}
        <div className="bg-white p-8 border border-zinc-200 shadow-sm rounded-xl">
          <h2 className="text-base font-semibold text-zinc-900 border-b border-zinc-100 pb-4 mb-6">
            1. Identitas Utama
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldInput 
              name="brand" 
              label="Merek (Brand)" 
              placeholder="Contoh: Toyota" 
              error={errorMap.brand}
            />
            <FieldInput 
              name="model" 
              label="Tipe (Model)" 
              placeholder="Contoh: Innova Zenix Q Hybrid" 
              error={errorMap.model}
            />
            <FieldInput 
              name="year" 
              type="number" 
              label="Tahun Pembuatan" 
              placeholder="2023" 
              error={errorMap.year}
            />
            <FieldInput 
              name="color" 
              label="Warna Eksterior" 
              placeholder="Contoh: Platinum White Pearl" 
              error={errorMap.color}
            />
          </div>
        </div>

        {/* BAGIAN B: Komersial & Teknis */}
        <div className="bg-white p-8 border border-zinc-200 shadow-sm rounded-xl">
          <h2 className="text-base font-semibold text-zinc-900 border-b border-zinc-100 pb-4 mb-6">
            2. Harga & Spesifikasi Inti
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <FieldInput 
              name="price" 
              type="number" 
              label="Harga Jual (Rp)" 
              placeholder="500000000" 
              error={errorMap.price}
              helperText="Ketik murni angka tanpa titik koma"
            />
            <FieldInput 
              name="mileage" 
              type="number" 
              label="Jarak Tempuh (KM)" 
              placeholder="12500" 
              error={errorMap.mileage}
            />

            <div className="space-y-1.5 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">Kondisi</label>
              <select name="condition" className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:outline-zinc-500 bg-white shadow-sm">
                <option value={CarCondition.NEW}>100% Baru / Gress</option>
                <option value={CarCondition.USED}>Tangan Kedua (Bekas)</option>
              </select>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">Transmisi</label>
              <select name="transmission" className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:outline-zinc-500 bg-white shadow-sm">
                <option value={Transmission.AUTOMATIC}>Otomatis (AT/CVT)</option>
                <option value={Transmission.MANUAL}>Manual (MT)</option>
              </select>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">Bahan Bakar</label>
              <select name="fuelType" className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:outline-zinc-500 bg-white shadow-sm">
                <option value={FuelType.GASOLINE}>Bensin (Gasoline)</option>
                <option value={FuelType.DIESEL}>Solar (Diesel)</option>
                <option value={FuelType.HYBRID}>Hybrid (HEV)</option>
                <option value={FuelType.ELECTRIC}>Listrik Penuh (EV)</option>
              </select>
            </div>
            
            <div className="space-y-1.5 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">Status Penjualan</label>
              <select name="status" className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:outline-zinc-500 bg-white shadow-sm">
                <option value={CarStatus.AVAILABLE}>Tersedia / Siap Jual</option>
                <option value={CarStatus.RESERVED}>Telah Dipesan (Reserved)</option>
                <option value={CarStatus.SOLD}>Terjual (Sold Out)</option>
              </select>
            </div>

          </div>
        </div>

        {/* BAGIAN C: Pemasaran & Media Utama */}
        <div className="bg-white p-8 border border-zinc-200 shadow-sm rounded-xl space-y-8">
          
          <div>
            <h2 className="text-base font-semibold text-zinc-900 pb-2">
              3. Brosur Pemasaran
            </h2>
            <p className="text-sm text-zinc-500 mb-6 border-b border-zinc-100 pb-4">
              Informasi tambahan untuk merayu pelanggan di layar public.
            </p>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">Deskripsi Lengkap (Opsional)</label>
              <textarea 
                name="description" 
                rows={4} 
                className="w-full rounded-md border border-zinc-300 p-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-zinc-500 shadow-sm resize-y"
                placeholder="Ceritakan sejarah perawatan, upgrade suspensi, dll..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100">
            <div className="space-y-1.5 flex flex-col">
              <label htmlFor="imageUrl" className="text-sm font-medium text-zinc-700">
                Galeri Foto (Pisahkan URL dengan koma)
              </label>
              <textarea 
                name="imageUrl" 
                id="imageUrl"
                rows={3} 
                className="w-full rounded-md border border-zinc-300 p-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-zinc-500 shadow-sm resize-y"
                placeholder="https://link1.jpg, https://link2.jpg, https://link3.jpg"
              />
              {errorMap.imageUrl && (
                <p className="text-xs text-red-500 pt-1 font-medium tracking-tight">*{errorMap.imageUrl}</p>
              )}
              <p className="text-xs text-zinc-400 pt-1 tracking-tight">
                Tips: Foto pertama akan otomatis menjadi foto utama (Thumbnail).
              </p>
            </div>
          </div>

        </div>

        {/* AKSI TOMBOL */}
        <div className="flex items-center justify-end space-x-4 border-t border-zinc-200 pt-8 mt-8">
          <Link
            href="/admin/cars"
            className="px-5 py-2.5 rounded-md font-medium text-zinc-600 hover:bg-zinc-100 transition-colors text-sm"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-md font-medium text-white transition-all text-sm bg-zinc-900 hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-900/10 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            <span>{isSubmitting ? "Menyimpan ke Server..." : "Publikasikan Mobil"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}

// ----------------------------------------------------
function FieldInput({ name, label, type = "text", placeholder, error, helperText }: { name: string, label: string, type?: string, placeholder?: string, error?: string, helperText?: string }) {
  return (
    <div className="space-y-1.5 flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        step={type === "number" ? "any" : undefined}
        className={`rounded-md border px-3 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none shadow-sm transition-all
          ${error ? "border-red-400 focus:ring-1 focus:ring-red-500" : "border-zinc-300 focus:ring-1 focus:ring-zinc-500"}
        `}
      />
      {error && (
        <p className="text-xs text-red-500 pt-1 font-medium tracking-tight">*{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-zinc-400 pt-1 tracking-tight">{helperText}</p>
      )}
    </div>
  );
}
