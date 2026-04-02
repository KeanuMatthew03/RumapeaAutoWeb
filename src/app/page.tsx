import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/features/home/CategoryCard";

const stats = [
  { value: "50+", label: "Unit Tersedia" },
  { value: "200+", label: "Transaksi" },
  { value: "10+", label: "Tahun Pengalaman" },
  { value: "100%", label: "Terpercaya" },
];

const categories = [
  { name: "SUV", desc: "Tangguh & Gagah" },
  { name: "Sedan", desc: "Elegan & Nyaman" },
  { name: "MPV", desc: "Keluarga & Luas" },
  { name: "Pick Up", desc: "Kerja & Usaha" },
];

const brands = [
  "Toyota",
  "Honda",
  "Mitsubishi",
  "Suzuki",
  "Daihatsu",
  "BMW",
  "Mercedes-Benz",
  "Mazda",
  "Nissan",
  "Hyundai",
];

export default function HomePage() {
  return (
    <main
      className="min-h-screen text-gray-900 animate-fade-in-up duration-1000"
      style={{ backgroundColor: "#FAF7F0" }}
    >
      {/* NAVBAR */}
      <nav
        className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-stone-200 sticky top-0 z-50 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(250,247,240,0.95)" }}
      >
        <span className="text-xl font-bold tracking-widest uppercase text-gray-900">
          Rumapea <span style={{ color: "#1A3A2A" }}>Auto</span>
        </span>
        <div className="flex gap-6 md:gap-10 items-center">
          <Link
            href="/cars"
            className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:underline underline-offset-4"
          >
            Katalog
          </Link>
          <Link
            href="/about"
            className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:underline underline-offset-4"
          >
            Tentang Kami
          </Link>
          <Link
            href="https://wa.me/6281536187520"
            target="_blank"
            className="text-white text-xs md:text-sm font-semibold px-4 md:px-6 py-2 md:py-3 transition-all duration-200 hover:opacity-80 hover:scale-105"
            style={{ backgroundColor: "#1A3A2A" }}
          >
            Hubungi Kami
          </Link>
        </div>
      </nav>

      {/* HERO */}
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-12 pt-0 pb-20 grid md:grid-cols-2 gap-20 items-center min-h-[calc(100vh-73px)]">
        <div>
          <h1 className="text-7xl font-bold leading-tight tracking-tight mb-6 text-gray-900">
            Kendaraan <br />
            <span style={{ color: "#1A3A2A" }}>Pilihan</span> <br />
            Terbaik.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
            Koleksi mobil berkualitas dengan harga transparan. Proses mudah,
            terpercaya, dan profesional.
          </p>
          <div className="flex gap-4">
            <Button
              asChild
              className="text-white text-base font-semibold px-10 py-6 rounded-none transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: "#1A3A2A" }}
            >
              <Link href="/cars">Lihat Katalog →</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="text-base font-semibold px-10 py-6 rounded-none border-stone-300 text-gray-600 hover:border-[#1A3A2A] hover:text-[#1A3A2A] transition-all duration-200 bg-transparent"
            >
              <Link href="#categories">Kategori</Link>
            </Button>
          </div>
        </div>

        {/* STATS */}
        <div
          className="grid grid-cols-2 gap-px"
          style={{ backgroundColor: "#E8E0D0" }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="px-10 py-12 transition-all duration-200 hover:scale-105 cursor-default"
              style={{ backgroundColor: "#FAF7F0" }}
            >
              <p className="text-5xl font-bold" style={{ color: "#C8961A" }}>
                {stat.value}
              </p>
              <p className="text-base text-gray-500 mt-3">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND STRIP */}
      <div
        className="border-t border-b border-stone-200 py-5 overflow-hidden"
        style={{ backgroundColor: "#F5F0E8" }}
      >
        <div className="flex gap-10 px-12 flex-wrap">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-sm font-medium text-gray-400 uppercase tracking-widest hover:text-[#1A3A2A] transition-colors duration-200 cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section id="categories" className="max-w-6xl mx-auto px-12 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">
              Kategori Kendaraan
            </p>
            <h2 className="text-4xl font-bold text-gray-900">
              Temukan yang Tepat
            </h2>
          </div>
          <Link
            href="/cars"
            className="text-base font-medium hover:underline underline-offset-4 transition-colors"
            style={{ color: "#1A3A2A" }}
          >
            Semua Mobil →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.name} name={cat.name} desc={cat.desc} />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-12 py-24 border-t border-stone-200">
        <div className="text-center mb-16">
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Apa Kata Mereka?</p>
          <h2 className="text-4xl font-bold text-gray-900">Testimoni Pelanggan</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              name: "Andi Saputra", 
              role: "Pengusaha", 
              text: "Pelayanan sangat profesional. Mobil yang saya beli kondisinya sangat prima sesuai deskripsi di website. Tidak menyesal beli di Rumapea!",
              stars: 5
            },
            { 
              name: "Siska Amelia", 
              role: "Ibu Rumah Tangga", 
              text: "Proses cepat dan transparan. Marketing ramah dan sangat membantu menjawab pertanyaan saya yang banyak. Showroom terpercaya di Medan!",
              stars: 5
            },
            { 
              name: "Budi Santoso", 
              role: "Karyawan Swasta", 
              text: "Awalnya ragu beli mobil lewat web, tapi setelah kunjungan langsung ke lokasi, memang Rumapea Automotive kualitasnya beda. Terjamin!",
              stars: 5
            }
          ].map((testi, idx) => (
            <div key={idx} className="bg-white border border-stone-200 p-8 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(testi.stars)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-6 leading-relaxed">&quot;{testi.text}&quot;</p>
              <div>
                <p className="font-bold text-gray-900">{testi.name}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest">{testi.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-6xl mx-auto px-12 pb-24">
        <div
          className="px-14 py-16 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ backgroundColor: "#1A3A2A" }}
        >
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#C8961A" }}
            >
              Siap Menemukan Mobil Impian?
            </p>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Lihat koleksi lengkap <br />
              kami sekarang.
            </h2>
          </div>
          <Button
            asChild
            className="text-gray-900 font-bold text-base px-10 py-6 rounded-none shrink-0 hover:opacity-90 hover:scale-105 transition-all duration-200"
            style={{ backgroundColor: "#C8961A" }}
          >
            <Link href="/cars">Mulai Sekarang →</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-stone-200 px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-base font-bold tracking-widest uppercase text-gray-900">
          Rumapea <span style={{ color: "#1A3A2A" }}>Auto</span>
        </span>
        <div className="flex gap-6">
          <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900">Tentang Kami</Link>
          <Link href="/cars" className="text-sm text-gray-500 hover:text-gray-900">Katalog</Link>
        </div>
        <span className="text-sm text-gray-400">
          © 2026 Rumapea Automotive. Hak Cipta Dilindungi.
        </span>
      </footer>
    </main>
  );
}
