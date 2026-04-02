import { auth } from "@/lib/auth";
import { ShieldAlert, Fingerprint } from "lucide-react";

export const metadata = {
  title: "Pengaturan & Profil - Admin",
};

export default async function AdminSettingsPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* HEADER TIPE INDUSTRIAL */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Pengaturan Profil Layanan
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Informasi identitas akun Administrator yang Anda gunakan saat ini.
          </p>
        </div>
      </div>

      {/* PROFIL UTAMA CARD */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-zinc-200 overflow-hidden">
        
        {/* Banner Dekorasional Atas */}
        <div className="h-24 bg-zinc-900 w-full relative">
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 bg-zinc-50 border-4 border-white rounded-xl shadow-sm flex items-center justify-center text-zinc-800 text-3xl font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          </div>
        </div>

        {/* Konten Data Profil */}
        <div className="pt-14 px-8 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">
              {session?.user?.name || "Profil Belum Diatur"}
            </h2>
            <p className="text-zinc-500 text-sm mt-0.5 flex flex-col font-medium">
              <span>{session?.user?.email}</span>
            </p>
          </div>
          <div className="shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded flex items-center shadow-sm text-xs font-semibold uppercase tracking-widest">
            <ShieldAlert size={14} className="mr-1.5 -mt-0.5" />
            Hak Eksekutif {session?.user?.role}
          </div>
        </div>
        
        <div className="border-t border-zinc-100 bg-zinc-50/50 p-8">
           <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center uppercase tracking-wide">
             <Fingerprint size={16} className="mr-2 text-zinc-400" />
             Rincian Sesi Keamanan
           </h3>
           <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col">
                <dt className="text-xs font-medium text-zinc-500 mb-1">ID Pengguna Berbasis Cloud</dt>
                <dd className="text-sm font-mono text-zinc-900 bg-white p-2 rounded border border-zinc-200">
                  {session?.user?.id || "Memuat ulang..."}
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xs font-medium text-zinc-500 mb-1">Tingkat Hak Akses</dt>
                <dd className="text-sm font-mono text-zinc-900 bg-white p-2 rounded border border-zinc-200 flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${isAdmin ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  Level {isAdmin ? "Level 1 (Tertinggi)" : "Level 3 (Terbatas)"}
                </dd>
              </div>
           </dl>
           <p className="text-xs text-amber-600 mt-6 max-w-lg leading-relaxed bg-amber-50 p-3 rounded border border-amber-200">
             <strong>Peringatan Keamanan:</strong> Pengaturan konfigurasi website rumit (Title Tag, Mata Uang, SMTP Email Blast) saat ini diatur langsung melalui *Database/Source Code* dan dikunci demi mencegah kerusakan permanen oleh peretas.
           </p>
        </div>
      </div>

    </div>
  );
}
