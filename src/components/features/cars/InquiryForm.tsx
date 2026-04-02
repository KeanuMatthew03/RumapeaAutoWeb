"use client";

import { useState } from "react";
import { submitInquiryAction } from "@/actions/inquiry.actions";
import { Loader2, MailCheck } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function InquiryForm({ carId }: { carId: string }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    const fd = new FormData(e.currentTarget);
    const result = await submitInquiryAction({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      message: fd.get("message") as string,
      carId: carId,
    });

    setLoading(false);
    if (result.success) {
      setStatus("success");
      showToast(
        "Pesan berhasil terkirim! Kami akan segera menghubungi Anda. ✉️",
        "success",
      );
      e.currentTarget.reset();
    } else {
      setStatus("error");
      showToast("Gagal mengirim pesan. Silakan coba lagi.", "error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <MailCheck size={32} className="text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">
          Pesan Telah Diterima!
        </h3>
        <p className="mt-2 text-sm max-w-xs">
          Terima kasih. Agen pemasaran terbaik kami akan segera menghubungi Anda
          secepatnya.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 border border-stone-200 p-6">
      <h3 className="text-xl font-bold tracking-tight text-stone-900 border-b border-stone-200 pb-4 mb-6">
        Ajukan Pertanyaan 🚘
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
            Nama Lengkap
          </label>
          <input
            required
            name="name"
            type="text"
            className="w-full bg-white border border-stone-300 p-3 text-stone-800 text-sm font-medium focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            placeholder="Bpk. John Doe"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
            Email Aktif
          </label>
          <input
            required
            name="email"
            type="email"
            className="w-full bg-white border border-stone-300 p-3 text-stone-800 text-sm font-medium focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
            Nomor WhatsApp
          </label>
          <input
            required
            name="phone"
            type="tel"
            className="w-full bg-white border border-stone-300 p-3 text-stone-800 text-sm font-medium focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            placeholder="08123456789"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
            Pesan / Penawaran
          </label>
          <textarea
            required
            name="message"
            rows={4}
            className="w-full bg-white border border-stone-300 p-3 text-stone-800 text-sm font-medium focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-y"
            placeholder="Saya tertarik dengan mobil ini, apakah harganya masih bisa nego?"
          ></textarea>
        </div>

        {status === "error" && (
          <p className="text-red-600 text-xs font-medium">
            Gagal mengirim pesan. Silakan coba lagi.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A3A2A] text-white p-3 font-semibold uppercase tracking-widest text-sm hover:bg-[#204a36] transition-all duration-300 flex items-center justify-center disabled:opacity-70 mt-6"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            "Kirim Sekarang"
          )}
        </button>
      </form>
    </div>
  );
}
