import { db } from "@/lib/db";
import { 
  TrendingUp, 
  DollarSign, 
  Car, 
  ShoppingBag, 
  Clock, 
  MailCheck,
  MailX,
  Package,
  Gauge, 
  Fuel
} from "lucide-react";
import { ExportButton } from "@/components/features/analytics/ExportButton";

export const metadata = {
  title: "Analisis Bisnis - Admin Rumapea Auto",
};

// PENTING: Paksa Next.js untuk SELALU mengambil data segar dari database
// tanpa cache, agar analisis selalu real-time & akurat
export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  // =============================================
  // QUERY DATABASE: Ambil semua data yang dibutuhkan
  // =============================================
  const [allCars, allInquiries] = await Promise.all([
    db.car.findMany({ orderBy: { createdAt: "desc" } }),
    db.inquiry.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  // Siapkan data ringkas untuk Export
  const brandStats: Record<string, number> = {};
  allCars.forEach(c => { brandStats[c.brand] = (brandStats[c.brand] || 0) + 1; });
  const exportData = {
    totalCars: allCars.length,
    soldCars: allCars.filter(c => c.status === "SOLD").length,
    totalRevenue: allCars.filter(c => c.status === "SOLD").reduce((sum, c) => sum + c.price, 0),
    totalInquiries: allInquiries.length,
    brands: Object.entries(brandStats).sort(([, a], [, b]) => b - a).slice(0, 10) as [string, number][],
  };

  // ==================
  // KALKULASI STATISTIK
  // ==================

  // 1. Inventaris
  const totalCars = allCars.length;
  const soldCars = allCars.filter((c) => c.status === "SOLD");
  const availableCars = allCars.filter((c) => c.status === "AVAILABLE");
  const reservedCars = allCars.filter((c) => c.status === "RESERVED");

  // 2. Keuangan
  const totalRevenue = soldCars.reduce((sum, c) => sum + c.price, 0);
  const avgPrice = totalCars > 0 ? Math.round(allCars.reduce((s, c) => s + c.price, 0) / totalCars) : 0;
  const highestPrice = totalCars > 0 ? Math.max(...allCars.map((c) => c.price)) : 0;
  const potentialRevenue = availableCars.reduce((sum, c) => sum + c.price, 0);

  // 3. Inquiry / Minat Pelanggan
  const totalInquiries = allInquiries.length;
  const unreadInquiries = allInquiries.filter((i) => !i.isRead).length;
  const readInquiries = totalInquiries - unreadInquiries;
  const responseRate = totalInquiries > 0 ? Math.round((readInquiries / totalInquiries) * 100) : 0;

  // 4. Breakdown Merek (Top 5)
  const brandCount: Record<string, number> = {};
  allCars.forEach((c) => {
    brandCount[c.brand] = (brandCount[c.brand] || 0) + 1;
  });
  const topBrands = Object.entries(brandCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const maxBrandCount = topBrands.length > 0 ? topBrands[0][1] : 1;

  // 5. Breakdown Kondisi
  const newCars = allCars.filter((c) => c.condition === "NEW").length;
  const usedCars = allCars.filter((c) => c.condition === "USED").length;

  // 6. Breakdown Transmisi
  const automaticCars = allCars.filter((c) => c.transmission === "AUTOMATIC").length;
  const manualCars = allCars.filter((c) => c.transmission === "MANUAL").length;

  // 7. Breakdown Bahan Bakar
  const fuelBreakdown: Record<string, number> = {};
  allCars.forEach((c) => {
    const label = c.fuelType === "GASOLINE" ? "Bensin" : c.fuelType === "DIESEL" ? "Diesel" : c.fuelType === "HYBRID" ? "Hybrid" : "Listrik";
    fuelBreakdown[label] = (fuelBreakdown[label] || 0) + 1;
  });

  // 8. Penjualan vs Ketersediaan (Rasio Konversi Inventaris)
  const sellThroughRate = totalCars > 0 ? Math.round((soldCars.length / totalCars) * 100) : 0;

  // =============================================
  // FORMATTER RUPIAH
  // =============================================
  const formatRp = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
            Analisis Bisnis
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Ringkasan performa showroom Anda secara real-time dari data inventaris & inquiry pelanggan.
          </p>
        </div>
        <ExportButton data={exportData} />
      </div>

      {/* ==========================================
          BARIS 1: KARTU UTAMA (4 Kolom)
       ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Pendapatan */}
        <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Pendapatan</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <DollarSign size={20} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-zinc-900">{formatRp(totalRevenue)}</p>
          <p className="text-xs text-zinc-500 mt-1">Dari {soldCars.length} unit terjual</p>
        </div>

        {/* Potensi Pendapatan */}
        <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Potensi Revenue</span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <TrendingUp size={20} className="text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-zinc-900">{formatRp(potentialRevenue)}</p>
          <p className="text-xs text-zinc-500 mt-1">Dari {availableCars.length} unit tersedia</p>
        </div>

        {/* Total Stok */}
        <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total Inventaris</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Car size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-zinc-900">{totalCars} Unit</p>
          <p className="text-xs text-zinc-500 mt-1">Harga rata-rata: {formatRp(avgPrice)}</p>
        </div>

        {/* Total Inquiry */}
        <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Pesan Masuk</span>
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
              <MailCheck size={20} className="text-violet-600" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-zinc-900">{totalInquiries}</p>
          <p className="text-xs text-zinc-500 mt-1">{unreadInquiries} belum dibaca</p>
        </div>
      </div>

      {/* ==========================================
          BARIS 2: GRAFIK & DETAIL (2 Kolom)
       ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART: Top Merek Populer */}
        <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
          <h2 className="text-base font-bold text-zinc-900 mb-6 flex items-center">
            <Package size={18} className="mr-2 text-zinc-400" />
            Distribusi Merek (Top 5)
          </h2>
          {topBrands.length === 0 ? (
            <p className="text-sm text-zinc-400">Belum ada data inventaris.</p>
          ) : (
            <div className="space-y-4">
              {topBrands.map(([brand, count]) => (
                <div key={brand}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-zinc-700">{brand}</span>
                    <span className="text-zinc-500">{count} unit</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${(count / maxBrandCount) * 100}%`,
                        backgroundColor: "#1A3A2A"
                      }}
                    />
                  </div> 
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STATUS INVENTARIS (Donut-style breakdown) */}
        <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
          <h2 className="text-base font-bold text-zinc-900 mb-6 flex items-center">
            <ShoppingBag size={18} className="mr-2 text-zinc-400" />
            Status Penjualan
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-3xl font-extrabold text-emerald-700">{availableCars.length}</p>
              <p className="text-xs font-semibold text-emerald-600 mt-1">Tersedia</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-3xl font-extrabold text-amber-700">{reservedCars.length}</p>
              <p className="text-xs font-semibold text-amber-600 mt-1">Dipesan</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-3xl font-extrabold text-red-700">{soldCars.length}</p>
              <p className="text-xs font-semibold text-red-600 mt-1">Terjual</p>
            </div>
          </div>

          {/* PROGRESS BAR: Sell-Through Rate */}
          <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Rasio Penjualan</span>
              <span className="text-lg font-extrabold text-zinc-900">{sellThroughRate}%</span>
            </div>
            <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${sellThroughRate}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              {soldCars.length} dari {totalCars} unit telah terjual
            </p>
          </div>
        </div>
      </div>

      {/* ==========================================
          BARIS 3: DETAIL BREAKDOWN (3 Kolom)
       ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Kondisi */}
        <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center">
            <Clock size={16} className="mr-2 text-zinc-400" />
            Kondisi Unit
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Unit Baru</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">{newCars}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Unit Bekas</span>
              <span className="px-3 py-1 bg-zinc-100 text-zinc-700 text-xs font-bold rounded-full">{usedCars}</span>
            </div>
          </div>
        </div>

        {/* Transmisi */}
        <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center">
            <Gauge size={16} className="mr-2 text-zinc-400" />
            Tipe Transmisi
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Otomatis (A/T)</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">{automaticCars}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Manual (M/T)</span>
              <span className="px-3 py-1 bg-zinc-100 text-zinc-700 text-xs font-bold rounded-full">{manualCars}</span>
            </div>
          </div>
        </div>

        {/* Bahan Bakar */}
        <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold text-zinc-700 mb-4 flex items-center">
            <Fuel size={16} className="mr-2 text-zinc-400" />
            Jenis Bahan Bakar
          </h3>
          <div className="space-y-3">
            {Object.entries(fuelBreakdown).map(([fuel, count]) => (
              <div key={fuel} className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">{fuel}</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">{count}</span>
              </div>
            ))}
            {Object.keys(fuelBreakdown).length === 0 && (
              <p className="text-sm text-zinc-400">Belum ada data.</p>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          BARIS 4: PERFORMA INQUIRY
       ========================================== */}
      <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
        <h2 className="text-base font-bold text-zinc-900 mb-6">
          Performa Respon Pesan Pelanggan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
              <MailCheck size={22} className="text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-zinc-900">{readInquiries}</p>
              <p className="text-xs text-zinc-500 font-medium">Sudah Dibaca</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <MailX size={22} className="text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-zinc-900">{unreadInquiries}</p>
              <p className="text-xs text-zinc-500 font-medium">Belum Dibaca</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <TrendingUp size={22} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-zinc-900">{responseRate}%</p>
              <p className="text-xs text-zinc-500 font-medium">Response Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* INSIGHT STRIP */}
      <div className="bg-zinc-900 text-white p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Insight Kilat 💡</p>
          <p className="text-sm font-medium leading-relaxed">
            {soldCars.length > 0 
              ? `Harga mobil terjual tertinggi: ${formatRp(Math.max(...soldCars.map(c => c.price)))}. Mobil termahal di database: ${formatRp(highestPrice)}.`
              : `Belum ada penjualan tercatat. Total nilai inventaris saat ini: ${formatRp(potentialRevenue)}.`
            }
          </p>
        </div>
        <div className="text-xs text-zinc-500 shrink-0">
          Data real-time • {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>
    </div>
  );
}
