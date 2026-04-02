import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/features/cars/InquiryForm";
import { 
  CheckCircle2, 
  Calendar, 
  Settings2, 
  Fuel, 
  Gauge, 
  ShieldCheck, 
  PaintBucket
} from "lucide-react";
import { ShareButtons } from "@/components/features/cars/ShareButtons";
import Image from "next/image";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const car = await db.car.findUnique({ 
    where: { id },
    include: { images: { where: { isPrimary: true }, take: 1 } }
  });

  if (!car) return { title: "Mobil Tidak Ditemukan" };

  const title = `${car.brand} ${car.model} (${car.year}) - Rumapea Auto`;
  const description = `Dapatkan ${car.brand} ${car.model} kualitas terbaik hanya di Rumapea Automotive. Harga Rp ${car.price.toLocaleString("id-ID")}. Bebas banjir dan tabrakan.`;
  const mainImage = car.images[0]?.url || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: mainImage ? [mainImage] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: mainImage ? [mainImage] : [],
    },
  };
}

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const car = await db.car.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!car) {
    notFound();
  }

  // Dapatkan gambar utama (yang statusnya isPrimary)
  const mainImage = car.images.find(img => img.isPrimary)?.url || car.images[0]?.url;

  return (
    <div className="space-y-12">
      {/* 
        GRID BESAR: 
        Sebelah kiri (Gambar & Spesifikasi & Deskripsi) - 2/3 layar
        Sebelah kanan (Harga & Formulir Inquiry) - 1/3 layar
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* KOLOM KIRI (Visual & Info Teknis) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* FOTO UTAMA & GALERI */}
          <div className="space-y-4">
            <div className="bg-white border border-stone-200 overflow-hidden relative">
              <div className="aspect-16/10 bg-stone-100 flex items-center justify-center relative">
                 {mainImage ? (
                   <Image 
                     src={mainImage} 
                     alt={`${car.brand} ${car.model}`}
                     fill
                     unoptimized
                     className="object-cover"
                   />
                 ) : (
                   <div className="flex flex-col items-center justify-center text-stone-300 font-bold uppercase tracking-widest">
                     <span>Rumapea</span><span style={{color: "#C8961A"}}>No Image</span>
                   </div>
                 )}
                 {/* Lencana Status */}
                 <div className="absolute top-4 left-4 flex gap-2">
                   <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: "#1A3A2A" }}>
                      {car.condition === "NEW" ? "Unit Baru" : "Unit Bekas"}
                   </span>
                   <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-stone-900 bg-white shadow-sm border border-stone-200">
                      Terverifikasi Cek Fisik
                   </span>
                 </div>
              </div>
            </div>

            {/* THUMBNAILS (Jika lebih dari 1 foto) */}
            {car.images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {car.images.map((img, idx) => (
                  <div key={img.id} className={`relative aspect-square bg-stone-100 border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ${img.isPrimary ? "border-[#C8961A] border-2" : "border-stone-200"}`}>
                    <Image 
                      src={img.url} 
                      alt={`Gallery ${idx + 1}`} 
                      fill
                      unoptimized
                      className="object-cover" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SHARE BUTTONS */}
          <div className="flex items-center justify-between bg-white border border-stone-200 px-6 py-3">
            <span className="text-xs text-stone-500">{car.brand} {car.model} ({car.year})</span>
            <ShareButtons brand={car.brand} model={car.model} year={car.year} price={car.price} />
          </div>

          {/* SPESIFIKASI CEPAT */}
          <div className="bg-white border border-stone-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-stone-100 pb-4">Spesifikasi Singkat</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              <div className="flex flex-col">
                <span className="flex items-center text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Calendar size={14} className="mr-2" /> Tahun
                </span>
                <span className="text-gray-900 font-bold text-base">{car.year}</span>
              </div>

              <div className="flex flex-col">
                <span className="flex items-center text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Settings2 size={14} className="mr-2" /> Transmisi
                </span>
                <span className="text-gray-900 font-bold text-base">
                  {car.transmission === "AUTOMATIC" ? "A/T" : "M/T"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="flex items-center text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Fuel size={14} className="mr-2" /> Bahan Bakar
                </span>
                <span className="text-gray-900 font-bold text-base">
                  {car.fuelType === "GASOLINE" ? "Bensin" : car.fuelType === "DIESEL" ? "Diesel" : car.fuelType}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="flex items-center text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Gauge size={14} className="mr-2" /> Jarak Tempuh
                </span>
                <span className="text-gray-900 font-bold text-base">{car.mileage.toLocaleString("id-ID")} KM</span>
              </div>

              <div className="flex flex-col">
                <span className="flex items-center text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  <PaintBucket size={14} className="mr-2" /> Warna
                </span>
                <span className="text-gray-900 font-bold text-base capitalize">{car.color}</span>
              </div>
            </div>
          </div>

          {/* DESKRIPSI LENGKAP */}
          {car.description && (
            <div className="bg-white border border-stone-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-stone-100 pb-4">Deskripsi Sorotan</h2>
              <div className="text-stone-600 space-y-4 text-base leading-relaxed whitespace-pre-wrap">
                {car.description}
              </div>
            </div>
          )}

        </div>

        {/* KOLOM KANAN (Harga & Panggilan Tindakan) */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
           
           <div className="bg-white border border-stone-200 p-6 shadow-xl shadow-stone-200/40">
              <div className="mb-2">
                <p className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-1">{car.brand}</p>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none mb-4">{car.model}</h1>
              </div>
              
              <div className="py-4 border-t border-b border-stone-100 mb-6">
                <span className="block text-sm font-medium text-stone-500 mb-1">Harga Tunai Bebas OTR</span>
                <div className="text-4xl font-extrabold" style={{ color: "#C8961A" }}>
                  Rp {car.price.toLocaleString("id-ID")}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm font-medium text-stone-700 bg-stone-50 p-2 border border-stone-100">
                  <ShieldCheck size={18} className="text-emerald-600 mr-2" /> Jaminan Bebas Tabrak & Banjir
                </div>
                <div className="flex items-center text-sm font-medium text-stone-700 bg-stone-50 p-2 border border-stone-100">
                  <CheckCircle2 size={18} className="text-emerald-600 mr-2" /> Lulus Inspeksi 128 Titik
                </div>
              </div>

               {car.status === "AVAILABLE" ? (
                 <div className="space-y-3">
                   <a href="#inquiry" className="w-full block text-center text-white p-4 font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity" style={{ backgroundColor: "#1A3A2A" }}>
                     Tertarik? Kirim Pesan
                   </a>
                   <a
                     href={`https://wa.me/6281536187520?text=${encodeURIComponent(`Halo Rumapea Auto, saya tertarik dengan mobil ${car.brand} ${car.model} (${car.year}) - Rp ${car.price.toLocaleString("id-ID")}. Apakah masih tersedia?`)}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-full flex items-center justify-center gap-2 text-center p-4 font-bold uppercase tracking-widest text-sm border-2 border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                     Chat via WhatsApp
                   </a>
                 </div>
               ) : (
                 <button disabled className="w-full bg-stone-200 text-stone-500 p-4 font-bold uppercase tracking-widest text-sm cursor-not-allowed">
                   {car.status === "SOLD" ? "Telah Terjual" : "Dalam Pemesanan"}
                 </button>
               )}
           </div>

           {/* KOTAK KONTAK / INQUIRY */}
           <div id="inquiry">
             {car.status === "AVAILABLE" && <InquiryForm carId={car.id} />}
           </div>

        </div>

      </div>
    </div>
  );
}
