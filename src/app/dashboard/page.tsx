import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import {
  getNavigationForRole,
  getReportViewScope,
  hasPermission,
  ROLE_METADATA,
} from "@/lib/permissions";
import { getScopedReportsForUser } from "@/lib/services/foundation";
import { prisma } from "@/lib/prisma";

export default async function DashboardHomePage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  const roleMeta = ROLE_METADATA[session.role];
  const navItems = getNavigationForRole(session.role);
  const visibleReports = await getScopedReportsForUser(session);

  const [assetCount, auditCount, emailCount] = session.companyId
    ? await Promise.all([
        prisma.asset.count({ where: { companyId: session.companyId } }),
        prisma.auditLog.count({ where: { companyId: session.companyId } }),
        prisma.emailLog.count({ where: { companyId: session.companyId } }),
      ])
    : [0, 0, 0];

  const reportScope = getReportViewScope(session.role);

  return (
    <div className="space-y-6">
      {/* Banner Status Role & Perusahaan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${roleMeta.badgeColor}`}
              >
                Role Aktif: {session.role}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Perusahaan: {session.companyName || "Semua Aset"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Selamat datang, {session.name}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {roleMeta.mainDuties}
            </p>
          </div>
          <Link
            href="/dashboard/fondasi"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition"
          >
            Buka Panel Verifikasi Fase 0 →
          </Link>
        </div>

        {/* Kartu Ringkasan sesuai Cakupan Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <div className="text-xs font-medium text-slate-500">
              Laporan Terlihat (Sesuai Cakupan)
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {visibleReports.length}
            </div>
            <div className="text-xs text-emerald-700 font-medium mt-1">
              Scope: {reportScope}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <div className="text-xs font-medium text-slate-500">
              Aset Terdaftar di Perusahaan
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {assetCount}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Hierarki 5 Tingkat Wilayah
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <div className="text-xs font-medium text-slate-500">
              Jejak Audit Data Master
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {hasPermission(session.role, "VIEW_AUDIT_LOGS")
                ? auditCount
                : "Terbatas"}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {hasPermission(session.role, "VIEW_AUDIT_LOGS")
                ? "Dapat dilihat oleh Admin & Owner"
                : "Hanya untuk Admin & Owner"}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <div className="text-xs font-medium text-slate-500">
              Log Email Outbox (Dev)
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {emailCount}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Tercatat di tabel EmailLog
            </div>
          </div>
        </div>
      </div>

      {/* Menu yang Tersedia untuk Role Ini */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Menu Sesuai Hak Akses Role ({session.role})
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Sesuai Kriteria Selesai Fase 0, pengguna hanya melihat menu yang
          diizinkan untuk rolenya pada Matriks Hak Akses PRD Bagian 4.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition flex flex-col justify-between"
            >
              <div>
                <div className="font-semibold text-sm text-slate-900">
                  {item.label}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {item.description}
                </div>
              </div>
              <div className="text-xs font-semibold text-emerald-700 mt-3">
                Buka halaman →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

