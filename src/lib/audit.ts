import type { AuditAction, Prisma, Role } from "@prisma/client";
import { prisma } from "./prisma";
import { assertPermission } from "./permissions";

export interface AuditActor {
  id: string;
  name: string;
  role: Role;
  companyId?: string | null;
}

export interface RecordAuditParams {
  actor: AuditActor;
  entityName: string;
  entityId: string;
  action: AuditAction;
  summary: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  companyId?: string | null;
}

/**
 * Mencatat perubahan data master ke tabel AuditLog (siapa, apa, kapan, nilai lama dan baru).
 * Sesuai PRD Bagian 11: Riwayat perubahan tidak bisa diubah atau dihapus oleh role mana pun.
 */
export async function recordAuditLog(params: RecordAuditParams) {
  const {
    actor,
    entityName,
    entityId,
    action,
    summary,
    oldValues,
    newValues,
    companyId,
  } = params;

  return prisma.auditLog.create({
    data: {
      companyId: companyId ?? actor.companyId ?? null,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      entityName,
      entityId,
      action,
      summary,
      oldValues: oldValues
        ? (JSON.parse(JSON.stringify(oldValues)) as Prisma.InputJsonValue)
        : undefined,
      newValues: newValues
        ? (JSON.parse(JSON.stringify(newValues)) as Prisma.InputJsonValue)
        : undefined,
    },
  });
}

/**
 * Mengambil riwayat perubahan data untuk perusahaan terkait.
 * Hanya bisa diakses oleh role ADMIN dan OWNER sesuai matriks hak akses.
 */
export async function getCompanyAuditLogs(actor: AuditActor, limit = 50) {
  assertPermission(actor.role, "VIEW_AUDIT_LOGS");

  if (!actor.companyId) {
    throw new Error("Akses ditolak: Akun tidak terhubung ke perusahaan.");
  }

  return prisma.auditLog.findMany({
    where: {
      companyId: actor.companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}

