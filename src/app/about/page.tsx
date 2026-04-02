import Link from "next/link";
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Shield, 
  Award, 
  Users, 
  CarFront,
  ChevronRight
} from "lucide-react";

export const metadata = {
  title: "Tentang Kami - Rumapea Automotive",
  description: "Kenali lebih dekat Rumapea Automotive — showroom mobil terpercaya dengan layanan berkualitas tinggi.",
};

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: "#FAF7F0" }}>
      {/* NAVBAR */}
      <nav
        className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-stone-200 sticky top-0 z-50 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(250,247,240,0.95)" }}
      >
        <Link href="/">
          <span className="text-xl font-bold tracking-widest uppercase text-gray-900">
            Rumapea <span style={{ color: "#1A3A2A" }}>Auto</span>
          </span>
        </Link>
        <div className="flex gap-6 md:gap-10 items-center">
          <Link href="/cars" className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors hover:underline underline-offset-4">
            Katalog
          </Link>
          <Link href="/about" className="text-sm md:text-base text-gray-900 font-semibold underline underline-offset-4">
            Tentang Kami
          </Link>
          <Link
            href="https://wa.me/6281536187520"
            target="_blank"
            className="text-white text-xs md:text-sm font-semibold px-4 md:px-6 py-2 md:py-3 transition-all hover:opacity-80"
            style={{ backgroundColor: "#1A3A2A" }}
          >
            Hubungi Kami
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="px-6 md:px-12 py-20 md:py-28 text-center border-b border-stone-200 animate-fade-in-up">
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#C8961A" }}>
          Sejak 2020 • Showroom Terpercaya
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight max-w-3xl mx-auto mb-6">
          Rumapea <span style={{ color: "#1A3A2A" }}>Automotive</span>
        </h1>
        <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Kami adalah showroom mobil yang berkomitmen menyediakan kendaraan berkualitas tinggi 
          dengan harga transparan dan layanan purna jual yang membanggakan. 
          Setiap unit telah melewati inspeksi ketat 128 titik sebelum dipasarkan.
        </p>
      </section>

      {/* KEUNGGULAN */}
      <section className="px-6 md:px-12 py-16 md:py-20 border-b border-stone-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-12">Mengapa Memilih Kami?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white border border-stone-200 p-8 text-center shadow-sm hover:shadow-md transition-shadow animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#1A3A2A" }}>
                <Shield size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Garansi Kualitas</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Setiap mobil dijamin bebas tabrak dan banjir. Surat-surat lengkap dan terdaftar resmi di SAMSAT.
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-8 text-center shadow-sm hover:shadow-md transition-shadow animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#C8961A" }}>
                <Award size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Harga Transparan</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tidak ada biaya tersembunyi. Harga yang tertera di katalog adalah harga final yang Anda bayar.
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-8 text-center shadow-sm hover:shadow-md transition-shadow animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#1A3A2A" }}>
                <Users size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Tim Profesional</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tim sales dan mekanik kami berpengalaman lebih dari 10 tahun di industri otomotif Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTIK BISNIS */}
      <section className="px-6 md:px-12 py-16 md:py-20 border-b border-stone-200" style={{ backgroundColor: "#1A3A2A" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">50+</p>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Unit Terjual</p>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">100%</p>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Bebas Tabrak</p>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">4.9★</p>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Rating Pelanggan</p>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">5+</p>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Tahun Pengalaman</p>
          </div>
        </div>
      </section>

      {/* INFORMASI SHOWROOM */}
      <section className="px-6 md:px-12 py-16 md:py-20 border-b border-stone-200">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">Lokasi & Kontak</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#1A3A2A" }}>
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Alamat Showroom</p>
                  <p className="text-sm text-gray-500 mt-1">Jl. Raya Otomotif No. 88, Medan, Sumatera Utara 20112</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#1A3A2A" }}>
                  <Clock size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Jam Operasional</p>
                  <p className="text-sm text-gray-500 mt-1">Senin - Sabtu: 08.00 - 17.00 WIB</p>
                  <p className="text-sm text-gray-500">Minggu: Buka dengan Janji Temu</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#1A3A2A" }}>
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Telepon / WhatsApp</p>
                  <p className="text-sm text-gray-500 mt-1">+62 815-3618-7520</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#C8961A" }}>
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Email</p>
                  <p className="text-sm text-gray-500 mt-1">info@rumapea.auto</p>
                </div>
              </div>
            </div>
          </div>

          {/* PETA */}
          <div className="bg-stone-200 border border-stone-300 flex items-center justify-center min-h-[300px] overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127279.00061892533!2d98.61504!3d3.5952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131e8c1b8c1c7%3A0x7030bfbca7a1a0!2sMedan%2C%20North%20Sumatra!5e0!3m2!1sen!2sid!4v1680000000000!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "300px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Rumapea Automotive di Google Maps"
            ></iframe>
          </div>
        </div>
      </section>

      {/* CTA AKHIR */}
      <section className="px-6 md:px-12 py-16 md:py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">Siap Menemukan Mobil Impian Anda?</h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          Jelajahi katalog kami atau hubungi tim kami untuk konsultasi gratis dan test drive.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/cars"
            className="inline-flex items-center justify-center gap-2 text-white font-bold px-8 py-4 text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#1A3A2A" }}
          >
            <CarFront size={18} />
            Lihat Katalog
          </Link>
          <Link
            href="https://wa.me/6281536187520"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 border-2 font-bold px-8 py-4 text-sm uppercase tracking-widest hover:bg-stone-50 transition-colors"
            style={{ borderColor: "#1A3A2A", color: "#1A3A2A" }}
          >
            <Phone size={18} />
            Hubungi Kami
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 px-6 md:px-12 py-8 text-center text-stone-500 text-xs">
        © {new Date().getFullYear()} Rumapea Automotive. All rights reserved.
      </footer>
    </main>
  );
}
