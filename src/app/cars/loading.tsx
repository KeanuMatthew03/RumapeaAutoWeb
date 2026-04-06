import React from "react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-stone-100"></div>
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-t-emerald-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-stone-400">
        Menghubungkan ke Pusat Data...
      </p>
    </div>
  );
}
