"use client";

import { Download } from "lucide-react";

interface ExportButtonProps {
  data: {
    totalCars: number;
    soldCars: number;
    totalRevenue: number;
    totalInquiries: number;
    brands: [string, number][];
  };
}

export function ExportButton({ data }: ExportButtonProps) {
  function downloadCSV() {
    const headers = ["Metrik", "Nilai"];
    const rows = [
      ["Total Inventaris", `${data.totalCars} Unit`],
      ["Unit Terjual", `${data.soldCars} Unit`],
      ["Total Pendapatan", `Rp ${data.totalRevenue.toLocaleString("id-ID")}`],
      ["Total Inquiries", `${data.totalInquiries} Pesan`],
      ["", ""],
      ["Top Merek", "Jumlah Unit"],
      ...data.brands.map(([brand, count]) => [brand, count.toString()]),
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Rumapea_Auto_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <button
      onClick={downloadCSV}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-zinc-900 rounded-md hover:bg-zinc-800 transition-colors shadow-sm"
    >
      <Download size={16} />
      Export CSV
    </button>
  );
}
