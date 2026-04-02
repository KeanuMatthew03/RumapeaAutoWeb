import Link from "next/link";
import { db } from "@/lib/db";
import { 
  CarFront, 
  LayoutDashboard, 
  Mail, 
  BarChart3,
  Settings, 
  LogOut 
} from "lucide-react";
import { auth, signOut } from "@/lib/auth";

export const metadata = {
  title: "Admin Dashboard - Rumapea Auto",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Ambil jumlah pesan yang belum dibaca
  const unreadInquiriesCount = await db.inquiry.count({
    where: { isRead: false },
  });

  return (
    <div className="min-h-screen flex bg-zinc-50 font-sans text-zinc-900">
      
      {/* SIDEBAR SPACER: agar konten utama tidak tergeser saat kita memakai absolute sidebar (Aktif untuk HP & PC) */}
      <div className="w-[72px] shrink-0"></div>

      {/* SIDEBAR: Interaktif Expand on Hover */}
      <aside className="fixed left-0 top-0 h-screen z-50 flex flex-col bg-zinc-950 text-zinc-400 border-r border-zinc-800 transition-all duration-300 ease-in-out w-[72px] hover:w-64 group overflow-hidden">
        
        {/* LOGO */}
        <div className="p-4 w-full border-b border-zinc-800/50 mb-4 flex items-center h-16 shrink-0 group-hover:px-6 transition-all duration-300">
          <Link href="/" className="flex items-center">
            {/* Tampil Ikon saat kecil, tampil teks saat dibuka */}
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
              <span className="text-white font-bold tracking-tighter text-lg -ml-0.5">R</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 ml-3 whitespace-nowrap">
              Rumapea<span className="text-zinc-500 font-normal ml-1">Admin</span>
            </span>
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col w-full px-3 space-y-2 grow">
          <Link 
            href="/admin"
            className="flex items-center px-3 py-2.5 rounded-md hover:bg-zinc-800/50 hover:text-white transition-all text-zinc-400"
          >
            <LayoutDashboard size={20} strokeWidth={2} className="shrink-0" />
            <span className="font-medium text-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4">
              Overview
            </span>
          </Link>

          <Link 
            href="/admin/cars"
            className="flex items-center px-3 py-2.5 rounded-md hover:bg-zinc-800/50 hover:text-white transition-all text-zinc-400"
          >
            <CarFront size={20} strokeWidth={2} className="shrink-0" />
            <span className="font-medium text-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4">
              Inventory
            </span>
          </Link>

          <Link 
            href="/admin/inquiries"
            className="flex items-center px-3 py-2.5 rounded-md hover:bg-zinc-800/50 hover:text-white transition-all text-zinc-400 relative"
          >
            <div className="relative">
              <Mail size={20} strokeWidth={2} className="shrink-0" />
              {unreadInquiriesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-950 group-hover:hidden animate-pulse"></span>
              )}
            </div>
            <span className="font-medium text-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4 flex items-center justify-between grow">
              <span>Inquiries</span>
              {unreadInquiriesCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-zinc-950">
                  {unreadInquiriesCount}
                </span>
              )}
            </span>
          </Link>

          <Link 
            href="/admin/analytics"
            className="flex items-center px-3 py-2.5 rounded-md hover:bg-zinc-800/50 hover:text-white transition-all text-zinc-400"
          >
            <BarChart3 size={20} strokeWidth={2} className="shrink-0" />
            <span className="font-medium text-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4">
              Analisis
            </span>
          </Link>

          <Link 
            href="/admin/settings"
            className="flex items-center px-3 py-2.5 rounded-md hover:bg-zinc-800/50 hover:text-white transition-all text-zinc-400"
          >
            <Settings size={20} strokeWidth={2} className="shrink-0" />
            <span className="font-medium text-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4">
              Settings
            </span>
          </Link>
        </nav>

        {/* LOGOUT */}
        <div className="p-3 w-full border-t border-zinc-800/50 mt-auto shrink-0">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button 
              type="submit"
              className="flex items-center px-3 py-2.5 w-full rounded-md hover:bg-red-500/10 hover:text-red-400 text-zinc-400 transition-all"
            >
              <LogOut size={20} strokeWidth={2} className="shrink-0" />
              <span className="font-medium text-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4">
                Log out
              </span>
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* TOP HEADER */}
        <header className="h-16 shrink-0 border-b border-zinc-200 bg-white px-8 flex items-center justify-between shadow-sm z-10 w-full">
          <h2 className="text-[15px] font-semibold text-zinc-800 tracking-tight">
            Welcome back, {session?.user?.name || "Administrator"}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800 font-bold text-xs ring-2 ring-white">
              {session?.user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* CONTENT WINDOW */}
        <div className="p-8 overflow-y-auto bg-zinc-50 w-full h-full pb-20">
          <div className="max-w-6xl mx-auto animate-fade-in-up">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
