"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { ArrowLeft, Save, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { updateCarAction } from "@/actions/car.actions";
import { carSchema } from "@/validations/car.schema";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { CarCondition, Transmission, FuelType, CarStatus } from "@prisma/client";

interface EditCarProps {
  car: {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    condition: string;
    transmission: string;
    fuelType: string;
    color: string;
    description: string;
    status: string;
    imageUrl: string;
  };
}

export function EditCarForm({ car }: EditCarProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Inisialisasi state gambar dari data yang sudah ada di DB
  const [imageUrls, setImageUrls] = useState<string[]>(
    car.imageUrl ? car.imageUrl.split(",").map(url => url.trim()).filter(url => url !== "") : []
  );
  
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMap({});
    setGlobalError("");

    const fd = new FormData(e.currentTarget);
    const formVals = Object.fromEntries(fd.entries()) as Record<string, string>;

    const rawData = {
      ...formVals,
      year: Number(formVals.year),
      price: Number(formVals.price),
      mileage: Number(formVals.mileage),
      imageUrl: imageUrls.join(","), // Pakai gambar dari state upload
    };

    const parsed = carSchema.safeParse(rawData);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err: any) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrorMap(fieldErrors);
      showToast("Ada kolom yang belum benar. Periksa formulir.", "warning");
      setIsSubmitting(false);
      return;
    }

    const res = await updateCarAction(car.id, parsed.data);

    if (res.success) {
      showToast("Data mobil berhasil diperbarui! ✅", "success");
      router.push("/admin/cars");
    } else {
      setGlobalError(res.message);
      showToast(res.message, "error");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div className="flex items-center space-x-4">
        <Link href="/admin/cars" className="p-2 rounded-full hover:bg-zinc-200 transition-colors text-zinc-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            Edit: {car.brand} {car.model}
          </h1>
          <p className="text-sm text-zinc-500">Perbarui spesifikasi dan data penjualan mobil ini.</p>
        </div>
      </div>

      {globalError && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 font-medium text-sm flex items-start space-x-3">
          <Info size={16} className="mt-0.5 shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Identitas */}
        <div className="bg-white p-8 border border-zinc-200 shadow-sm rounded-xl">
          <h2 className="text-base font-semibold text-zinc-900 border-b border-zinc-100 pb-4 mb-6">1. Identitas Utama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldInput name="brand" label="Merek (Brand)" defaultValue={car.brand} error={errorMap.brand} />
            <FieldInput name="model" label="Tipe (Model)" defaultValue={car.model} error={errorMap.model} />
            <FieldInput name="year" type="number" label="Tahun Pembuatan" defaultValue={String(car.year)} error={errorMap.year} />
            <FieldInput name="color" label="Warna" defaultValue={car.color} error={errorMap.color} />
          </div>
        </div>

        {/* Harga & Spesifikasi */}
        <div className="bg-white p-8 border border-zinc-200 shadow-sm rounded-xl">
          <h2 className="text-base font-semibold text-zinc-900 border-b border-zinc-100 pb-4 mb-6">2. Harga & Spesifikasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FieldInput name="price" type="number" label="Harga Jual (Rp)" defaultValue={String(car.price)} error={errorMap.price} />
            <FieldInput name="mileage" type="number" label="Jarak Tempuh (KM)" defaultValue={String(car.mileage)} error={errorMap.mileage} />

            <div className="space-y-1.5 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">Kondisi</label>
              <select name="condition" defaultValue={car.condition} className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:outline-zinc-500 bg-white shadow-sm">
                <option value={CarCondition.NEW}>Baru</option>
                <option value={CarCondition.USED}>Bekas</option>
              </select>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">Transmisi</label>
              <select name="transmission" defaultValue={car.transmission} className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:outline-zinc-500 bg-white shadow-sm">
                <option value={Transmission.AUTOMATIC}>Otomatis (AT)</option>
                <option value={Transmission.MANUAL}>Manual (MT)</option>
              </select>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">Bahan Bakar</label>
              <select name="fuelType" defaultValue={car.fuelType} className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:outline-zinc-500 bg-white shadow-sm">
                <option value={FuelType.GASOLINE}>Bensin</option>
                <option value={FuelType.DIESEL}>Diesel</option>
                <option value={FuelType.HYBRID}>Hybrid</option>
                <option value={FuelType.ELECTRIC}>Listrik</option>
              </select>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">Status Penjualan</label>
              <select name="status" defaultValue={car.status} className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:outline-zinc-500 bg-white shadow-sm">
                <option value={CarStatus.AVAILABLE}>Tersedia</option>
                <option value={CarStatus.RESERVED}>Dipesan</option>
                <option value={CarStatus.SOLD}>Terjual</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deskripsi & Foto */}
        <div className="bg-white p-8 border border-zinc-200 shadow-sm rounded-xl space-y-6">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 pb-2">3. Deskripsi & Foto</h2>
            <textarea 
              name="description" 
              rows={4} 
              defaultValue={car.description}
              className="w-full rounded-md border border-zinc-300 p-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-zinc-500 shadow-sm resize-y mt-4"
              placeholder="Deskripsi lengkap mobil..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700 mb-4 inline-block">Galeri Foto Mobil</label>
            
            <ImageUpload 
              value={imageUrls}
              onChange={(urls: string[]) => setImageUrls(urls)}
              onRemove={(url: string) => setImageUrls(imageUrls.filter(u => u !== url))}
            />

            {errorMap.imageUrl && <p className="text-xs text-red-500 pt-1 font-medium">*{errorMap.imageUrl}</p>}
          </div>
        </div>

        {/* Tombol */}
        <div className="flex items-center justify-end space-x-4 border-t border-zinc-200 pt-8 mt-8">
          <Link href="/admin/cars" className="px-5 py-2.5 rounded-md font-medium text-zinc-600 hover:bg-zinc-100 transition-colors text-sm">Batal</Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-md font-medium text-white transition-all text-sm bg-zinc-900 hover:bg-zinc-800 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldInput({ name, label, type = "text", defaultValue, placeholder, error }: { name: string; label: string; type?: string; defaultValue?: string; placeholder?: string; error?: string }) {
  return (
    <div className="space-y-1.5 flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-zinc-700">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        step={type === "number" ? "any" : undefined}
        className={`rounded-md border px-3 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none shadow-sm transition-all ${error ? "border-red-400 focus:ring-1 focus:ring-red-500" : "border-zinc-300 focus:ring-1 focus:ring-zinc-500"}`}
      />
      {error && <p className="text-xs text-red-500 pt-1 font-medium">*{error}</p>}
    </div>
  );
}
