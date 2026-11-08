# PRD – Platform Manajemen Aset Taman

Disusun dari dokumen Proses Bisnis (1 Nov 2026, Arfin Mardiyanto) · Versi 0.1 (draft untuk disepakati)

## 1. Ringkasan produk

Platform web yang memangkas jalur laporan kerusakan fasilitas taman dari warga ke pengelola menjadi satu langkah: **scan QR di aset → isi form → kirim**. Laporan lalu diverifikasi pengelola, diputuskan manager, dikerjakan vendor, dan pelapor mendapat email di setiap tahap sampai perbaikan selesai.

**Target pasar awal:** perumahan, cluster, dan komplek swasta (pengambil keputusan jelas: developer/estate management; ada dana pengelolaan dari iuran warga). Instansi pemerintah tidak dijadikan pasar awal karena pengadaan panjang dan birokratis.

## 2. Masalah dan sasaran

**Masalah.** Warga melihat kerusakan tetapi tidak tahu harus melapor ke siapa; prosesnya ribet sehingga kerusakan dibiarkan atau hanya dikeluhkan di grup chat tanpa tindak lanjut.

**Sasaran produk**

1. Pelaporan semudah mungkin (tanpa login di awal, aset dan lokasi terisi otomatis).
2. Setiap laporan punya alur, penanggung jawab, dan jejak yang jelas.
3. Pelapor selalu tahu status laporannya (email di tiap keputusan).
4. Manager dan Owner punya visibilitas dan bahan audit (SPK, rapor vendor, riwayat perubahan).

**Metrik keberhasilan (usulan, perlu disepakati angkanya)**

- Waktu dari scan QR sampai laporan terkirim.
- Persentase laporan yang diverifikasi pengelola dan jumlah hari rata-rata per tahap.
- Waktu rata-rata dari laporan sampai Selesai.
- Persentase laporan ganda yang berhasil digabung dan persentase laporan Tidak Valid.
- Jumlah perbaikan ulang dan pekerjaan rusak lagi dalam masa garansi.
- Jumlah cluster dan aset aktif ber-QR.

## 3. Ruang lingkup

**Di dalam sistem**

- Laporan kerusakan lewat QR dan input manual (dashboard)
- Verifikasi laporan dan penentuan prioritas
- Keputusan perbaikan (setuju/tolak)
- Penugasan vendor dan teknisi lewat SPK
- Bukti foto sebelum dan sesudah perbaikan
- Notifikasi email ke pelapor dan notifikasi di web untuk tim internal
- Pengelolaan data wilayah, aset, akun, dan vendor

**Di luar sistem (non-goals)**

- Perawatan rutin dan jadwal piket pengelola
- Anggaran perawatan dan persetujuan biaya
- Biaya, material, dan kendala teknis vendor
- Pemilihan vendor dan penandatanganan kontrak
- Penanganan darurat (pengelola langsung menghubungi manager)
- Batas waktu (SLA) per tahap; dashboard hanya menampilkan lama laporan di tahap saat ini
- Notifikasi WhatsApp atau push

**Ditunda ke tahap berikutnya:** desain tampilan (wireframe per role), model bisnis dan harga, kebijakan privasi sesuai UU Pelindungan Data Pribadi.

## 4. Pengguna dan role

Ada tujuh role. Admin dan Manager sejajar di tingkat perusahaan dan tidak saling membawahi: Admin memegang data dan akses, Manager memegang keputusan perbaikan. Tim internal pengelola diperlakukan sebagai satu vendor, dengan supervisor teknisi sebagai PIC.

| Role | Cakupan | Tugas utama | Akun dibuat oleh |
| --- | --- | --- | --- |
| Pengguna | Semua aset | Melapor, memantau status, membatalkan sebelum diverifikasi | Daftar sendiri (Google/email) |
| Pengelola | Satu cluster (boleh >1 orang) | Verifikasi, prioritas, gabung laporan ganda, teruskan ke manager | Admin |
| Manager | Satu/beberapa cluster (ditautkan Admin) | Setuju/tolak, buat SPK, konfirmasi hasil | Admin |
| PIC Vendor | Perusahaan vendornya | Terima SPK, tunjuk teknisi, kelola data teknisi | Admin |
| Teknisi | SPK yang ditugaskan | Kerjakan perbaikan, unggah foto sebelum/sesudah | PIC Vendor, aktif setelah disetujui Admin |
| Admin | Satu perusahaan, semua cluster | Kelola wilayah, aset, QR, kategori, akun internal, vendor; setujui teknisi; blokir pengguna | Pemilik platform |
| Owner/Direksi | Satu perusahaan, semua cluster | Pantau ringkasan semua cluster dan riwayat perubahan | Pemilik platform |

