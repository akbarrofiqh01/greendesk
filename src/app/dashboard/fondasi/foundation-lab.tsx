"use client";

import { useState, useTransition } from "react";
import {
  runSecurityGuardSimulationAction,
  testPhotoUploadAction,
  testSendNotificationEmailAction,
} from "@/app/actions/foundation-actions";

export function FoundationInteractiveLab({
  currentRole,
}: {
  currentRole: string;
}) {
  const [simResult, setSimResult] = useState<{
    allowed: boolean;
    message: string;
  } | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    url?: string;
    message?: string;
    error?: string;
  } | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSimulation(
    testType:
      | "HARD_DELETE_REPORT"
      | "TAMPER_AUDIT_LOG"
      | "VERIFY_REPORT_CHECK"
      | "CREATE_SPK_CHECK"
  ) {
    setSimResult(null);
    startTransition(async () => {
      const res = await runSecurityGuardSimulationAction(testType);
      setSimResult(res);
    });
  }

  function handlePhotoUpload(formData: FormData) {
    setUploadResult(null);
    startTransition(async () => {
      const res = await testPhotoUploadAction(formData);
      setUploadResult(res);
    });
  }

  function handleSendTestEmail() {
    setEmailMessage(null);
    startTransition(async () => {
      const res = await testSendNotificationEmailAction();
      if ("message" in res && res.message) {
        setEmailMessage(res.message);
      } else if ("error" in res && res.error) {
        setEmailMessage(`Gagal: ${res.error}`);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel 1: Simulator Penjaga Aturan Bisnis & Hak Akses */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            1. Uji Penjaga Otorisasi & Aturan Bisnis (Role Aktif: {currentRole})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Klik tombol di bawah untuk menguji proteksi tingkat servis & Prisma
            Client Extension sesuai PRD Fase 0.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSimulation("HARD_DELETE_REPORT")}
            className="p-3 text-left rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/70 transition cursor-pointer"
          >
            <div className="text-xs font-bold text-rose-900">
              Coba Hapus Permanen Laporan
            </div>
            <div className="text-[11px] text-rose-700 mt-0.5">
              Harus ditolak oleh Prisma Extension (wajib pakai arsip)
            </div>
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSimulation("TAMPER_AUDIT_LOG")}
            className="p-3 text-left rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/70 transition cursor-pointer"
          >
            <div className="text-xs font-bold text-rose-900">
              Coba Hapus Riwayat AuditLog
            </div>
            <div className="text-[11px] text-rose-700 mt-0.5">
              Harus ditolak (AuditLog tidak bisa diubah/dihapus role mana pun)
            </div>
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSimulation("VERIFY_REPORT_CHECK")}
            className="p-3 text-left rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100/70 transition cursor-pointer"
          >
            <div className="text-xs font-bold text-sky-900">
              Uji Aksi: Verifikasi Laporan
            </div>
            <div className="text-[11px] text-sky-700 mt-0.5">
              Hanya diizinkan untuk PENGELOLA (Admin ditolak!)
            </div>
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => handleSimulation("CREATE_SPK_CHECK")}
            className="p-3 text-left rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 transition cursor-pointer"
          >
            <div className="text-xs font-bold text-indigo-900">
              Uji Aksi: Setujui & Buat SPK
            </div>
            <div className="text-[11px] text-indigo-700 mt-0.5">
              Hanya diizinkan untuk MANAGER (Admin ditolak!)
            </div>
          </button>
        </div>

        {simResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-medium ${
              simResult.allowed
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-amber-50 border-amber-300 text-amber-950"
            }`}
          >
            <strong>Hasil Pemeriksaan Sistem:</strong> {simResult.message}
          </div>
        )}
      </div>

      {/* Panel 2: Uji Penyimpanan Foto & Layanan Email */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            2. Uji Penyimpanan Foto (`public/uploads`) & Layanan Email
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Unggah foto untuk menguji layanan penyimpanan Fase 0 dan kirim email
            notifikasi simulasi ke Email Outbox.
          </p>
        </div>

        <form action={handlePhotoUpload} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih File Foto (JPG/PNG/WebP, maks 5 MB)
            </label>
            <input
              type="file"
              name="photo"
              accept="image/jpeg,image/png,image/webp,image/gif"
              required
              className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            {isPending ? "Mengunggah..." : "Unggah Foto ke Storage"}
          </button>
        </form>

        {uploadResult && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            {uploadResult.error ? (
              <div className="text-rose-700 font-medium">
                {uploadResult.error}
              </div>
            ) : (
              <>
                <div className="text-emerald-800 font-semibold">
                  {uploadResult.message}
                </div>
                {uploadResult.url && (
                  <img
                    src={uploadResult.url}
                    alt="Preview Unggahan"
                    className="h-28 rounded-lg border border-slate-300 object-cover"
                  />
                )}
              </>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={handleSendTestEmail}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
          >
            Kirim Simulasi Email Notifikasi Laporan
          </button>
          {emailMessage && (
            <span className="text-xs text-emerald-700 font-medium">
              {emailMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

