import { db } from "@/lib/db";
import { CheckCircle2, Trash2, Mail, MailOpen } from "lucide-react";
import { markAsReadAction, deleteInquiryAction } from "@/actions/inquiry.actions";
import Link from "next/link";

export const metadata = {
  title: "Pesan Masuk - Admin",
};

export default async function AdminInquiriesPage() {
  const inquiries = await db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      car: {
        select: { brand: true, model: true, year: true, id: true },
      },
      user: {
        select: { name: true, email: true }, // Jika pembeli tersebut memiliki akun
      },
    },
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER TIPE INDUSTRIAL */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Kotak Masuk (Inquiries)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Daftar pertanyaan dari calon pembeli dan rekap pemesanan armada.
          </p>
        </div>
      </div>

      {/* DAFTAR PESAN */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-zinc-200 overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="p-4 bg-zinc-50 rounded-full border border-zinc-100 mb-4 text-zinc-400">
              <MailOpen size={32} strokeWidth={1.5} />
            </div>
            <p className="text-base font-semibold text-zinc-900">
              Kotak Masuk Kosong
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              Belum ada interaksi pertanyaan apapun dari publik. 
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/50 text-zinc-500 border-b border-zinc-200 whitespace-nowrap">
                <tr>
                  <th className="py-3 px-6 font-medium w-1/4">Indentitas Pengirim</th>
                  <th className="py-3 px-6 font-medium w-2/4">Isi Pesan Utama</th>
                  <th className="py-3 px-6 font-medium text-center">Status</th>
                  <th className="py-3 px-6 font-medium text-right">Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {inquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className={`hover:bg-zinc-50/50 transition-colors group ${
                      !inq.isRead ? "bg-amber-50/30" : ""
                    }`}
                  >
                    {/* INFO PENGIRIM */}
                    <td className="py-4 px-6 align-top">
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 flex items-center">
                          {!inq.isRead && (
                            <span className="w-2 h-2 rounded-full bg-red-500 mr-2 shrink-0 animate-pulse"></span>
                          )}
                          {inq.name}
                        </span>
                        <a href={`mailto:${inq.email}`} className="text-zinc-500 text-xs hover:text-zinc-900 hover:underline mt-0.5">
                          {inq.email}
                        </a>
                        {inq.phone && (
                          <span className="text-zinc-500 text-xs mt-0.5">
                            📞 {inq.phone}
                          </span>
                        )}
                        <span className="text-zinc-400 text-xs mt-2 italic">
                          {new Date(inq.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute:"2-digit"
                          })}
                        </span>
                      </div>
                    </td>

                    {/* DETAIL PESAN */}
                    <td className="py-4 px-6 align-top max-w-md">
                      <div className="mb-2">
                        {inq.car ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-zinc-200 bg-zinc-100/50 text-zinc-700">
                            Minat Mobil: <Link href={`/admin/cars`} className="ml-1 text-zinc-900 font-bold hover:underline">{inq.car.brand} {inq.car.model}</Link>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-zinc-200 bg-zinc-100/50 text-zinc-500">
                            Pertanyaan Umum (Bukan spesifik mobil)
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-700 whitespace-pre-wrap leading-relaxed">
                        {inq.message}
                      </p>
                    </td>

                    {/* STATUS READ */}
                    <td className="py-4 px-6 align-top text-center">
                      {inq.isRead ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-600 font-medium text-xs">
                          <CheckCircle2 size={14} />
                          <span>Telah Dibaca</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-amber-600 font-medium text-xs">
                          <Mail size={14} />
                          <span>Pesan Baru</span>
                        </span>
                      )}
                    </td>

                    {/* TOMBOL AKSI */}
                    <td className="py-4 px-6 align-top text-right">
                      <div className="flex flex-col items-end space-y-2">
                        {inq.phone && (
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Halo ${inq.name}, saya dari Rumapea Auto ingin menanggapi pesan Anda mengenai ${inq.car ? inq.car.brand + " " + inq.car.model : "layanan kami"}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md flex items-center justify-center w-full max-w-[120px]"
                          >
                            <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            Balas WA
                          </a>
                        )}

                        {!inq.isRead && (
                          <form
                            action={async () => {
                              "use server";
                              await markAsReadAction(inq.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="text-xs font-medium text-zinc-500 hover:text-emerald-600 transition-colors border border-transparent hover:border-emerald-200 hover:bg-emerald-50 px-2 py-1 rounded w-full"
                            >
                              Tandai Dibaca
                            </button>
                          </form>
                        )}
                        
                        <form
                          action={async () => {
                            "use server";
                            await deleteInquiryAction(inq.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs flex items-center font-medium text-zinc-400 hover:text-red-600 transition-colors px-2 py-1 border border-transparent rounded hover:border-red-200 hover:bg-red-50 w-full justify-end"
                            title="Hapus riwayat obrolan"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Hapus
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
