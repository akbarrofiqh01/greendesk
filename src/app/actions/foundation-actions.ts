"use server";

import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/auth";
import { assertPermission, validateStatusTransition } from "@/lib/permissions";
import {
  archiveReportById,
  updateAssetMasterData,
} from "@/lib/services/foundation";
import { saveUploadedPhoto } from "@/lib/storage";
import { sendReportStatusEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

/**
 * Mengubah data master Aset (mencatat riwayat perubahan otomatis di AuditLog).
 */
export async function updateAssetMasterAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) {
    return { error: "Sesi tidak ditemukan. Silakan login kembali." };
  }

  try {
    const assetId = formData.get("assetId") as string;
    const name = (formData.get("name") as string)?.trim();
    const locationNote = (formData.get("locationNote") as string)?.trim();
    const isActive = formData.get("isActive") === "true";

    await updateAssetMasterData(session, assetId, {
      name,
      locationNote,
      isActive,
    });

    revalidatePath("/dashboard/wilayah");
    revalidatePath("/dashboard/audit");
    revalidatePath("/dashboard/fondasi");

    return {
      success: true,
      message:
        "Data master aset berhasil diperbarui dan tercatat otomatis di Riwayat Perubahan (AuditLog)!",
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal memperbarui aset.",
    };
  }
}

/**
 * Menguji unggah foto ke penyimpanan lokal (`public/uploads`) di Fase 0.
 */
export async function testPhotoUploadAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) {
    return { error: "Silakan login terlebih dahulu." };
  }

  try {
    const file = formData.get("photo") as File | null;
    if (!file || file.size === 0) {
      return { error: "Pilih file foto terlebih dahulu." };
    }

    const uploaded = await saveUploadedPhoto(file, "reports");
    revalidatePath("/dashboard/fondasi");

    return {
      success: true,
      url: uploaded.url,
      fileName: uploaded.fileName,
      sizeBytes: uploaded.sizeBytes,
      message: `Foto berhasil disimpan di ${uploaded.url}`,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal mengunggah foto.",
    };
  }
}

/**
 * Menguji pengiriman email transaksional ke pelapor (tersimpan di EmailLog).
 */
export async function testSendNotificationEmailAction() {
  const session = await getCurrentSession();
  if (!session) {
    return { error: "Silakan login terlebih dahulu." };
  }

  try {
    const emailLog = await sendReportStatusEmail({
      companyId: session.companyId ?? "",
      toEmail: session.email,
      reporterName: session.name,
      ticketNo: "TKT-202611-0001",
      assetName: "Lampu Taman Solar LED #01",
      triggerType: "VALID_MENUNGGU_KEPUTUSAN",
    });

    revalidatePath("/dashboard/fondasi");
    return {
      success: true,
      message: `Email notifikasi terkirim ke ${emailLog.toEmail} (ID Log: ${emailLog.id})`,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal mengirim email.",
    };
  }
}

/**
 * Mengarsipkan laporan (soft archive menggunakan archivedAt).
 */
export async function archiveReportAction(reportId: string) {
  const session = await getCurrentSession();
  if (!session) {
    return { error: "Silakan login terlebih dahulu." };
  }

  try {
    await archiveReportById(session, reportId);
    revalidatePath("/dashboard/laporan");
    revalidatePath("/dashboard/audit");
    revalidatePath("/dashboard/fondasi");
    return {
      success: true,
      message: "Laporan berhasil diarsipkan (archivedAt terisi, tidak dihapus permanen).",
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal mengarsipkan laporan.",
    };
  }
}

/**
 * Memulihkan laporan dari arsip (khusus untuk kemudahan pengujian di Fase 0).
 */
export async function restoreArchivedReportAction(reportId: string) {
  const session = await getCurrentSession();
  if (!session) {
    return { error: "Silakan login terlebih dahulu." };
  }

  try {
    assertPermission(session.role, "ARCHIVE_REPORT");
    await prisma.report.update({
      where: { id: reportId },
      data: { archivedAt: null },
    });
    revalidatePath("/dashboard/laporan");
    revalidatePath("/dashboard/fondasi");
    return {
      success: true,
      message: "Laporan berhasil dikembalikan dari arsip.",
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal memulihkan laporan.",
    };
  }
}

/**
 * Simulasi pengujian keamanan & aturan bisnis Fase 0:
 * 1. Coba hapus laporan secara permanen (`prisma.report.delete`) -> harus ditolak!
 * 2. Coba ubah/hapus AuditLog (`prisma.auditLog.deleteMany`) -> harus ditolak!
 * 3. Coba verifikasi laporan menggunakan role saat ini -> hanya PENGELOLA yang diizinkan!
 * 4. Coba buat SPK menggunakan role saat ini -> hanya MANAGER yang diizinkan!
 */
export async function runSecurityGuardSimulationAction(
  testType:
    | "HARD_DELETE_REPORT"
    | "TAMPER_AUDIT_LOG"
    | "VERIFY_REPORT_CHECK"
    | "CREATE_SPK_CHECK"
) {
  const session = await getCurrentSession();
  if (!session) {
    return { allowed: false, message: "Belum login." };
  }

  try {
    if (testType === "HARD_DELETE_REPORT") {
      await prisma.report.deleteMany({});
      return {
        allowed: true,
        message: "Bahaya: Laporan berhasil dihapus permanen!",
      };
    }

    if (testType === "TAMPER_AUDIT_LOG") {
      await prisma.auditLog.deleteMany({});
      return {
        allowed: true,
        message: "Bahaya: AuditLog berhasil dihapus!",
      };
    }

    if (testType === "VERIFY_REPORT_CHECK") {
      assertPermission(session.role, "VERIFY_AND_PRIORITIZE");
      const check = validateStatusTransition(
        "BARU",
        "MENUNGGU_KEPUTUSAN",
        session.role
      );
      if (!check.valid) throw new Error(check.error);
      return {
        allowed: true,
        message: `Role ${session.role} DIIZINKAN melakukan verifikasi & prioritas laporan.`,
      };
    }

    if (testType === "CREATE_SPK_CHECK") {
      assertPermission(session.role, "CREATE_SPK");
      const check = validateStatusTransition(
        "MENUNGGU_KEPUTUSAN",
        "DISETUJUI",
        session.role
      );
      if (!check.valid) throw new Error(check.error);
      return {
        allowed: true,
        message: `Role ${session.role} DIIZINKAN menyetujui perbaikan dan membuat SPK.`,
      };
    }

    return { allowed: false, message: "Tipe pengujian tidak dikenal." };
  } catch (err) {
    return {
      allowed: false,
      message:
        err instanceof Error
          ? err.message
          : "Aksi ditolak oleh sistem keamanan.",
    };
  }
}