### Matriks hak akses

Admin **tidak** dapat memverifikasi laporan, memutuskan perbaikan, menugaskan vendor, mengubah isi laporan, atau menghapus laporan permanen.

| Fitur | Pengguna | Pengelola | Manager | PIC Vendor | Teknisi | Admin | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Membuat laporan | Ya | – | – | – | – | – | – |
| Melihat laporan | Milik sendiri | Cluster sendiri | Cluster tertaut | SPK vendornya | SPK sendiri | Semua (lihat) | Semua (lihat) |
| Verifikasi dan prioritas | – | Ya | – | – | – | – | – |
| Setuju/tolak perbaikan | – | – | Ya | – | – | – | – |
| Membuat SPK | – | – | Ya | – | – | – | – |
| Menunjuk teknisi | – | – | – | Ya | – | – | – |
| Mengisi hasil kerja | – | – | – | – | Ya | – | – |
| Konfirmasi selesai | – | – | Ya | – | – | – | – |
| Data wilayah, aset, QR, kategori | – | Lihat | Lihat | – | – | Kelola | Lihat |
| Data vendor | – | – | Lihat | Lihat (miliknya) | – | Kelola | Lihat |
| Data teknisi | – | – | Lihat | Kelola (miliknya) | Profil sendiri | Setujui/nonaktifkan | Lihat |
| Akun internal | – | – | – | – | – | Kelola | – |
| Blokir akun pengguna | – | – | – | – | – | Ya | – |
| Riwayat perubahan data | – | – | – | – | – | Lihat | Lihat |

## 5. Struktur wilayah

Lima tingkat: **Perusahaan pengelola → Komplek/Perumahan → Cluster → Taman → Aset.** Admin dan Owner bekerja di tingkat perusahaan; Manager ditautkan ke satu atau beberapa cluster; Pengelola ke satu cluster; Pengguna melapor per aset. Vendor bekerja lintas cluster sesuai area layanan yang tercatat di data vendor.

## 6. Rencana pengembangan step by step

Urutan dibuat mengikuti ketergantungan: data master harus ada dulu sebelum laporan bisa dibuat, dan laporan harus ada sebelum bisa diverifikasi, diputuskan, dan dikerjakan. Setiap fase menghasilkan sesuatu yang bisa diuji.

### Fase 0 – Fondasi

**Tujuan:** kerangka sistem siap untuk fitur berikutnya.

- Arsitektur multi-perusahaan (data terpisah per perusahaan klien).
- Autentikasi, manajemen sesi, dan mekanisme role/izin sesuai matriks di atas.
- Riwayat perubahan data (siapa, apa, kapan, nilai lama dan baru) sebagai layanan bersama.
- Penyimpanan foto dan layanan email.
- Arsip laporan (tidak ada hapus permanen).

**Kriteria selesai:** semua role bisa login dan hanya melihat menu sesuai haknya; setiap perubahan data master tercatat di riwayat.

### Fase 1 – Data master dan akun internal

**Tujuan:** Admin dapat menyiapkan seluruh data yang dibutuhkan agar laporan bisa masuk.

**User story**

- Sebagai Admin, saya mengelola Komplek, Cluster, Taman, dan Aset (kode aset, nama, kategori, taman, titik lokasi, foto, tanggal pasang, aktif/nonaktif).
- Sebagai Admin, saya mengelola Kategori aset dan jenis kerusakan.
- Sebagai Admin, saya membuat akun Manager (tautkan ke satu/lebih cluster) dan akun Pengelola (tautkan ke satu cluster).
- Sebagai Admin, saya menunjuk manager pengganti sementara saat manager berhalangan, dan penunjukan itu tercatat di riwayat.
- Sebagai pemilik platform, saya membuat akun Admin dan Owner/Direksi atas permintaan resmi perusahaan klien.
- Sebagai Admin, saya membuat QR per aset (tautan pendek ke form laporan; kode aset tercetak di bawah QR) dan mencetaknya.

**Kriteria penerimaan**

