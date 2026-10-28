# Pendahuluan

{section:pendahuluan}

**Buku Panduan Pengguna SIM-Tren PPDNY (Sub-Sistem Administrator)** merupakan rujukan teknis operasional tingkat tertinggi bagi Administrator Sistem (*System Administrator / Superuser*) Pondok Pesantren Modern Darun-Na'im Yapia (PPDNY).

Sebagai pemegang otoritas teknis penuh, **Administrator** memikul mandat strategis dalam menjaga keandalan infrastruktur, kerahasiaan data pribadi sivitas akademika, kepatuhan tata kelola berbasis peran (*Role-Based Access Control / RBAC*), serta integritas transaksi di seluruh lingkungan pesantren:

* **Pusat Pengendali Sistem (Core System Hub)**: Memantau indikator operasional, status server, log audit aktivitas sistem, dan integritas basis data MySQL secara real-time.
* **Manajemen Pengguna & Otoritas Hak Akses**: Mengelola akun staf pondok, dewan pengajar, tim medis poskestren, dan dewan pimpinan, termasuk penugasan multi-role, aktivasi akun, dan perlindungan kredensial.
* **Manajemen Master Data Terpadu**: Mengontrol struktur data santri, wali santri, ustadz, rombongan belajar (kelas), dan kamar asrama untuk menjamin konsistensi di seluruh sub-sistem.
* **Tata Kelola Finansial & Master Layanan**: Mengonfigurasi master jenis perizinan, master pos tarif tagihan (SPP, makan, sarpras), serta mengaudit transaksi pembayaran keuangan santri.
* **Audit Trail & Keamanan Siber**: Memantau rekam jejak aktivitas (*Activity Logs*) untuk mendeteksi perubahan data ilegal, penyalahgunaan wewenang, atau anomali akses.
* **Kurasi Edukasi & Pengawasan PPDB**: Memoderasi materi edukasi kesehatan terintegrasi serta mengawasi kelancaran proses seleksi Penerimaan Santri Baru.

> [!important]
> Akun Administrator memiliki hak akses tak terbatas (*Unrestricted Superuser Rights*). Dilarang keras membagikan kredensial akun admin kepada siapa pun. Setiap tindakan yang dilakukan melalui akun administrator tercatat permanen dalam tabel log aktivitas audit.

---

# Pusat Kendali & Dashboard Administrator

{section:dashboard}

## 2.1 Antarmuka Utama & Metrik Eksekutif

Setelah masuk ke sistem dengan akun administrator, Anda akan disajikan **Pusat Kendali Administrator**:

![Dashboard Pusat Kendali Administrator](dashboard_utama_desktop.webp|dashboard_utama_mobile.webp)

Panel atas memuat indikator metrik sistem penting:
1. **Total Pengguna Aktif**: Akumulasi seluruh akun santri, wali, staf, ustadz, dan tenaga medis yang terdaftar di basis data.
2. **Total Staf Operasional**: Jumlah staf kependidikan dan pengurus yang mengoperasikan sistem administrasi.
3. **Log Aktivitas 24 Jam**: Frekuensi pencatatan aksi transaksi dan modifikasi data dalam 24 jam terakhir.
4. **Antrean Layanan & Pembayaran**: Jumlah transaksi dan permohonan santri yang membutuhkan audit pengurus.

---

# Manajemen Pengguna & Tata Kelola Hak Akses

{section:staf_rbac}

## 3.1 Manajemen Staf Pondok

Menu **"Manajemen Staf"** adalah pusat tata kelola sumber daya manusia dan akun operasional pesantren:

1. **Daftar Seluruh Staf**: Menampilkan NIP, Nama Lengkap, Peran Aktif (*Role*), Email Resmi, dan Status Akun (*Aktif/Nonaktif*).
2. **Tombol "+ Tambah Staf Baru"**:
   * Masukkan NIP resmi pondok, nama lengkap, nomor WhatsApp aktif, dan email.
   * Pilih peran yang diberikan (*Admin*, *Pimpinan*, *Pengurus*, *Ustadz*, atau *Tim Kesehatan*).
   * Sistem secara otomatis menginisialisasi kata sandi terenkripsi aman.
