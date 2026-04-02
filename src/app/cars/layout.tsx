import Link from "next/link";

export default function PublicCarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "#FAF7F0" }}
    >
      {/* NAVBAR PUBLIK (Sama dengan layout Beranda) */}
      <nav
        className="px-6 md:px-12 py-5 flex items-center justify-between border-b border-stone-200 sticky top-0 z-50 backdrop-blur-md"
        style={{ backgroundColor: "rgba(250,247,240,0.85)" }}
      >
        <Link href="/">
          <span className="text-xl font-bold tracking-widest uppercase text-gray-900">
            Rumapea <span style={{ color: "#1A3A2A" }}>Auto</span>
          </span>
        </Link>
        <div className="flex gap-6 md:gap-10 items-center">
          <Link
            href="/cars"
            className="text-sm md:text-base text-gray-900 font-semibold transition-colors duration-200 underline underline-offset-4"
          >
            Katalog
          </Link>
          <Link
            href="/about"
            className="text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            Tentang Kami
          </Link>
          <Link
            href="https://wa.me/6281536187520"
            target="_blank"
            className="text-white text-xs md:text-sm font-semibold px-4 md:px-6 py-2 md:py-3 transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: "#1A3A2A" }}
          >
            Hubungi Kami
          </Link>
        </div>
      </nav>

      {/* RENDER HALAMAN KATALOG/DETAIL DISINI */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 pb-20 animate-fade-in-up">
        {children}
      </main>

      {/* FOOTER PUBLIK */}
      <footer className="border-t border-stone-200 px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-base font-bold tracking-widest uppercase text-gray-900">
          Rumapea <span style={{ color: "#1A3A2A" }}>Auto</span>
        </span>
        <span className="text-xs md:text-sm text-gray-400">
          © 2026 Rumapea Automotive. Hak Cipta Dilindungi.
        </span>
      </footer>
    </div>
  );
}