- Hierarki lima tingkat tidak bisa rusak (aset wajib punya taman, taman wajib punya cluster, dan seterusnya).
- QR dibuat otomatis dari kode aset dan membuka form untuk aset yang benar.
- Aset nonaktif tidak bisa dilaporkan (perlu dikonfirmasi, lihat pertanyaan terbuka).

### Fase 2 – Onboarding vendor dan teknisi

**Tujuan:** vendor dan teknisi siap menerima SPK.

**User story**

- Sebagai Admin, saya menginput data vendor (nama, jenis internal/eksternal, keahlian, PIC, area layanan per cluster, skema kerja sama, masa kontrak, masa garansi pekerjaan, alamat, NPWP) dan membuat akun PIC.
- Sebagai PIC Vendor, saya menerima email undangan dan mengaktifkan akun.
- Sebagai PIC Vendor, saya mendaftarkan teknisi (nama lengkap, WA, email, foto wajah, keahlian) dan mengelola statusnya (aktif/cuti/nonaktif).
- Sebagai Admin, saya menyetujui teknisi; akun baru aktif hanya setelah disetujui.
- Sebagai sistem, saya menonaktifkan teknisi yang tidak login atau tidak mendapat tugas selama 60 hari, dan setiap 3 bulan meminta PIC mengonfirmasi daftar teknisinya.

**Kriteria penerimaan**

- Teknisi belum disetujui tidak bisa login atau ditunjuk ke SPK.
- Notifikasi web ke Admin muncul saat ada teknisi baru menunggu persetujuan.

### Fase 3 – Autentikasi pengguna dan pelaporan (MVP inti)

**Tujuan:** warga bisa melapor lewat QR atau dashboard.

**User story**

- Sebagai pengguna, saya login dengan Google, atau daftar/login dengan email (nama + email, verifikasi OTP ke email).
- Sebagai pengguna, saya memindai QR dan form terbuka dengan aset dan lokasi sudah terisi; saya juga melihat laporan aktif untuk aset itu sehingga tidak perlu melapor ulang.
- Sebagai pengguna, saya mengisi form (minimal satu foto dan deskripsi singkat) tanpa harus login dulu.
- Sebagai pengguna yang belum login, isi form dan foto disimpan sebagai draft, lalu saya diberi tiga pilihan (Lanjut dengan Google, Masuk, Daftar); setelah berhasil, draft dipulihkan dan laporan terkirim otomatis.
- Sebagai pengguna, saya melapor lewat dashboard dengan memilih aset secara manual.
- Sebagai pengguna, saya melihat riwayat dan status laporan saya, serta membatalkannya selama status Baru.
- Sebagai pengguna, saya menyetujui penggunaan data pribadi saat mendaftar.

**Kriteria penerimaan**

- Laporan tanpa foto atau tanpa deskripsi ditolak oleh form.
- Setelah terkirim: status Baru, nomor tiket dibuat, email laporan diterima dikirim.
- Sistem tidak memperlihatkan apakah suatu email sudah terdaftar.
- Sesi login panjang (usulan 30 hari).
- Jumlah laporan per akun per hari dibatasi (angka batas perlu ditentukan).
- Pembatalan hanya bisa saat status Baru; setelahnya status Dibatalkan dan email konfirmasi terkirim.

### Fase 4 – Verifikasi pengelola

**Tujuan:** laporan disaring dan diprioritaskan sebelum sampai ke manager.

**User story**

- Sebagai Pengelola, saya melihat antrean laporan Baru di cluster saya, beserta indikator berapa hari laporan sudah di tahap ini.
- Sebagai Pengelola, saya menandai laporan Tidak Valid dengan alasan wajib; alasan dikirim ke email pelapor.
- Sebagai Pengelola, saya menggabungkan laporan yang sama untuk aset yang sama; semua pelapor menerima kabar dari laporan induk.
- Sebagai Pengelola, saya menyatakan laporan Valid, menetapkan prioritas (usulan: Tinggi, Normal, Rendah), lalu meneruskan ke manager; status Menunggu Keputusan dan email laporan terverifikasi terkirim.

**Kriteria penerimaan**

- Hanya pengelola cluster terkait yang dapat memverifikasi.
- Pengguna tidak memilih prioritas.
- Laporan Tidak Valid dan Digabung adalah status akhir.
- Rekam jejak laporan valid/tidak valid per akun pengguna bertambah.

### Fase 5 – Keputusan manager dan SPK

**Tujuan:** laporan valid berubah menjadi penugasan resmi ke vendor.

**User story**

