import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FoundationInteractiveLab } from "./foundation-lab";

const ACCESS_MATRIX_ROWS = [
  {
    feature: "Membuat laporan",
    PENGGUNA: "Ya",
    PENGELOLA: "–",
    MANAGER: "–",
    PIC_VENDOR: "–",
    TEKNISI: "–",
    ADMIN: "–",
    OWNER: "–",
  },
  {
    feature: "Melihat laporan",
    PENGGUNA: "Milik sendiri",
    PENGELOLA: "Cluster sendiri",
    MANAGER: "Cluster tertaut",
    PIC_VENDOR: "SPK vendornya",
    TEKNISI: "SPK sendiri",
    ADMIN: "Semua (lihat)",
    OWNER: "Semua (lihat)",
  },
  {
    feature: "Verifikasi dan prioritas",
    PENGGUNA: "–",
    PENGELOLA: "Ya",
    MANAGER: "–",
    PIC_VENDOR: "–",
    TEKNISI: "–",
    ADMIN: "–",
    OWNER: "–",
  },
  {
    feature: "Setuju/tolak perbaikan",
    PENGGUNA: "–",
    PENGELOLA: "–",
    MANAGER: "Ya",
    PIC_VENDOR: "–",
    TEKNISI: "–",
    ADMIN: "–",
    OWNER: "–",
  },
  {
    feature: "Membuat SPK",
    PENGGUNA: "–",
    PENGELOLA: "–",
    MANAGER: "Ya",
    PIC_VENDOR: "–",
    TEKNISI: "–",
    ADMIN: "–",
    OWNER: "–",
  },
  {
    feature: "Menunjuk teknisi",
    PENGGUNA: "–",
    PENGELOLA: "–",
    MANAGER: "–",
    PIC_VENDOR: "Ya",
    TEKNISI: "–",
    ADMIN: "–",
    OWNER: "–",
  },
  {
    feature: "Mengisi hasil kerja",
    PENGGUNA: "–",
    PENGELOLA: "–",
    MANAGER: "–",
    PIC_VENDOR: "–",
    TEKNISI: "Ya",
    ADMIN: "–",
    OWNER: "–",
  },
  {
    feature: "Konfirmasi selesai",
    PENGGUNA: "–",
    PENGELOLA: "–",
    MANAGER: "Ya",
    PIC_VENDOR: "–",
    TEKNISI: "–",
    ADMIN: "–",
    OWNER: "–",
  },
  {
    feature: "Data wilayah, aset, QR, kategori",
    PENGGUNA: "–",
    PENGELOLA: "Lihat",
    MANAGER: "Lihat",
    PIC_VENDOR: "–",
    TEKNISI: "–",
    ADMIN: "Kelola",
    OWNER: "Lihat",
  },
  {
    feature: "Data vendor",
    PENGGUNA: "–",
    PENGELOLA: "–",
    MANAGER: "Lihat",
    PIC_VENDOR: "Lihat (miliknya)",
    TEKNISI: "–",
    ADMIN: "Kelola",
    OWNER: "Lihat",
  },
  {
    feature: "Data teknisi",
    PENGGUNA: "–",
    PENGELOLA: "–",
    MANAGER: "Lihat",
    PIC_VENDOR: "Kelola (miliknya)",
    TEKNISI: "Profil sendiri",
    ADMIN: "Setujui/nonaktifkan",
    OWNER: "Lihat",
  },
  {
    feature: "Akun internal",
    PENGGUNA: "–",
    PENGELOLA: "–",
    MANAGER: "–",
    PIC_VENDOR: "–",
    TEKNISI: "–",
    ADMIN: "Kelola",
    OWNER: "–",
  },
  {
    feature: "Blokir akun pengguna",
    PENGGUNA: "–",
    PENGELOLA: "–",
    MANAGER: "–",
    PIC_VENDOR: "–",
    TEKNISI: "–",
    ADMIN: "Ya",
    OWNER: "–",
  },
  {
    feature: "Riwayat perubahan data",
    PENGGUNA: "–",
    PENGELOLA: "–",
    MANAGER: "–",
    PIC_VENDOR: "–",
    TEKNISI: "–",
    ADMIN: "Lihat",
    OWNER: "Lihat",
  },
];

export default async function FondasiVerificationPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  const emailLogs = await prisma.emailLog.findMany({
    where: session.companyId ? { companyId: session.companyId } : {},
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
          Laboratorium Pengujian Fase 0 – Fondasi
        </span>
        <h1 className="text-xl font-bold text-slate-900">
          Verifikasi Kriteria Selesai Fase 0
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Halaman ini memudahkan verifikasi seluruh komponen Fase 0: matriks hak
          akses 7 role, penjaga otorisasi, penyimpanan foto, layanan email, dan
          larangan hapus permanen.
        </p>
      </div>

      {/* Komponen Interaktif Uji Otorisasi, Foto & Email */}
      <FoundationInteractiveLab currentRole={session.role} />

      {/* Tabel Matriks Hak Akses (Bagian 4 PRD) dengan Highlight Role Aktif */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            3. Matriks Hak Akses 7 Role (PRD Bagian 4 – Kolom Role Aktif
            Disorot)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin TIDAK dapat memverifikasi laporan, memutuskan perbaikan,
            menugaskan vendor, mengubah isi laporan, atau menghapus laporan
            permanen.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                <th className="p-2.5 font-bold">Fitur</th>
                {(
                  [
                    "PENGGUNA",
                    "PENGELOLA",
                    "MANAGER",
                    "PIC_VENDOR",
                    "TEKNISI",
                    "ADMIN",
                    "OWNER",
                  ] as const
                ).map((r) => (
                  <th
                    key={r}
                    className={`p-2.5 font-bold ${
                      session.role === r
                        ? "bg-emerald-600 text-white"
                        : "text-slate-700"
                    }`}
                  >
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ACCESS_MATRIX_ROWS.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50">
                  <td className="p-2.5 font-semibold text-slate-900">
                    {row.feature}
                  </td>
                  {(
                    [
                      "PENGGUNA",
                      "PENGELOLA",
                      "MANAGER",
                      "PIC_VENDOR",
                      "TEKNISI",
                      "ADMIN",
                      "OWNER",
                    ] as const
                  ).map((r) => (
                    <td
                      key={r}
                      className={`p-2.5 ${
                        session.role === r
                          ? "bg-emerald-50 font-bold text-emerald-950"
                          : "text-slate-600"
                      }`}
                    >
                      {row[r]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel Email Outbox (Dev Log) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            4. Log Layanan Email Transaksional (`EmailLog` Outbox)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Setiap email status laporan dan kode OTP dicatat di sini selama mode
            pengembangan.
          </p>
        </div>

        <div className="space-y-3">
          {emailLogs.length === 0 ? (
            <div className="text-xs text-slate-500">
              Belum ada email keluar untuk perusahaan ini.
            </div>
          ) : (
            emailLogs.map((mail) => (
              <div
                key={mail.id}
                className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/60 text-xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {mail.triggerType}
                    </span>
                    <span className="font-semibold text-slate-900">
                      Ke: {mail.toEmail}
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono">
                    {new Date(mail.createdAt).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="font-bold text-slate-800">{mail.subject}</div>
                <div
                  className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200"
                  dangerouslySetInnerHTML={{ __html: mail.bodyHtml }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

