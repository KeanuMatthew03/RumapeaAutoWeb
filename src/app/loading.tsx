import React from "react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF7F0]/90 backdrop-blur-md animate-in fade-in duration-700">
      <div className="relative group">
        {/* Glow Effect Background */}
        <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Main Logo Spinner */}
        <svg className="w-24 h-24 relative" viewBox="0 0 100 100">
          {/* Outer Track */}
          <circle 
            cx="50" cy="50" r="42" 
            fill="none" 
            stroke="currentColor" 
            className="text-stone-200" 
            strokeWidth="2" 
          />
          
          {/* Interactive Dash Circle */}
          <circle 
            cx="50" cy="50" r="42" 
            fill="none" 
            stroke="url(#emeraldGradient)" 
            strokeWidth="4" 
            strokeLinecap="round"
            strokeDasharray="60 120"
            className="animate-[spin_1.5s_linear_infinite]"
          />
          
          {/* Scanner Line Effect */}
          <line 
            x1="15" y1="50" x2="85" y2="50" 
            stroke="url(#emeraldGradient)" 
            strokeWidth="1"
            className="animate-[bounce_2s_ease-in-out_infinite] opacity-30"
          />

          <defs>
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>

        {/* Central Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-emerald-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-ping"></div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-xl font-black tracking-tighter text-stone-900 uppercase">
          Rumapea <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-sm ml-1">Auto</span>
        </h2>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="h-[1px] w-8 bg-stone-300"></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">
            Premium Selection
          </p>
          <div className="h-[1px] w-8 bg-stone-300"></div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes dash {
          0% { stroke-dashoffset: 200; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -200; }
        }
      `}</style>
    </div>
  );
}