- Sebagai Manager, saya melihat antrean laporan Menunggu Keputusan, diurutkan menurut prioritas.
- Sebagai Manager, saya menolak perbaikan dengan alasan wajib (misalnya menunggu waktu atau anggaran); alasan dikirim ke email pelapor.
- Sebagai Manager, saya menyetujui perbaikan lalu membuat SPK ke vendor; status Disetujui dan email ke pelapor terkirim.
- Sebagai PIC Vendor, saya menerima notifikasi SPK baru.

**Kriteria penerimaan**

- Keputusan hanya Setuju atau Tolak.
- SPK memuat nomor SPK, laporan terkait, dan vendor; vendor yang dipilih sesuai area layanan cluster laporan.
- Manager hanya melihat laporan dari cluster yang ditautkan kepadanya (termasuk manager pengganti sementara selama penunjukan berlaku).

### Fase 6 – Pengerjaan dan konfirmasi

**Tujuan:** perbaikan dikerjakan dan hasilnya dikonfirmasi.

**User story**

- Sebagai PIC Vendor, saya menunjuk teknisi untuk SPK; status Dikerjakan dan email ke pelapor terkirim.
- Sebagai Teknisi, saya hanya melihat SPK yang ditugaskan kepada saya, tanpa nama dan email pelapor.
- Sebagai Teknisi, saya mengunggah foto sebelum dan sesudah perbaikan lalu menandai selesai; status Menunggu Konfirmasi.
- Sebagai Manager, saya mengecek hasil dari foto. Bila belum sesuai, laporan kembali ke teknisi dengan catatan (status Dikerjakan). Bila sesuai, saya konfirmasi Selesai.
- Sebagai pelapor, saya menerima email Selesai beserta foto hasil perbaikan.

**Kriteria penerimaan**

- Foto sebelum dan sesudah wajib sebelum teknisi bisa menandai selesai.
- Catatan perbaikan ulang tersimpan di SPK dan jumlahnya masuk rapor vendor.
- Jika aset yang sama rusak lagi dalam masa garansi vendor, laporan baru ditandai "masih dalam garansi vendor" terkait.

### Fase 7 – Notifikasi, dashboard, dan pelaporan manajemen

**Tujuan:** semua pihak tahu apa yang harus dikerjakan, dan manajemen bisa memantau.

**User story**

- Sebagai pengguna internal, saya melihat penanda jumlah tugas baru di menu dan halaman pertama setelah login langsung menampilkan tugas yang belum ditangani.
- Sebagai Owner/Direksi, saya melihat ringkasan semua cluster dan riwayat perubahan data.
- Sebagai Manager/Admin, saya melihat rapor vendor yang dihitung otomatis dari SPK.
- Sebagai Admin, saya memblokir akun pengguna yang terbukti menyalahgunakan sistem, dengan rekam jejak laporan valid/tidak valid sebagai dasar.

**Kriteria penerimaan**

- Semua pemicu notifikasi pada bagian 9 berjalan.
- Rapor vendor menampilkan jumlah pekerjaan, rata-rata lama pengerjaan, jumlah perbaikan ulang, dan pekerjaan yang rusak lagi dalam masa garansi.

## 7. Alur status laporan

Sepuluh status; lima di antaranya status akhir.

| Status | Arti | Diubah oleh | Status berikutnya |
| --- | --- | --- | --- |
| Baru | Terkirim, menunggu verifikasi | Pengguna (saat submit) | Dibatalkan, Digabung, Tidak Valid, Menunggu Keputusan |
| Dibatalkan | Ditarik pelapor | Pengguna | Akhir |
| Digabung | Sama dengan laporan lain untuk aset yang sama | Pengelola | Akhir (ikut kabar laporan induk) |
| Tidak Valid | Tidak sesuai kenyataan, ada alasan | Pengelola | Akhir |
| Menunggu Keputusan | Valid, prioritas ditetapkan, diteruskan | Pengelola | Ditolak, Disetujui |
| Ditolak | Manager tidak melanjutkan, ada alasan | Manager | Akhir |
| Disetujui | SPK dibuat, menunggu penunjukan teknisi | Manager | Dikerjakan |
| Dikerjakan | Teknisi ditunjuk dan menangani | PIC Vendor | Menunggu Konfirmasi |
| Menunggu Konfirmasi | Teknisi lapor selesai dengan foto sesudah | Teknisi | Selesai, Dikerjakan (perbaikan ulang) |
| Selesai | Hasil dikonfirmasi manager | Manager | Akhir |

