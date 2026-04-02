import { db } from "@/lib/db";
import Link from "next/link";
import { CarCard } from "@/components/features/cars/CarCard";
import { SearchIcon, SlidersHorizontal } from "lucide-react";
import { Prisma } from "@prisma/client";

export const metadata = {
  title: "Katalog Mobil - Rumapea Auto",
};

export const dynamic = "force-dynamic";

export default async function PublicCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const condition = params.condition || "";
  const transmission = params.transmission || "";
  const sort = params.sort || "newest";

  // Bangun filter Prisma secara dinamis
  const where: Prisma.CarWhereInput = {
    status: "AVAILABLE",
    ...(query && {
      OR: [
        { brand: { contains: query, mode: "insensitive" } },
        { model: { contains: query, mode: "insensitive" } },
        { color: { contains: query, mode: "insensitive" } },
      ],
    }),
    ...(condition && { condition: condition as "NEW" | "USED" }),
    ...(transmission && { transmission: transmission as "AUTOMATIC" | "MANUAL" }),
  };

  const orderBy: Prisma.CarOrderByWithRelationInput =
    sort === "price_asc" ? { price: "asc" } :
    sort === "price_desc" ? { price: "desc" } :
    sort === "year_desc" ? { year: "desc" } :
    { createdAt: "desc" };

  const availableCars = await db.car.findMany({
    where,
    orderBy,
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
  });

  return (
    <div className="space-y-12">
      {/* HEADER KATALOG */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-none mb-3">
            Katalog <span style={{ color: "#1A3A2A" }}>Kendaraan</span>
          </h1>
          <p className="text-base text-gray-500 max-w-xl">
            Tersedia pilihan mobil kualitas tinggi yang telah lulus inspeksi ketat. Temukan yang paling pas untuk kebutuhan mobilitas Anda hari ini.
          </p>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <form method="GET" className="flex flex-col md:flex-row gap-3 bg-white border border-stone-200 p-4 shadow-sm">
        {/* Pencarian */}
        <div className="relative grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
            <SearchIcon size={18} />
          </div>
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Cari merek, model, atau warna..."
            className="w-full bg-stone-50 border border-stone-200 text-stone-900 block pl-10 p-3 text-sm font-medium focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          />
        </div>

        {/* Filter Kondisi */}
        <select
          name="condition"
          defaultValue={condition}
          className="bg-stone-50 border border-stone-200 text-stone-700 p-3 text-sm font-medium focus:ring-amber-500 focus:border-amber-500 outline-none"
        >
          <option value="">Semua Kondisi</option>
          <option value="NEW">Unit Baru</option>
          <option value="USED">Unit Bekas</option>
        </select>

        {/* Filter Transmisi */}
        <select
          name="transmission"
          defaultValue={transmission}
          className="bg-stone-50 border border-stone-200 text-stone-700 p-3 text-sm font-medium focus:ring-amber-500 focus:border-amber-500 outline-none"
        >
          <option value="">Semua Transmisi</option>
          <option value="AUTOMATIC">Otomatis (A/T)</option>
          <option value="MANUAL">Manual (M/T)</option>
        </select>

        {/* Urutkan */}
        <select
          name="sort"
          defaultValue={sort}
          className="bg-stone-50 border border-stone-200 text-stone-700 p-3 text-sm font-medium focus:ring-amber-500 focus:border-amber-500 outline-none"
        >
          <option value="newest">Terbaru</option>
          <option value="price_asc">Harga Terendah</option>
          <option value="price_desc">Harga Tertinggi</option>
          <option value="year_desc">Tahun Terbaru</option>
        </select>

        {/* Tombol Cari */}
        <button
          type="submit"
          className="bg-[#1A3A2A] text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-[#204a36] transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </form>

      {/* Indikator filter aktif */}
      {(query || condition || transmission) && (
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <span className="text-stone-500">Filter aktif:</span>
          {query && (
            <span className="bg-stone-100 text-stone-700 px-3 py-1 font-medium border border-stone-200">&quot;{query}&quot;</span>
          )}
          {condition && (
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 font-medium border border-emerald-200">
              {condition === "NEW" ? "Baru" : "Bekas"}
            </span>
          )}
          {transmission && (
            <span className="bg-blue-50 text-blue-700 px-3 py-1 font-medium border border-blue-200">
              {transmission === "AUTOMATIC" ? "A/T" : "M/T"}
            </span>
          )}
          <Link
            href="/cars"
            className="text-red-500 hover:text-red-700 font-medium underline underline-offset-2 text-xs"
          >
            Hapus semua filter
          </Link>
        </div>
      )}

      {/* GRID MOBIL */}
      {availableCars.length === 0 ? (
        <div className="py-32 text-center border-t border-stone-200 animate-fade-in-up">
          <p className="text-xl font-bold text-gray-300 uppercase tracking-widest">
            {query || condition || transmission ? "Tidak Ditemukan" : "Stok Kosong"}
          </p>
          <p className="text-gray-500 mt-2">
            {query || condition || transmission
              ? "Coba ubah kata kunci atau filter pencarian Anda."
              : "Maaf, kami belum memiliki kendaraan baru di etalase ini."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {availableCars.map((car, idx) => (
            <div
              key={car.id}
              className="animate-fade-in-up opacity-0 relative"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CarCard car={car} />
            </div>
          ))}
        </div>
      )}

      {/* Jumlah hasil */}
      <p className="text-xs text-stone-400 text-center pt-4 border-t border-stone-100">
        Menampilkan {availableCars.length} kendaraan tersedia
      </p>
    </div>
  );
}
