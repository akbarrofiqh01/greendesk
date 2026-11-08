import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function VendorPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  if (!hasPermission(session.role, "VIEW_VENDORS")) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800">
        <h1 className="text-lg font-bold">Akses Ditolak (403)</h1>
        <p className="text-sm mt-1">
          Role <strong>{session.role}</strong> tidak memiliki izin mengakses
          halaman Data Vendor.
        </p>
      </div>
    );
  }

  const vendors = session.companyId
    ? await prisma.vendor.findMany({
        where:
          session.role === "PIC_VENDOR"
            ? { companyId: session.companyId, picUserId: session.id }
            : { companyId: session.companyId },
        include: {
          picUser: { select: { name: true, email: true } },
          serviceAreas: { include: { cluster: true } },
          technicians: true,
        },
      })
    : [];

  const canManage = hasPermission(session.role, "MANAGE_VENDORS");

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 mb-2">
          {canManage ? "Mode Kelola Vendor (Admin)" : "Mode Lihat Vendor"}
        </span>
        <h1 className="text-xl font-bold text-slate-900">
          Data Vendor & Area Layanan ({session.companyName})
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {session.role === "PIC_VENDOR"
            ? "Menampilkan data vendor milik perusahaan Anda."
            : "Menampilkan daftar vendor rekanan beserta area layanan cluster dan teknisi."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {vendors.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">{v.name}</h2>
                <div className="text-xs text-slate-500">
                  Jenis: {v.type} · Garansi Pekerjaan: {v.warrantyDays} hari ·
                  NPWP: {v.npwp || "-"}
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {v.technicians.length} Teknisi Terdaftar
              </span>
            </div>

            <div className="text-xs text-slate-700">
              <strong>PIC Vendor:</strong> {v.picUser?.name || "-"} (
              {v.picUser?.email || "-"})
            </div>
            <div className="text-xs text-slate-700">
              <strong>Area Layanan Cluster:</strong>{" "}
              {v.serviceAreas.map((sa) => sa.cluster.name).join(", ") || "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

