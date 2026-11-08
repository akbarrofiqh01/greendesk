import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission, ROLE_METADATA } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function AkunInternalPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  if (!hasPermission(session.role, "MANAGE_INTERNAL_ACCOUNTS")) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800">
        <h1 className="text-lg font-bold">Akses Ditolak (403)</h1>
        <p className="text-sm mt-1">
          Hanya <strong>ADMIN</strong> yang dapat mengelola Akun Internal dan
          memblokir akun pengguna.
        </p>
      </div>
    );
  }

  const users = session.companyId
    ? await prisma.user.findMany({
        where: { companyId: session.companyId },
        include: {
          staffCluster: true,
          managerAssignments: { include: { cluster: true } },
        },
        orderBy: { role: "asc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">
          Manajemen Akun Internal & Rekam Jejak Pelapor ({session.companyName})
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Hanya dapat diakses oleh Admin untuk mengelola akun Pengelola,
          Manager, PIC Vendor, serta memantau rekam jejak laporan valid/tidak
          valid per akun pengguna.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                <th className="p-3.5 font-semibold">Nama & Email</th>
                <th className="p-3.5 font-semibold">Role</th>
                <th className="p-3.5 font-semibold">Cakupan / Cluster</th>
                <th className="p-3.5 font-semibold">Rekam Jejak Laporan</th>
                <th className="p-3.5 font-semibold">Status Akun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((u) => {
                const meta = ROLE_METADATA[u.role];
                return (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">
                        {u.name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {u.email}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${meta.badgeColor}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-xs text-slate-600">
                      {u.staffCluster
                        ? `Cluster: ${u.staffCluster.name}`
                        : u.managerAssignments.length > 0
                        ? `Cluster: ${u.managerAssignments
                            .map((m) => m.cluster.name)
                            .join(", ")}`
                        : meta.scopeDescription}
                    </td>
                    <td className="p-3.5 text-xs">
                      <span className="text-emerald-700 font-semibold">
                        Valid: {u.validReportCount}
                      </span>{" "}
                      ·{" "}
                      <span className="text-rose-700 font-semibold">
                        Tidak Valid: {u.invalidReportCount}
                      </span>
                    </td>
                    <td className="p-3.5 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold ${
                          u.isBlocked
                            ? "bg-rose-100 text-rose-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {u.isBlocked ? "Diblokir" : "Aktif"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

