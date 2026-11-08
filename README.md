# GreenPark – Platform Manajemen Aset Taman

Platform web manajemen aset dan pelaporan kerusakan fasilitas taman berbasis QR untuk kawasan perumahan, cluster, dan komplek swasta.

## Fitur Utama (Fase 0 – Fondasi)

- **Arsitektur Multi-Perusahaan:** Pemisahan data antar perusahaan pengelola (`Company` → `Complex` → `Cluster` → `Park` → `Asset`).
- **Autentikasi & Manajemen Sesi:** Login menggunakan kata sandi atau kode OTP email (anti-enumerasi email) dengan sesi berdurasi 30 hari.
- **Matriks Hak Akses 7 Role:** `PENGGUNA`, `PENGELOLA`, `MANAGER`, `PIC_VENDOR`, `TEKNISI`, `ADMIN`, dan `OWNER` hanya melihat menu dan data sesuai cakupannya.
- **Auditabilitas Otomatis (`AuditLog`):** Setiap perubahan data master mencatat pelaku, waktu, nilai lama, dan nilai baru, serta diproteksi agar tidak dapat diubah atau dihapus.
- **Arsip Laporan (Tanpa Hapus Permanen):** Laporan menggunakan soft-archive (`archivedAt`) dan penghapusan permanen diblokir di tingkat Prisma Client Extension.
- **Penyimpanan Foto & Layanan Email:** Layanan penyimpanan foto dan pencatatan email transaksional.

## Persiapan & Instalasi

1. Salin berkas `.env.example` menjadi `.env` dan isi nilai variabel lingkungan sesuai konfigurasi lokal Anda:
   ```bash
   cp .env.example .env
   ```
2. Instal seluruh dependensi:
   ```bash
   npm install
   ```
3. Jalankan database lokal Prisma Postgres dan terapkan skema:
   ```bash
   npx prisma dev --name greenpark
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```
4. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
5. Jalankan pengujian otomatis:
   ```bash
   npm test
   ```
