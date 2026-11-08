import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getReportViewScope, hasPermission } from "@/lib/permissions";
import { getScopedReportsForUser } from "@/lib/services/foundation";
import { ArchiveReportButton } from "./archive-button";

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ arsip?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  const resolvedParams = await searchParams;
  const showArchived = resolvedParams.arsip === "1";

  const reports = await getScopedReportsForUser(session, {
    includeArchived: showArchived,
  });

  const scope = getReportViewScope(session.role);
  const canArchive = hasPermission(session.role, "ARCHIVE_REPORT");

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Cakupan Role {session.role}: {scope}
              </span>
              {session.role === "TEKNISI" && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Privasi Aktif: Identitas Pelapor Disembunyikan di Query DB
                </span>
              )}
              {session.role === "ADMIN" && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                  Mode Hanya Lihat (Admin Tidak Bisa Verifikasi/Putuskan)
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {showArchived
                ? "Arsip Laporan Kerusakan (archivedAt != null)"
                : "Daftar Laporan Kerusakan Aktif"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Sesuai PRD Fase 0, laporan tidak pernah dihapus permanen. Query
              default menyembunyikan laporan yang diarsipkan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={
                showArchived
                  ? "/dashboard/laporan"
                  : "/dashboard/laporan?arsip=1"
              }
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition"
            >
              {showArchived
                ? "← Kembali ke Laporan Aktif"
                : "Lihat Arsip Laporan"}
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            Tidak ada laporan {showArchived ? "di arsip " : "aktif "}untuk
            cakupan role <strong>{session.role}</strong> saat ini.
          </div>
        ) : (
          reports.map((report) => {
            const daysInStage = Math.max(
              0,
              Math.floor(
                (Date.now() - new Date(report.stageEnteredAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            );
            const hasReporterField = "reporter" in report && report.reporter;

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900 text-white">
                      {report.ticketNo}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-300">
                      Status: {report.status}
                    </span>
                    {report.priority && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                        Prioritas: {report.priority}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      Saluran: {report.channel} · {daysInStage} hari di tahap ini
                    </span>
                  </div>

                  {canArchive && (
                    <ArchiveReportButton
                      reportId={report.id}
                      isArchived={Boolean(report.archivedAt)}
                    />
                  )}
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Aset: {report.asset.name} ({report.asset.code})
                  </div>
                  <div className="text-xs text-slate-500">
                    Taman: {report.asset.park.name} · Cluster:{" "}
                    {report.asset.park.cluster.name}
                  </div>
                </div>

                <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                  {report.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div>
                    {hasReporterField ? (
                      <span>
                        Pelapor: <strong>{report.reporter.name}</strong> (
                        {report.reporter.email})
                      </span>
                    ) : (
                      <span className="text-amber-800 font-medium">
                        🔒 Identitas Pelapor Disembunyikan (Aturan Privasi
                        Teknisi PRD 14.5)
                      </span>
                    )}
                  </div>

                  {report.workOrder && (
                    <div className="font-mono text-xs bg-indigo-50 text-indigo-900 px-2.5 py-1 rounded border border-indigo-200">
                      SPK: {report.workOrder.spkNo} ({report.workOrder.vendor.name})
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