## 8. Aturan bisnis

**Pelaporan**

1. Siapa pun boleh melapor (warga maupun pengunjung).
2. Wajib minimal satu foto dan deskripsi singkat.
3. Lewat QR, aset dan lokasi terisi otomatis; lewat dashboard, aset dipilih manual.
4. Saat QR dipindai, laporan aktif untuk aset tersebut ditampilkan; pengguna tetap boleh melapor bila kerusakannya berbeda.
5. Usulan: saat QR dipindai, tampilkan juga penolakan terakhir untuk aset itu beserta alasannya (misalnya 30 hari terakhir).
6. Pembatalan hanya saat status Baru.
7. Jumlah laporan per akun per hari dibatasi.

**Verifikasi dan keputusan**

1. Hanya pengelola cluster terkait yang memverifikasi.
2. Tidak Valid wajib beralasan, dan alasan dikirim ke pelapor.
3. Prioritas ditentukan pengelola, bukan pengguna.
4. Laporan untuk aset yang sama dapat digabung; semua pelapor menerima kabar laporan induk.
5. Keputusan manager hanya Setuju atau Tolak; penolakan wajib beralasan dan dikirim ke pelapor.
6. Tidak ada batas waktu per tahap; dashboard hanya menampilkan lama laporan di tahap saat ini.

**Pengerjaan**

1. Manager menugaskan via SPK; PIC vendor menunjuk teknisi.
2. Teknisi hanya melihat SPK miliknya dan tidak melihat identitas pelapor.
3. Foto sebelum dan sesudah wajib.
4. Hasil dicek manager dari foto; pekerjaan bermasalah diaudit lewat data SPK dan rapor vendor.
5. Setelah konfirmasi selesai, email ke pelapor beserta foto hasil.
6. Aset rusak lagi dalam masa garansi vendor → laporan ditandai garansi vendor terkait.

**Data dan akun**

1. Laporan tidak dapat dihapus permanen, hanya diarsipkan.
2. Setiap perubahan data master tercatat (siapa, apa, kapan).
3. Akun yang menyalahgunakan sistem dapat diblokir Admin; sistem mencatat jumlah laporan valid dan tidak valid per akun.
4. Pengguna wajib menyetujui penggunaan data pribadi saat mendaftar.

## 9. Notifikasi

**Email ke pelapor** (selalu memuat nomor tiket dan tautan cek status)

| Pemicu | Isi |
| --- | --- |
| Laporan terkirim | Laporan diterima, nomor tiket, tautan cek status |
| Tidak Valid | Tidak dilanjutkan, beserta alasan pengelola |
| Digabung | Digabung dengan laporan lain; kabar berikutnya mengikuti laporan induk |
| Valid (Menunggu Keputusan) | Laporan terverifikasi dan akan segera ditindaklanjuti |
| Ditolak manager | Perbaikan belum dilanjutkan, beserta alasan |
| Disetujui | Perbaikan disetujui dan sedang dijadwalkan |
| Dikerjakan | Teknisi sedang menangani |
| Selesai | Aset diperbaiki, dilampiri foto hasil |
| Dibatalkan | Konfirmasi pembatalan |

**Notifikasi di web (tim internal)**

| Penerima | Pemicu |
| --- | --- |
| Pengelola | Laporan baru masuk di clusternya |
| Manager | Laporan valid diteruskan; teknisi melaporkan selesai |
| PIC Vendor | SPK baru diterima; permintaan konfirmasi daftar teknisi tiap 3 bulan |
| Teknisi | Ditunjuk untuk SPK; diminta perbaikan ulang oleh manager |
| Admin | Teknisi baru menunggu persetujuan |

## 10. Model data

