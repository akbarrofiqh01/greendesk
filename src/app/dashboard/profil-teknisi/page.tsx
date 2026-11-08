import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function ProfilTeknisiPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  if (!hasPermission(session.role, "VIEW_OWN_TECH_PROFILE")) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800">
        <h1 className="text-lg font-bold">Akses Ditolak (403)</h1>
        <p className="text-sm mt-1">
          Halaman ini khusus untuk role <strong>TEKNISI</strong>.
        </p>
      </div>
    );
  }

  const tech = await prisma.technician.findUnique({
    where: { userId: session.id },
    include: { vendor: true },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">
          Profil Teknisi Saya
        </h1>
        {tech ? (
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <div>
              <strong>Nama Lengkap:</strong> {tech.fullName}
            </div>
            <div>
              <strong>Vendor Asal:</strong> {tech.vendor.name}
            </div>
            <div>
              <strong>Nomor WhatsApp:</strong> {tech.whatsapp}
            </div>
            <div>
              <strong>Keahlian:</strong> {tech.skills.join(", ")}
            </div>
            <div>
              <strong>Status Persetujuan Admin:</strong>{" "}
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-xs">
                {tech.approvalStatus}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 mt-2">
            Data profil teknisi belum ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}

