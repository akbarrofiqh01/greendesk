import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { getCompanyAuditLogs } from "@/lib/audit";

export default async function AuditLogPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  if (!hasPermission(session.role, "VIEW_AUDIT_LOGS")) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800">
        <h1 className="text-lg font-bold">Akses Ditolak (403)</h1>
        <p className="text-sm mt-1">
          Role <strong>{session.role}</strong> tidak memiliki izin melihat
          Riwayat Perubahan Data (AuditLog). Sesuai Matriks Hak Akses PRD Bagian
          4, fitur ini hanya dapat diakses oleh <strong>ADMIN</strong> dan{" "}
          <strong>OWNER</strong>.
        </p>
      </div>
    );
  }

  const logs = await getCompanyAuditLogs(session, 100);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 mb-2">
          Auditabilitas Fase 0 (Immutable Log)
        </span>
        <h1 className="text-xl font-bold text-slate-900">
          Riwayat Perubahan Data Master ({session.companyName})
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Mencatat siapa pengubah, entitas apa, kapan, serta nilai lama dan
          nilai baru. Sesuai PRD Bagian 11, riwayat ini dilindungi di tingkat
          Prisma Client sehingga tidak dapat diubah atau dihapus oleh role mana
          pun.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="p-3.5 font-semibold">Waktu</th>
                <th className="p-3.5 font-semibold">Pelaku & Role</th>
                <th className="p-3.5 font-semibold">Aksi & Entitas</th>
                <th className="p-3.5 font-semibold">Ringkasan</th>
                <th className="p-3.5 font-semibold">Nilai Lama → Nilai Baru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    Belum ada catatan riwayat perubahan untuk perusahaan ini.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 align-top">
                    <td className="p-3.5 whitespace-nowrap text-xs text-slate-500 font-mono">
                      {new Date(log.createdAt).toLocaleString("id-ID")}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">
                        {log.actorName}
                      </div>
                      <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800 mt-0.5">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {log.action}
                      </span>
                      <div className="text-xs text-slate-600 mt-1 font-mono">
                        {log.entityName}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-800 font-medium">
                      {log.summary}
                    </td>
                    <td className="p-3.5">
                      <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
                        <div className="p-2 rounded bg-rose-50 text-rose-900 border border-rose-200 overflow-x-auto">
                          <strong>Lama:</strong>{" "}
                          {JSON.stringify(log.oldValues ?? {})}
                        </div>
                        <div className="p-2 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 overflow-x-auto">
                          <strong>Baru:</strong>{" "}
                          {JSON.stringify(log.newValues ?? {})}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