| Entitas | Atribut utama | Diisi oleh |
| --- | --- | --- |
| Perusahaan | Nama, kontak | Pemilik platform |
| Komplek | Nama, alamat, perusahaan induk | Admin |
| Cluster | Nama, komplek induk | Admin |
| Taman | Nama, cluster induk, keterangan lokasi | Admin |
| Aset | Kode aset, nama, kategori, taman, titik lokasi, foto, tanggal pasang, aktif/nonaktif | Admin |
| QR | Tautan pendek ke form aset; kode aset tercetak | Sistem, dicetak Admin |
| Kategori | Kategori aset, jenis kerusakan | Admin |
| Pengguna | Nama, email, metode login, status pelapor opsional (warga dengan blok/no. rumah atau pengunjung), persetujuan data, rekam jejak valid/tidak valid, status blokir | Pengguna; rekam jejak oleh sistem |
| Akun internal | Nama, email, role, cluster tertaut, status aktif | Admin |
| Vendor | Nama perusahaan, jenis, keahlian, PIC, area layanan, skema kerja sama, masa kontrak, masa garansi, alamat, NPWP | Admin |
| Teknisi | Nama, WA, email, foto wajah, vendor asal, keahlian, status, status persetujuan | PIC Vendor; persetujuan Admin |
| Laporan | Nomor tiket, aset, pelapor, saluran (QR/dashboard), foto, deskripsi, status, prioritas, alasan, laporan induk, tanggal tiap perubahan status | Pengguna, Pengelola, Manager |
| SPK | Nomor SPK, laporan, vendor, teknisi, tanggal tugas, foto sebelum/sesudah, catatan perbaikan ulang, tanggal selesai | Manager, PIC Vendor, Teknisi |
| Rapor vendor | Jumlah pekerjaan, rata-rata lama pengerjaan, jumlah perbaikan ulang, rusak lagi dalam garansi | Sistem (otomatis) |
| Riwayat perubahan | Pengguna pengubah, data, nilai lama/baru, waktu | Sistem |

## 11. Kebutuhan non-fungsional (usulan)

- **Mobile-first:** form laporan lewat QR harus ringan dan nyaman dipakai di ponsel, termasuk unggah foto dari kamera.
- **Keamanan dan privasi:** persetujuan data pribadi, identitas pelapor disembunyikan dari teknisi, akses data dibatasi per cluster/vendor, pencegahan enumerasi email.
- **Keandalan notifikasi:** email terkirim dengan antrean dan percobaan ulang; kegagalan kirim tercatat.
- **Auditabilitas:** riwayat perubahan tidak bisa diubah atau dihapus oleh role mana pun.
- **Anti-spam:** pembatasan laporan per akun per hari dan kemungkinan blokir akun.
- **Kepatuhan:** disesuaikan dengan UU Pelindungan Data Pribadi (dibahas di tahap berikutnya).

## 12. Celah dan pertanyaan terbuka

Hal-hal berikut belum dijawab dokumen proses bisnis dan sebaiknya diputuskan sebelum fase terkait dimulai.

1. **Batas laporan per hari:** berapa angkanya?
2. **Aset nonaktif:** apakah QR-nya masih bisa dipindai dan menerima laporan?
3. **SPK ditolak vendor:** belum ada alur bila PIC Vendor menolak atau tidak bisa mengerjakan SPK. Apakah manager membuat SPK ulang ke vendor lain?
4. **Pemilihan vendor di SPK:** apakah manager memilih bebas dari vendor yang area layanannya mencakup cluster, atau ada vendor default per kategori?
5. **Masa garansi:** dihitung dari tanggal Selesai? Apakah garansi per vendor atau per pekerjaan? Perlu aturan penandaan bila vendor sudah nonaktif.
6. **Laporan bukan laporan induk:** bagaimana pengelola memilih laporan induk, dan apa yang terjadi bila laporan induk Ditolak atau Tidak Valid (semua anak ikut)?
7. **Pengelola ganda dalam satu cluster:** apakah ada mekanisme klaim agar dua pengelola tidak memverifikasi laporan yang sama?
8. **Teknisi nonaktif/cuti saat SPK berjalan:** siapa menunjuk ulang?
9. **Perbaikan ulang berulang:** apakah ada batas jumlah perbaikan ulang atau eskalasi?
10. **Arsip:** siapa yang boleh mengarsipkan laporan dan kapan (otomatis setelah status akhir)?
11. **Rekam jejak pelapor:** ambang berapa laporan Tidak Valid sebelum akun layak ditinjau untuk diblokir? Apakah pelapor yang diblokir diberi tahu?
12. **Penggabungan lintas status:** apakah laporan hanya bisa digabung saat Baru, atau juga setelah Menunggu Keputusan/Disetujui?
13. **Kepemilikan data pelapor warga:** apakah blok/no. rumah wajib untuk warga, dan siapa yang boleh melihatnya?
14. **Usulan yang masih perlu disepakati:** tiga tingkat prioritas, tampilan penolakan terakhir (30 hari), dan sesi login 30 hari.

## 13. Prioritas rilis (usulan)

