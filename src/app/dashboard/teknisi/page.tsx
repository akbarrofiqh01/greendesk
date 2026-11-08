import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function TeknisiManagementPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  if (!hasPermission(session.role, "VIEW_TECHNICIANS")) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800">
        <h1 className="text-lg font-bold">Akses Ditolak (403)</h1>
        <p className="text-sm mt-1">
          Role <strong>{session.role}</strong> tidak memiliki izin mengakses
          manajemen teknisi.
        </p>
      </div>
    );
  }

  const technicians = session.companyId
    ? await prisma.technician.findMany({
        where: { companyId: session.companyId },
        include: { vendor: true },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">
          Daftar Teknisi Vendor
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Teknisi didaftarkan oleh PIC Vendor dan hanya aktif setelah disetujui
          Admin.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {technicians.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900">{t.fullName}</div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {t.approvalStatus} / {t.status}
              </span>
            </div>
            <div className="text-xs text-slate-600">
              Vendor: <strong>{t.vendor.name}</strong>
            </div>
            <div className="text-xs text-slate-600">
              Email: {t.email} · WA: {t.whatsapp}
            </div>
            <div className="text-xs text-slate-600">
              Keahlian: {t.skills.join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

