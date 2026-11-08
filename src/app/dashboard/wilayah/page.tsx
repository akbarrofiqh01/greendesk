import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { AssetEditForm } from "./asset-edit-form";

export default async function WilayahPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  const canView = hasPermission(session.role, "VIEW_MASTER_DATA");
  const canManage = hasPermission(session.role, "MANAGE_MASTER_DATA");

  if (!canView) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800">
        <h1 className="text-lg font-bold">Akses Ditolak (403)</h1>
        <p className="text-sm mt-1">
          Role <strong>{session.role}</strong> tidak memiliki izin melihat atau
          mengelola data master wilayah & aset sesuai Matriks Hak Akses PRD.
        </p>
      </div>
    );
  }

  const complexes = session.companyId
    ? await prisma.complex.findMany({
        where: { companyId: session.companyId },
        include: {
          clusters: {
            include: {
              parks: {
                include: {
                  assets: {
                    include: { category: true },
                    orderBy: { code: "asc" },
                  },
                },
              },
            },
          },
        },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${
                canManage
                  ? "bg-purple-100 text-purple-800 border border-purple-300"
                  : "bg-slate-100 text-slate-700 border border-slate-300"
              }`}
            >
              {canManage ? "Mode Kelola (Admin)" : "Mode Hanya Lihat (Read-Only)"}
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Struktur Wilayah 5 Tingkat & Data Master Aset
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Hierarki: Perusahaan ({session.companyName}) → Komplek → Cluster →
              Taman → Aset. Setiap perubahan data master oleh Admin otomatis
              tercatat di Riwayat Perubahan Data.
            </p>
          </div>
          {canManage && (
            <Link
              href="/dashboard/audit"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
            >
              Lihat Riwayat Perubahan (AuditLog) →
            </Link>
          )}
        </div>
      </div>

      {complexes.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-900">
          Belum ada data Komplek/Cluster untuk perusahaan{" "}
          <strong>{session.companyName}</strong>. (Membuktikan isolasi data
          multi-perusahaan berjalan dengan benar!).
        </div>
      ) : (
        complexes.map((comp) => (
          <div
            key={comp.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs"
          >
            <div className="border-b border-slate-200 pb-3">
              <div className="text-xs font-bold uppercase text-emerald-700">
                Tingkat 2: Komplek / Perumahan
              </div>
              <h2 className="text-lg font-bold text-slate-900">{comp.name}</h2>
              <p className="text-xs text-slate-500">{comp.address}</p>
            </div>

            <div className="space-y-4">
              {comp.clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-3"
                >
                  <div>
                    <span className="text-xs font-semibold text-sky-700">
                      Tingkat 3: Cluster
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {cluster.name}
                    </h3>
                  </div>

                  {cluster.parks.map((park) => (
                    <div
                      key={park.id}
                      className="rounded-xl bg-white border border-slate-200 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold text-indigo-700">
                            Tingkat 4: Taman
                          </span>
                          <h4 className="font-bold text-sm text-slate-900">
                            {park.name}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Lokasi: {park.locationNote || "-"}
                          </p>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                          {park.assets.length} Aset
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {park.assets.map((asset) => (
                          <div
                            key={asset.id}
                            className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/60"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                                {asset.code}
                              </span>
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                  asset.isActive
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {asset.isActive ? "Aktif" : "Nonaktif"}
                              </span>
                            </div>
                            <div className="font-bold text-sm text-slate-900 mt-2">
                              {asset.name}
                            </div>
                            <div className="text-xs text-slate-600 mt-0.5">
                              Kategori: {asset.category.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Titik Lokasi: {asset.locationNote || "-"}
                            </div>

                            {canManage && <AssetEditForm asset={asset} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