3. **Pemberian Hak Multi-Role**:
   * Untuk staf yang memiliki amanah ganda (misalnya Ustadz yang juga bertindak sebagai Pengurus Asrama), admin dapat memberikan lebih dari satu peran pada satu akun pengguna.

![Manajemen Staf & Hak Akses](staf_manajemen_desktop.webp|staf_manajemen_mobile.webp)

## 3.2 Pemblokiran Akun & Reset Kredensial

* **Nonaktifkan Akun**: Jika ada staf atau pegawai yang mutasi atau cuti panjang, ubah status keaktifan menjadi *Nonaktif* agar akses sistem langsung dicabut.
* **Reset Kata Sandi**: Fitur reset darurat jika petugas mengalami kendala lupa sandi atau terjadi insiden keamanan akun.

---

# Pengawasan Master Data Kependidikan

{section:master_data}

Administrator memastikan standarisasi penamaan dan keterhubungan relasi data antar entitas:

## 4.1 Master Data Santri

Menu **"Data Santri"** menyajikan direktori seluruh santri pondok:
* Memantau keabsahan NIS, kesesuaian rombel kelas, dan kamar asrama santriwan/santriwati.
* Administrator dapat mengimpor data massal atau memperbaiki kesalahan penulisan data biodata santri.

![Master Data Santri](santri_daftar_desktop.webp|santri_daftar_mobile.webp)

## 4.2 Master Data Orang Tua & Wali

Menu **"Data Orang Tua"** memfasilitasi audit hubungan keluarga:
* Memeriksa keterhubungan akun wali dengan data santri agar tidak terjadi salah sambung akun anak.

![Master Data Orang Tua](orangtua_daftar_desktop.webp|orangtua_daftar_mobile.webp)

## 4.3 Master Data Ustadz & Tenaga Pendidik

Menu **"Data Ustadz"** mencatat profil tenaga pengajar madrasah diniyah dan formal:

![Master Data Ustadz](ustadz_daftar_desktop.webp|ustadz_daftar_mobile.webp)

## 4.4 Master Rombel Kelas & Kamar Asrama

Menu **"Data Kelas"** dan **"Data Kamar"** digunakan untuk:
* Mendefinisikan jenjang kelas (VII, VIII, IX, X, XI, XII) dan nama rombel.
* Menetapkan musyrif/pembina kamar dan kapasitas hunian kamar santri.

![Master Rombel Kelas](kelas_daftar_desktop.webp|kelas_daftar_mobile.webp)

![Master Kamar Asrama](kamar_daftar_desktop.webp|kamar_daftar_mobile.webp)

---

# Konfigurasi Katalog Layanan & Master Tarif Finansial

{section:layanan_keuangan}

## 5.1 Master Katalog Jenis Layanan

Menu **"Jenis Layanan"** mengatur jenis-jenis izin keluar dan permohonan santri:
* Menentukan batasan izin, durasi maksimal pesiar, dan dokumen persyaratan yang wajib dilampirkan.

![Konfigurasi Master Jenis Layanan](layanan_jenis_desktop.webp|layanan_jenis_mobile.webp)

## 5.2 Master Pos Tagihan & Tarif Pembayaran

Menu **"Jenis Tagihan"** mengatur pos-pos keuangan resmi pondok:
* Menentukan besaran iuran SPP bulanan, uang makan asrama, biaya seragam, dan uang gedung.
* Menetapkan tanggal jatuh tempo tagihan dan rekening bank tujuan pembayaran pondok.

![Konfigurasi Master Jenis Tagihan](tagihan_jenis_desktop.webp|tagihan_jenis_mobile.webp)

## 5.3 Audit Transaksi Finansial

Menu **"Keuangan"** menyediakan audit jejak aliran dana masuk:
* Memeriksa bukti bayar yang diunggah wali dan status verifikasi dari staf bendahara pondok.

![Audit Transaksi Keuangan](keuangan_daftar_desktop.webp|keuangan_daftar_mobile.webp)

## 5.4 Audit Riwayat Layanan Santri

Menu **"Riwayat Layanan"** memuat seluruh rekam jejak izin keluar pondok untuk memantau kepatuhan tata tertib santri.

![Audit Riwayat Layanan](layanan_riwayat_desktop.webp|layanan_riwayat_mobile.webp)

---

# Penjadwalan Agenda, Tata Kelola Aspirasi & Evaluasi Mutu

{section:kegiatan_mutu}

