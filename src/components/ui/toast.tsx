"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

// === TIPE DATA TOAST ===
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// === HOOK UNTUK DIPANGGIL DARI MANA SAJA ===
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam <ToastProvider>");
  return ctx;
}

// === KONFIGURASI VISUAL PER TIPE ===
const toastConfig: Record<ToastType, { icon: typeof CheckCircle2; bg: string; border: string; text: string }> = {
  success: { icon: CheckCircle2, bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-800" },
  error:   { icon: XCircle,     bg: "bg-red-50",     border: "border-red-300",     text: "text-red-800"     },
  warning: { icon: AlertTriangle, bg: "bg-amber-50", border: "border-amber-300",   text: "text-amber-800"   },
  info:    { icon: Info,         bg: "bg-blue-50",    border: "border-blue-300",    text: "text-blue-800"    },
};

// === PROVIDER UTAMA (Bungkus di Layout) ===
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* KONTAINER TOAST — Pojok kanan atas, mengambang di atas semua konten */}
      <div className="fixed top-5 right-5 z-9999 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// === SATU BUAH ITEM TOAST (Otomatis hilang dalam 5 detik) ===
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animasi masuk
    requestAnimationFrame(() => setIsVisible(true));

    // Otomatis hilang setelah 5 detik
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 border shadow-lg backdrop-blur-sm transition-all duration-300 ease-out ${config.bg} ${config.border} ${config.text} ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Icon size={20} className="shrink-0 mt-0.5" />
      <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="shrink-0 p-0.5 rounded hover:bg-black/10 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