| Rilis | Fase | Hasil |
| --- | --- | --- |
| MVP | 0, 1, 3, 4, 5 (SPK dasar), 6 | Alur laporan end-to-end berjalan di satu cluster pilot, termasuk email pelapor |
| Rilis 2 | 2, 7 | Onboarding vendor/teknisi lengkap, rapor vendor, dashboard Owner |
| Rilis 3 | Tahap berikutnya | Wireframe final, model bisnis dan harga, kebijakan privasi UU PDP |

Catatan: untuk MVP pilot, vendor dan teknisi bisa dimasukkan manual oleh Admin lebih dulu, sehingga onboarding lengkap (Fase 2) menyusul di Rilis 2 tanpa menghambat alur utama.

## 14. Arsitektur dan tech stack

Keputusan yang sudah ditetapkan: aplikasi dibangun dengan **Next.js** dan **Prisma ORM**. Komponen lain di bawah ini adalah usulan default yang bisa diganti sesuai preferensi tim.

### 14.1 Ringkasan stack

| Lapisan | Pilihan | Alasan |
| --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript | Satu codebase untuk UI dan backend (Server Actions dan Route Handlers); cocok untuk web mobile-first |
| ORM | Prisma | Sesuai keputusan; skema bertipe dan migrasi terkelola |
| Database | PostgreSQL | Relasional, cocok untuk hierarki lima tingkat dan relasi role-cluster; didukung penuh Prisma |
| Autentikasi | Auth.js (NextAuth) | Provider Google dan login email dengan OTP; sesi panjang |
| Penyimpanan foto | Penyimpanan kompatibel S3 (mis. S3 atau Cloudflare R2) | Unggah langsung dari browser lewat presigned URL agar server tidak terbebani |
| Email | Layanan email transaksional (mis. Resend atau SMTP) | Email ke pelapor dan kode OTP |
| Job terjadwal | Cron terjadwal (mis. Vercel Cron atau pg-boss) | Nonaktifkan teknisi 60 hari, pengingat konfirmasi teknisi tiap 3 bulan, antrean dan retry email |
| UI | Tailwind CSS + shadcn/ui | Komponen cepat dibangun dan mudah disesuaikan |
| Form dan validasi | React Hook Form + Zod | Skema validasi yang sama dipakai di klien dan server |
| QR | Library pembuat QR (mis. `qrcode`) | Membuat QR dari tautan pendek dan kode aset |
| Pengujian | Vitest (unit) + Playwright (end-to-end) | Alur QR sampai Selesai bisa diuji otomatis |

### 14.2 Prinsip arsitektur

1. **Monolit modular.** Satu aplikasi Next.js dengan modul terpisah: wilayah dan aset, laporan, SPK, vendor dan teknisi, notifikasi, audit.
2. **Otorisasi di satu tempat.** Semua akses data lewat lapisan servis yang memeriksa role dan cakupan (cluster tertaut, vendor, SPK sendiri). Prisma tidak punya row-level security bawaan, jadi pemeriksaan ini tidak boleh tersebar di komponen UI.
3. **Multi-perusahaan.** Setiap tabel yang relevan membawa `companyId`, dan setiap query difilter oleh lapisan servis.
4. **Transisi status terpusat.** Satu fungsi memvalidasi perpindahan status sesuai tabel bagian 7 (siapa boleh mengubah dari status apa ke status apa), lalu menulis riwayat, memicu email, dan membuat notifikasi web dalam satu transaksi.
5. **Audit otomatis.** Riwayat perubahan data master ditulis lewat Prisma Client extension (atau middleware) sehingga tidak bergantung pada disiplin tiap developer.
6. **Tidak ada hapus permanen.** Laporan memakai kolom `archivedAt`; query default menyembunyikan data terarsip.

### 14.3 Rancangan awal skema Prisma

Contoh kerangka model inti (nama field bisa disesuaikan saat implementasi):

