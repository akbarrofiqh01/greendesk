import { describe, expect, it } from "vitest";
import { prisma } from "../prisma";
import {
  getScopedReportsForUser,
  updateAssetMasterData,
} from "../services/foundation";

describe("Fase 0 – Pengujian Integrasi Database & Layanan Fondasi", () => {
  it("menolak penghapusan permanen laporan (Report)", async () => {
    await expect(prisma.report.deleteMany({})).rejects.toThrow(
      /Laporan tidak dapat dihapus permanen/
    );
  });

  it("menolak perubahan atau penghapusan Riwayat Perubahan Data (AuditLog)", async () => {
    await expect(prisma.auditLog.deleteMany({})).rejects.toThrow(
      /AuditLog.*tidak bisa dihapus/
    );
    await expect(
      prisma.auditLog.updateMany({ data: { summary: "Manipulasi" } })
    ).rejects.toThrow(/AuditLog.*tidak bisa diubah/);
  });

  it("mencatat nilai lama & baru ke AuditLog saat Admin mengubah data master aset", async () => {
    const admin = await prisma.user.findUniqueOrThrow({
      where: { email: "admin@greenpark.id" },
      include: { company: true },
    });
    const asset = await prisma.asset.findUniqueOrThrow({
      where: { code: "AST-BGV-001" },
    });

    const beforeCount = await prisma.auditLog.count({
      where: { entityName: "Asset", entityId: asset.id },
    });

    await updateAssetMasterData(
      {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        companyId: admin.companyId,
        companyName: admin.company?.name ?? null,
        staffClusterId: admin.staffClusterId,
      },
      asset.id,
      {
        locationNote: "Sudut Utara Gazebo Bougenville (Terverifikasi Fase 0)",
      }
    );

    const afterCount = await prisma.auditLog.count({
      where: { entityName: "Asset", entityId: asset.id },
    });

    expect(afterCount).toBe(beforeCount + 1);
  });

  it("menyembunyikan identitas pelapor dari query Teknisi & memisahkan data antar Cluster/Perusahaan", async () => {
    const teknisi = await prisma.user.findUniqueOrThrow({
      where: { email: "teknisi.budi@vendorjaya.id" },
    });
    const techReports = await getScopedReportsForUser({
      id: teknisi.id,
      name: teknisi.name,
      email: teknisi.email,
      role: teknisi.role,
      companyId: teknisi.companyId,
      companyName: null,
      staffClusterId: null,
    });

    expect(techReports.length).toBeGreaterThan(0);
    // Pastikan field reporter tidak pernah ada di objek hasil query Teknisi
    expect("reporter" in techReports[0]).toBe(false);

    // Pengelola Bougenville hanya melihat laporan di Cluster Bougenville (bukan Edelweiss)
    const pengelola = await prisma.user.findUniqueOrThrow({
      where: { email: "pengelola.bgv@greenpark.id" },
    });
    const pengelolaReports = await getScopedReportsForUser({
      id: pengelola.id,
      name: pengelola.name,
      email: pengelola.email,
      role: pengelola.role,
      companyId: pengelola.companyId,
      companyName: null,
      staffClusterId: pengelola.staffClusterId,
    });
    expect(
      pengelolaReports.every(
        (r) => r.asset.park.cluster.name === "Cluster Bougenville"
      )
    ).toBe(true);

    // Admin Perusahaan B tidak boleh melihat laporan Perusahaan A
    const adminB = await prisma.user.findUniqueOrThrow({
      where: { email: "admin@griyaasri.id" },
    });
    const companyBReports = await getScopedReportsForUser({
      id: adminB.id,
      name: adminB.name,
      email: adminB.email,
      role: adminB.role,
      companyId: adminB.companyId,
      companyName: null,
      staffClusterId: null,
    });
    expect(companyBReports.length).toBe(0);
  });
});