## 6.1 Manajemen Master Agenda Kegiatan

Menu **"Kegiatan"** memfasilitasi pengelolaan kalender aktivitas akbar pesantren:
* Menjadwalkan haul akbar, wisuda tahfidz, ujian semester, serta kegiatan mingguan santri.

![Manajemen Master Kegiatan](kegiatan_daftar_desktop.webp|kegiatan_daftar_mobile.webp)

## 6.2 Manajemen Pengaduan & Aspirasi

Menu **"Pengaduan"** menyajikan rekapitulasi keluhan wali santri:
* Memantau kecepatan respons petugas dan memastikan semua aduan terselesaikan secara tuntas dan adil.

![Pengawasan Pengaduan](pengaduan_daftar_desktop.webp|pengaduan_daftar_mobile.webp)

## 6.3 Evaluasi Mutu Layanan (Feedback)

Menu **"Feedback"** merangkum penilaian santri terhadap fasilitas kamar mandi, dapur, asrama, dan pembelajaran kelas.

![Evaluasi Mutu & Feedback](feedback_evaluasi_desktop.webp|feedback_evaluasi_mobile.webp)

---

# Audit Trail & Log Keamanan Aktivitas Sistem

{section:audit_log}

Salah satu fitur proteksi terkuat pada SIM-Tren PPDNY adalah sistem pelacakan jejak digital:

## 7.1 Panel Log Aktivitas Pengguna

Menu **"Log Aktivitas"** merekam setiap interaksi pengguna terhadap basis data secara mendetail:
* **Pengguna (User)**: Nama staf/pengguna yang melakukan aksi beserta peran (*role*) resminya.
* **Aksi (Action)**: Jenis operasi data (*CREATE*, *UPDATE*, *DELETE*, *LOGIN*, *EXPORT*).
* **Entitas Modul**: Modul data yang dipengaruhi (misalnya: *Data Santri*, *Pembayaran SPP*, *Screening Medis*).
* **Waktu Tepat (Timestamp)**: Catatan waktu presisi hingga detik.
* **Detail Perubahan**: Data sebelum dan sesudah perubahan untuk investigasi ketidaksesuaian data.

![Audit Trail & Log Aktivitas](log_aktivitas_desktop.webp|log_aktivitas_mobile.webp)

> [!important]
> Tabel Log Aktivitas bersifat kekal (*Immutable Audit Log*). Data log tidak dapat diedit atau dihapus oleh siapa pun guna menjamin keaslian bukti audit legal pesantren.

---

# Manajemen Konten Edukasi & Pengawasan PPDB

{section:materi_ppdb}

## 8.1 Manajemen Materi Edukasi Kesehatan

Menu **"Materi"** memfasilitasi kurasi modul pembelajaran kesehatan dan pencegahan scabies yang diajukan santri atau tim medis:
* Menerbitkan artikel edukatif terverifikasi agar dapat dibaca oleh publik dan wali santri.

![Manajemen Materi Edukasi](materi_kelola_desktop.webp|materi_kelola_mobile.webp)

## 8.2 Pusat Kendali Penerimaan Santri Baru (PPDB)

Menu **"PPDB > Rekapitulasi"** memantau statistik pendaftar gelombang aktif, hasil verifikasi berkas, dan konversi santri yang diterima.

![Pusat Kendali PPDB](ppdb_rekapitulasi_desktop.webp|ppdb_rekapitulasi_mobile.webp)

---

# Profil Administrator & Pemeliharaan Sistem

{section:profil}

## 9.1 Manajemen Profil Administrator

1. Klik menu **"Edit Profil"** pada bilah bawah navigasi.
2. Perbarui nama administrator penanggung jawab, email pemulihan cadangan, dan nomor kontak aktif.

![Profil Administrator Sistem](profil_utama_desktop.webp|profil_utama_mobile.webp)

## 9.2 Panduan Pemeliharaan & Kesiapsiagaan Sistem

* Lakukan pencadangan basis data MySQL (*Database Backup*) secara berkala setiap akhir pekan.
* Pantau kapasitas ruang penyimpanan server dan kuota Cloudinary untuk media gambar rekam medis.
* Menu **"FAQ"** menyediakan panduan teknis konfigurasi lingkungan server (*Environment Variables*) dan rujukan pengembang.
