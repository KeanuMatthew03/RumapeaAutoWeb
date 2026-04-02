import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Edit } from "lucide-react";
import { deleteCarAction } from "@/actions/car.actions";

export const metadata = {
  title: "Kelola Mobil - Admin",
};

export default async function AdminCarsPage() {
  const cars = await db.car.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      _count: {
        select: { inquiries: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* HEADER TIPE INDUSTRIAL */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Inventaris Mobil
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Kelola stok mobil, harga, serta status ketersediaan showroom Anda.
          </p>
        </div>
        <Link
          href="/admin/cars/new"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-zinc-900 rounded-md hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
        >
          <Plus size={16} strokeWidth={2.5} className="mr-2" />
          Tambah Stok Baru
        </Link>
      </div>

      {/* DAFTAR MOBIL */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50/50 text-zinc-500 border-b border-zinc-200">
              <tr>
                <th className="py-3 px-6 font-medium">Kendaraan (Merek/Model)</th>
                <th className="py-3 px-6 font-medium">Harga & Tahun</th>
                <th className="py-3 px-6 font-medium">Status</th>
                <th className="py-3 px-6 font-medium text-center">Inquiry</th>
                <th className="py-3 px-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {cars.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="p-10 text-center flex flex-col items-center justify-center">
                      <p className="text-sm font-medium text-zinc-900">
                        Garasi Masih Kosong
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Ayo mulai dengan menambahkan inventaris mobil pertama Anda.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr
                    key={car.id}
                    className="hover:bg-zinc-50/50 transition-colors group"
                  >
                    {/* MOBIL & TAHUN */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
                          {car.images[0]?.url ? (
                            <Image
                              src={car.images[0].url}
                              alt={car.brand}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <CarFrontIconFallback />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-900 text-base">
                            {car.brand}{" "}
                            <span className="font-normal text-zinc-500">
                              {car.model}
                            </span>
                          </span>
                          <span className="text-zinc-500 text-xs mt-0.5">
                            {car.condition} • {car.transmission} •{" "}
                            {car.mileage.toLocaleString()} KM
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* HARGA */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-900">
                          Rp {car.price.toLocaleString("id-ID")}
                        </span>
                        <span className="text-zinc-500 text-xs">
                          Tahun {car.year}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-6">
                      <BadgeStatus status={car.status} />
                    </td>

                    {/* STATISTIK PEMINAT */}
                    <td className="py-4 px-6 text-center text-zinc-500 font-medium tracking-tight">
                      {car._count.inquiries} Pesan
                    </td>

                    {/* TOMBOL AKSI */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        {/* EDIT */}
                        <Link
                          href={`/admin/cars/${car.id}/edit`}
                          className="text-zinc-400 hover:text-blue-600 transition-colors"
                          title="Edit Data Mobil"
                        >
                          <Edit size={16} strokeWidth={2} />
                        </Link>
                        
                        {/* DELETE VIA BIND ACTION */}
                        <form
                          action={async () => {
                            "use server";
                            await deleteCarAction(car.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-zinc-400 hover:text-red-600 transition-colors"
                            title="Hapus Mobil Secara Permanen"
                          >
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Komponen UI Pembantu Internal
// ----------------------------------------------------
function CarFrontIconFallback() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-zinc-400"
    >
      <path d="m14.5 10-1.83-5.5A2 2 0 0 0 10.77 3H7.23a2 2 0 0 0-1.9 1.5L3.5 10" />
      <path d="M21 16v-2a4 4 0 0 0-4-4H3a4 4 0 0 0-4 4v2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="15" cy="18" r="2" />
      <path d="M11 10h4" />
    </svg>
  );
}

function BadgeStatus({ status }: { status: string }) {
  if (status === "SOLD") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-red-200 bg-red-50 text-red-700">
        Terjual
      </span>
    );
  }
  if (status === "RESERVED") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-amber-200 bg-amber-50 text-amber-700">
        Dipesan
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-emerald-200 bg-emerald-50 text-emerald-700">
      Tersedia
    </span>
  );
}
