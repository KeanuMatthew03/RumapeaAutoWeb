import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, GaugeIcon, FuelIcon } from "lucide-react";
import { Car, CarImage } from "@prisma/client";

// Tipe data spesifik yang digabungkan karena prisma include
type CarWithRelations = Car & {
  images?: CarImage[];
};

export function CarCard({ car }: { car: CarWithRelations }) {
  // Ambil gambar utama, atau placeholder jika kosong
  // Mencari obj yang isPrimary === true, fallback ke index 0
  const mainImage = car.images?.find((img) => img.isPrimary)?.url || car.images?.[0]?.url;

  return (
    <div className="group flex flex-col bg-white border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* FRAME FOTO UTAMA */}
      <Link href={`/cars/${car.id}`} className="block relative aspect-video overflow-hidden bg-stone-100 group">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={`${car.brand} ${car.model}`}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col font-medium tracking-widest text-stone-400 items-center justify-center bg-stone-100 uppercase text-xs">
            <span>RUMAPEA</span>
            <span style={{ color: "#C8961A" }}>No Image</span>
          </div>
        )}
        
        {/* Label Kondisi */}
        <div className="absolute top-3 right-3">
          <span 
            className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm"
            style={{ backgroundColor: car.condition === "NEW" ? "#1A3A2A" : "#8A7D6A" }}
          >
            {car.condition === "NEW" ? "Baru" : "Bekas"}
          </span>
        </div>
      </Link>

      {/* DETAIL KONTEN BAWAH */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Judul & Harga */}
        <div className="mb-4">
          <Link href={`/cars/${car.id}`}>
            <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1">
              {car.brand} <span className="font-normal">{car.model}</span>
            </h3>
          </Link>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold" style={{ color: "#C8961A" }}>
              Rp {car.price.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Ringkasan Spesifikasi (Icon Row) */}
        <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-stone-100">
          <div className="flex flex-col items-center justify-center p-2 rounded bg-stone-50 text-stone-600">
            <CalendarIcon size={16} className="mb-1 text-stone-400" />
            <span className="text-xs font-semibold">{car.year}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded bg-stone-50 text-stone-600">
            <GaugeIcon size={16} className="mb-1 text-stone-400" />
            <span className="text-xs font-semibold">{car.transmission === "AUTOMATIC" ? "A/T" : "M/T"}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded bg-stone-50 text-stone-600">
            <FuelIcon size={16} className="mb-1 text-stone-400" />
            <span className="text-xs font-semibold">{car.fuelType === "GASOLINE" ? "Bensin" : "Diesel"}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
