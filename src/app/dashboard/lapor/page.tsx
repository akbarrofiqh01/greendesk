import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function BuatLaporanPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  if (!hasPermission(session.role, "CREATE_REPORT")) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800">
        <h1 className="text-lg font-bold">Akses Ditolak (403)</h1>
        <p className="text-sm mt-1">
          Sesuai Matriks Hak Akses PRD Bagian 4, hanya role{" "}
          <strong>PENGGUNA</strong> yang dapat membuat laporan kerusakan.
        </p>
      </div>
    );
  }

  const assets = await prisma.asset.findMany({
    where: { isActive: true },
    include: {
      park: { include: { cluster: true } },
      category: true,
    },
    orderBy: { code: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
          Akses Khusus Role PENGGUNA
        </span>
        <h1 className="text-xl font-bold text-slate-900">
          Buat Laporan Kerusakan Fasilitas Taman
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Kerangka form pelaporan telah siap di Fase 0. Alur QR penuh + draft
          IndexedDB tanpa login akan diaktifkan di Fase 3 sesuai urutan rencana
          PRD.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Daftar Aset Taman Aktif yang Dapat Dilaporkan ({assets.length} Aset)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-xl border border-slate-200 p-4 bg-slate-50/70"
            >
              <div className="font-mono text-xs font-bold text-emerald-800">
                {asset.code}
              </div>
              <div className="font-bold text-sm text-slate-900 mt-0.5">
                {asset.name}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {asset.park.name} ({asset.park.cluster.name})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

