import { PrismaClient } from "@prisma/client";

function createExtendedPrismaClient() {
  const baseClient = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  return baseClient.$extends({
    name: "greenpark-security-and-archive-rules",
    query: {
      report: {
        async delete() {
          throw new Error(
            "Pelanggaran Aturan Bisnis: Laporan tidak dapat dihapus permanen. Gunakan pengarsipan (archivedAt)."
          );
        },
        async deleteMany() {
          throw new Error(
            "Pelanggaran Aturan Bisnis: Laporan tidak dapat dihapus permanen. Gunakan pengarsipan (archivedAt)."
          );
        },
        async findMany({ args, query }) {
          args.where = {
            archivedAt: null,
            ...args.where,
          };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = {
            archivedAt: null,
            ...args.where,
          };
          return query(args);
        },
        async count({ args, query }) {
          args.where = {
            archivedAt: null,
            ...args.where,
          };
          return query(args);
        },
      },
      auditLog: {
        async update() {
          throw new Error(
            "Pelanggaran Auditabilitas: Riwayat perubahan (AuditLog) bersifat tetap dan tidak bisa diubah oleh role mana pun."
          );
        },
        async updateMany() {
          throw new Error(
            "Pelanggaran Auditabilitas: Riwayat perubahan (AuditLog) bersifat tetap dan tidak bisa diubah oleh role mana pun."
          );
        },
        async delete() {
          throw new Error(
            "Pelanggaran Auditabilitas: Riwayat perubahan (AuditLog) tidak bisa dihapus oleh role mana pun."
          );
        },
        async deleteMany() {
          throw new Error(
            "Pelanggaran Auditabilitas: Riwayat perubahan (AuditLog) tidak bisa dihapus oleh role mana pun."
          );
        },
      },
    },
  });
}

type ExtendedPrismaClient = ReturnType<typeof createExtendedPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createExtendedPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

