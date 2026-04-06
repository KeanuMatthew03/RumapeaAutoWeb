import React from "react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <div className="relative">
        {/* Simple professional spinner for admin */}
        <div className="w-10 h-10 rounded-full border-2 border-stone-100"></div>
        <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-2 border-t-zinc-800 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
        Sinkronisasi Data...
      </p>
    </div>
  );
}