```prisma
enum Role { PENGGUNA PENGELOLA MANAGER PIC_VENDOR TEKNISI ADMIN OWNER }

enum ReportStatus {
  BARU DIBATALKAN DIGABUNG TIDAK_VALID MENUNGGU_KEPUTUSAN
  DITOLAK DISETUJUI DIKERJAKAN MENUNGGU_KONFIRMASI SELESAI
}

enum Priority { TINGGI NORMAL RENDAH }
enum Channel { QR DASHBOARD }

model Company  { id String @id  name String  complexes Complex[] }
model Complex  { id String @id  companyId String  name String  address String  clusters Cluster[] }
model Cluster  { id String @id  complexId String  name String  parks Park[] }
model Park     { id String @id  clusterId String  name String  locationNote String?  assets Asset[] }

model Asset {
  id String @id
  code String @unique
  parkId String
  categoryId String
  name String
  locationNote String?
  photoUrl String?
  installedAt DateTime?
  isActive Boolean @default(true)
  reports Report[]
}

model Report {
  id String @id
  ticketNo String @unique
  assetId String
  reporterId String
  channel Channel
  description String
  status ReportStatus @default(BARU)
  priority Priority?
  reason String?
  parentReportId String?
  underWarrantyOfVendorId String?
  archivedAt DateTime?
  createdAt DateTime @default(now())
  photos ReportPhoto[]
  statusLogs ReportStatusLog[]
  workOrder WorkOrder?
}

model WorkOrder {
  id String @id
  spkNo String @unique
  reportId String @unique
  vendorId String
  technicianId String?
  assignedAt DateTime?
  completedAt DateTime?
  revisionNotes RevisionNote[]
  photos WorkPhoto[]
}
```

Entitas lain (User, ClusterManager, ClusterStaff, Vendor, VendorServiceArea, Technician, Category, Notification, AuditLog) mengikuti model data di bagian 10.

### 14.4 Pemetaan fase PRD ke implementasi

| Fase | Implementasi utama |
| --- | --- |
| 0 Fondasi | Inisialisasi Next.js dan Prisma, koneksi PostgreSQL, Auth.js, lapisan otorisasi, Prisma extension untuk audit, penyimpanan foto dan layanan email |
| 1 Data master | Skema wilayah dan aset, halaman CRUD Admin, pembuatan QR dan halaman cetak, rute tautan pendek `/r/{kodeAset}` |
| 2 Vendor dan teknisi | Model Vendor dan Technician, undangan email PIC, alur persetujuan teknisi, cron 60 hari dan 3 bulan |
| 3 Pelaporan | Halaman form QR publik, draft di browser (IndexedDB) yang dipulihkan setelah login, kompresi foto sisi klien, rate limit per akun per hari |
| 4 Verifikasi | Antrean pengelola, aksi valid/tidak valid/gabung lewat Server Actions, fungsi transisi status |
| 5 Keputusan dan SPK | Antrean manager berurut prioritas, pembuatan SPK dan penomoran otomatis |
| 6 Pengerjaan | Tampilan teknisi (hanya SPK sendiri, tanpa data pelapor), unggah foto sebelum/sesudah, konfirmasi manager |
| 7 Notifikasi dan dashboard | Tabel Notification dan penanda jumlah tugas, antrean email dengan retry, rapor vendor dari query agregasi SPK |

### 14.5 Catatan teknis penting

- **Alur QR tanpa login:** form terbuka publik, tetapi pengiriman butuh sesi. Simpan draft (teks dan foto) di IndexedDB, bukan hanya state React, supaya aman dari pindah halaman saat login Google.
- **Anti-enumerasi email:** pesan respons pendaftaran dan login sama baik email sudah terdaftar maupun belum.
- **Privasi teknisi:** halaman dan API teknisi tidak boleh meng-select field pelapor sama sekali, bukan sekadar menyembunyikannya di UI.
- **Rapor vendor:** dihitung dengan query agregasi dari WorkOrder; cukup tanpa tabel tambahan di awal, dan dapat dipindah ke view atau tabel ringkasan bila lambat.
- **Hosting:** perlu diputuskan (mis. Vercel atau VPS dengan Docker). Pilihan ini memengaruhi cara menjalankan cron dan koneksi database (connection pooling untuk Prisma di lingkungan serverless).
- **Kapabilitas yang ditunda:** notifikasi WhatsApp dan push tidak masuk stack saat ini sesuai ruang lingkup bagian 3.

### 14.6 Pertanyaan terbuka khusus teknis

1. Hosting dan database terkelola apa yang akan dipakai?
2. Penyedia penyimpanan foto dan batas ukuran foto per laporan?
3. Penyedia email dan domain pengirim?
4. Apakah perlu PWA (instal di layar utama dan cache offline sederhana) pada MVP, atau cukup web biasa?
5. Strategi lingkungan dan deployment: berapa lingkungan (dev, staging, produksi) dan siapa yang mengelola migrasi Prisma?
