import React from "react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-stone-100"></div>
        {/* Spinning Active Ring */}
        <div 
          className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-emerald-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"
          style={{ animationDuration: "0.8s" }}
        ></div>
        {/* Inner Logo Icon (Pulse) */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <div className="w-2 h-2 rounded-full bg-emerald-600 shadow-[0_0_15px_rgba(5,150,105,0.5)]"></div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col items-center">
        <span className="text-sm font-bold tracking-[0.2em] uppercase text-stone-400 animate-pulse">
          Rumapea <span className="text-emerald-600">Auto</span>
        </span>
        <div className="mt-2 text-[10px] text-stone-300 font-medium tracking-widest uppercase">
          Menyiapkan Kendaraan Terbaik...
        </div>
      </div>
    </div>
  );
}
