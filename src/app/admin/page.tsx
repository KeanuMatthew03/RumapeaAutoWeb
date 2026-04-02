import { db } from "@/lib/db";
import { Car, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const totalCars = await db.car.count();
  const totalInquiries = await db.inquiry.count();

  const recentInquiries = await db.inquiry.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      car: {
        select: { brand: true, model: true, year: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Overview</h1>
        <p className="text-sm text-zinc-500 mt-1">Status dan aktivitas bengkel Rumapea hari ini.</p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CAR STAT */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-zinc-200 p-6 flex flex-col justify-between group hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500 tracking-tight">Total Mobil Aktif</p>
            <div className="p-2 bg-zinc-50 rounded-md border border-zinc-100 text-zinc-700">
              <Car size={18} strokeWidth={2} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold tracking-tight text-zinc-900">{totalCars}</h3>
            <Link
              href="/admin/cars"
              className="mt-4 flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors w-max"
            >
              Kelola inventaris <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>

        {/* INQUIRY STAT */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-zinc-200 p-6 flex flex-col justify-between group hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-zinc-500 tracking-tight">Pesan / Inquiry Aktif</p>
            <div className="p-2 bg-zinc-50 rounded-md border border-zinc-100 text-zinc-700">
              <Mail size={18} strokeWidth={2} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold tracking-tight text-zinc-900">{totalInquiries}</h3>
            <Link
              href="/admin/inquiries"
              className="mt-4 flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors w-max"
            >
              Lihat pesan masuk <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-zinc-200 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-base font-semibold tracking-tight text-zinc-900">
            Pesan Masuk Terbaru
          </h3>
          <Link href="/admin/inquiries" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            Lihat semua
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center">
             <div className="p-3 bg-zinc-50 rounded-full border border-zinc-100 mb-3 text-zinc-400">
                <Mail size={24} />
             </div>
            <p className="text-sm font-medium text-zinc-900">Belum ada pesan</p>
            <p className="text-xs text-zinc-500 mt-1">Inquiry dari calon pembeli akan muncul di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50/50 text-zinc-500 border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-6 font-medium">Calon Pembeli</th>
                  <th className="py-3 px-6 font-medium">Minat Kendaraan</th>
                  <th className="py-3 px-6 font-medium text-right">Tanggal Masuk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="py-3.5 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-900">{inq.name}</span>
                        <span className="text-zinc-500 text-xs">{inq.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      {inq.car ? (
                        <div className="flex items-center text-zinc-700 font-medium">
                          {inq.car.brand} {inq.car.model} <span className="ml-1.5 text-zinc-400 font-normal">({inq.car.year})</span>
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic bg-zinc-100 px-2 py-0.5 rounded text-xs">Pesan Umum</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right text-zinc-500">
                      {new Date(inq.createdAt).toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
