# DOKUMENTASI DAN KUESIONER USER ACCEPTANCE TESTING (UAT)
## SISTEM INFORMASI MANAJEMEN PONDOK PESANTREN (SIM-TREN PPDNY)
### Berbasis Standar Kualitas ISO/IEC 25010 (4 Dimensi Kualitas)

---

## 📋 Petunjuk Penggunaan & Konfigurasi Google Form

Dokumen ini disusun khusus sebagai acuan pembuatan **Google Forms UAT (User Acceptance Testing)** untuk aplikasi **SIM-Tren PPDNY**. Kuesioner ini mengukur kualitas dan kesesuaian sistem berbasis **4 Kategori Dimensi Kualitas**:
1. **Usability & UI**: Kemudahan penggunaan, keterbacaan, dan kenyamanan antarmuka.
2. **Kelengkapan Fitur**: Keberadaan dan kesesuaian alur fungsi aplikasi dengan kebutuhan.
3. **Efektivitas Operasional**: Manfaat aplikasi dalam mempercepat pekerjaan/kebutuhan pengguna.
4. **Performa & Kecepatan**: Responsivitas pemuatan halaman, filter data, dan upload berkas.

### Skala Penilaian Likert 5 Poin:
* **1 = Sangat Tidak Sesuai (STS)**
* **2 = Tidak Sesuai (TS)**
* **3 = Cukup Sesuai / Netral (CS)**
* **4 = Sesuai (S)**
* **5 = Sangat Sesuai (SS)**

### 💡 Panduan Pengisian di Google Forms:
1. Buat **Section Baru** di Google Form untuk setiap nomor Section di bawah ini (total **10 Section**).
2. Untuk **Section 1**, gunakan jenis pertanyaan *Jawaban Singkat*, *Pilihan Ganda*, atau *Tanggal*.
3. Untuk **Section 2 sampai 10**, gunakan jenis pertanyaan **Skala Linier (Linear Scale 1-5)** atau **Kisi Pilihan Ganda (Multiple Choice Grid)**.
4. Tambahkan pertanyaan esai di akhir setiap Section: *"Catatan / Masukan / Kendala (Opsional)"* jenis *Paragraf*.

---

## 📌 SECTION 1: Data Diri Penguji

> *Section ini bertujuan untuk mencatat identitas dan profil penguji UAT.*

| No | Pertanyaan / Field | Tipe Input Google Form | Opsi Pilihan / Keterangan |
|---|---|---|---|
| 1.1 | **Nama Lengkap Penguji** | Jawaban Singkat (*Short Answer*) | Wajib diisi |
| 1.2 | **Jabatan / Role Penguji dalam UAT** | Pilihan Ganda (*Multiple Choice*) | • Admin Sistem<br>• Pengurus Pondok<br>• Pimpinan / Pengasuh<br>• Ustadz / Pengajar<br>• Santri<br>• Orang Tua / Wali Santri<br>• Tim Kesehatan / Poskestren<br>• Panitia PPDB / Pendaftar PPDB |
| 1.3 | **Email / Nomor Telepon (Aktif)** | Jawaban Singkat (*Short Answer*) | Wajib diisi |
| 1.4 | **Tanggal Pelaksanaan UAT** | Tanggal (*Date*) | Wajib diisi |
| 1.5 | **Perangkat yang Digunakan** | Centang (*Checkboxes*) | [ ] Laptop / PC<br>[ ] Tablet<br>[ ] Smartphone (Android/iOS) |
| 1.6 | **Peramban (Browser) yang Digunakan** | Centang (*Checkboxes*) | [ ] Google Chrome<br>[ ] Mozilla Firefox<br>[ ] Microsoft Edge<br>[ ] Safari<br>[ ] Lainnya |

---

## 🔐 SECTION 2: Penilaian Login & Autentikasi (AUTH)

> *Berlaku untuk seluruh Role Pengguna.*

| No | Kategori | Aspek / Indikator Penilaian | Tipe Input | Skala Likert |
|---|---|---|---|---|
| **2.1** | **Usability & UI** | **Kemudahan Form Login**<br>Tampilan halaman login bersih, responsive, dan petunjuk input teridentifikasi jelas (NIS / No. HP / Email dan Kata Sandi). | Skala Linier | 1 (STS) - 5 (SS) |
| **2.2** | **Kelengkapan Fitur** | **Login Multi-Identifier (NIS/HP/Email)**<br>Sistem menyediakan dan berhasil memproses login menggunakan NIS, Nomor HP, maupun Email terdaftar. | Skala Linier | 1 (STS) - 5 (SS) |
| **2.3** | **Kelengkapan Fitur** | **Validasi & Error Handling**<br>Sistem menampilkan pesan peringatan yang jelas saat field kosong, password salah, atau identifier tidak terdaftar. | Skala Linier | 1 (STS) - 5 (SS) |
| **2.4** | **Usability & UI** | **Fitur Lupa Kata Sandi**<br>Alur pemulihan kata sandi (reset password) dapat diakses dengan mudah dan memberikan instruksi yang jelas. | Skala Linier | 1 (STS) - 5 (SS) |
| **2.5** | **Efektivitas** | **Redireksi Hak Akses (Role Redirection)**<br>Setelah login berhasil, sistem secara efektif dan otomatis mengarahkan pengguna ke dashboard sesuai perannya. | Skala Linier | 1 (STS) - 5 (SS) |
| **2.6** | **Performa & Kecepatan** | **Respon Autentikasi & Keamanan Sesi**<br>Proses verifikasi login dan logout berlangsung cepat, serta sesi aman (halaman internal tidak bisa diakses tanpa login). | Skala Linier | 1 (STS) - 5 (SS) |
| **2.7** | **Kualitatif** | **Catatan / Saran / Kendala Modul Auth** | Paragraf | Isian Bebas (Opsional) |

---

## 🛠️ SECTION 3: Penilaian Modul Admin (Role: Admin)

> *Diuji oleh Penguji dengan Peran Admin Sistem.*

| No | Kategori | Aspek / Indikator Penilaian | Tipe Input | Skala Likert |
|---|---|---|---|---|
| **3.1** | **Usability & UI** | **Tampilan Dashboard & Menu Navigasi**<br>Tampilan dashboard admin, kartu statistik, dan menu sidebar tersusun rapi, bersih, dan mudah digunakan. | Skala Linier | 1 (STS) - 5 (SS) |
| **3.2** | **Kelengkapan Fitur** | **Kelola Data Master (Santri, Ustadz, Ortu, Kamar, Kelas)**<br>Fitur Tambah, Edit, Hapus, Detail, serta Filter/Pencarian data master berfungsi lengkap dan akurat. | Skala Linier | 1 (STS) - 5 (SS) |
| **3.3** | **Kelengkapan Fitur** | **Pengaturan Keuangan & Tagihan Santri**<br>Konfigurasi jenis tagihan, pencatatan transaksi, dan verifikasi upload bukti pembayaran berjalan sesuai aturan bisnis. | Skala Linier | 1 (STS) - 5 (SS) |
| **3.4** | **Kelengkapan Fitur** | **Tanggapan Pengaduan & Log Aktivitas (Audit Log)**<br>Admin dapat merespons pengaduan santri/ortu dan memantau riwayat aktivitas pengguna (*log admin*) dengan jelas. | Skala Linier | 1 (STS) - 5 (SS) |
| **3.5** | **Efektivitas** | **Efisiensi Manajemen Operasional Pondok**<br>Sistem ini secara efektif membantu dan mempercepat pekerjaan Admin dalam mengelola seluruh data operasional pondok. | Skala Linier | 1 (STS) - 5 (SS) |
| **3.6** | **Performa & Kecepatan** | **Kecepatan Respons & Pencarian Data**<br>Proses pemuatan halaman, pencarian data santri/transaksi, dan pemrosesan form berjalan cepat tanpa kendala. | Skala Linier | 1 (STS) - 5 (SS) |
| **3.7** | **Kualitatif** | **Catatan / Saran / Kendala Modul Admin** | Paragraf | Isian Bebas (Opsional) |

---

## 📋 SECTION 4: Penilaian Modul Pengurus (Role: Pengurus)

> *Diuji oleh Penguji dengan Peran Pengurus Pondok.*

| No | Kategori | Aspek / Indikator Penilaian | Tipe Input | Skala Likert |
|---|---|---|---|---|
| **4.1** | **Usability & UI** | **Kemudahan Antarmuka Pengurus**<br>Tata letak halaman operasional pengurus informatif, rapi, dan mudah diakses dari komputer maupun tablet. | Skala Linier | 1 (STS) - 5 (SS) |
| **4.2** | **Kelengkapan Fitur** | **Operasional Data Santri, Ustadz, Kamar & Kelas**<br>Pengurus dapat mengelola data harian santri, penataan kamar, dan pembagian kelas santri secara presisi. | Skala Linier | 1 (STS) - 5 (SS) |
| **4.3** | **Kelengkapan Fitur** | **Pengelolaan Iuran Keuangan & Kegiatan**<br>Verifikasi pembayaran iuran santri dan pencatatan agenda kegiatan pondok berfungsi dengan lancar. | Skala Linier | 1 (STS) - 5 (SS) |
| **4.4** | **Efektivitas** | **Pembatasan Hak Akses & Keamanan Operasional**<br>Sistem secara efektif membatasi hak akses pengurus sesuai batas wewenang operasional tanpa mengganggu pekerjaan harian. | Skala Linier | 1 (STS) - 5 (SS) |
| **4.5** | **Performa & Kecepatan** | **Kecepatan Pemuatan Data Harian**<br>Proses menampilkan data santri, pencarian, dan update iuran berlangsung responsif dan cepat. | Skala Linier | 1 (STS) - 5 (SS) |
| **4.6** | **Kualitatif** | **Catatan / Saran / Kendala Modul Pengurus** | Paragraf | Isian Bebas (Opsional) |

---

## 📊 SECTION 5: Penilaian Modul Pimpinan (Role: Pimpinan / Pengasuh)

> *Diuji oleh Penguji dengan Peran Pimpinan / Pengasuh Pondok.*

| No | Kategori | Aspek / Indikator Penilaian | Tipe Input | Skala Likert |
|---|---|---|---|---|
| **5.1** | **Usability & UI** | **Kemudahan Kaji Data Executive Dashboard**<br>Grafik perkembangan santri, rekapitulasi keuangan, dan tren kegiatan ditampilkan secara visual yang intuitif. | Skala Linier | 1 (STS) - 5 (SS) |
| **5.2** | **Kelengkapan Fitur** | **Monitoring Data Master & Laporan PDF (Read-Only)**<br>Pimpinan dapat meninjau data master dan mencetak/mengunduh laporan PDF keuangan & kegiatan secara akurat. | Skala Linier | 1 (STS) - 5 (SS) |
| **5.3** | **Efektivitas** | **Dukungan Pengambilan Keputusan**<br>Penyajian laporan dan pemantauan pengaduan/kesehatan santri secara efektif membantu pimpinan dalam mengambil keputusan. | Skala Linier | 1 (STS) - 5 (SS) |
| **5.4** | **Performa & Kecepatan** | **Kecepatan Pemuatan Grafik & Laporan**<br>Pemuatan grafik statistik dan ekspor laporan PDF berjalan lancar tanpa mengalami penundaan (*lag*). | Skala Linier | 1 (STS) - 5 (SS) |
| **5.5** | **Kualitatif** | **Catatan / Saran / Kendala Modul Pimpinan** | Paragraf | Isian Bebas (Opsional) |

---

## 🕌 SECTION 6: Penilaian Modul Ustadz (Role: Ustadz / Pengajar)

> *Diuji oleh Penguji dengan Peran Ustadz / Pengajar.*

| No | Kategori | Aspek / Indikator Penilaian | Tipe Input | Skala Likert |
|---|---|---|---|---|
| **6.1** | **Usability & UI** | **Kemudahan Tampilan Pengaduan & Santri Binaan**<br>Tampilan daftar santri binaan dan menu pengaduan ustadz sederhana dan mudah dipahami. | Skala Linier | 1 (STS) - 5 (SS) |
| **6.2** | **Kelengkapan Fitur** | **Pencarian Santri Binaan & Pelaporan Ustadz**<br>Fitur pencarian biodata santri binaan dan penyampaian catatan/pengaduan ustadz ke pengurus berjalan baik. | Skala Linier | 1 (STS) - 5 (SS) |
| **6.3** | **Efektivitas** | **Kemudahan Pemantauan Kegiatan Mengajar**<br>Aplikasi secara efektif membantu ustadz memantau keikutsertaan kegiatan santri dan memperbarui profil diri. | Skala Linier | 1 (STS) - 5 (SS) |
| **6.4** | **Performa & Kecepatan** | **Responsivitas Aplikasi di Mobile/Tablet**<br>Aplikasi dapat dibuka dan diakses dengan cepat saat ustadz menggunakannya di smartphone/tablet. | Skala Linier | 1 (STS) - 5 (SS) |
| **6.5** | **Kualitatif** | **Catatan / Saran / Kendala Modul Ustadz** | Paragraf | Isian Bebas (Opsional) |

---

## 🎓 SECTION 7: Penilaian Modul Santri (Role: Santri)

> *Diuji oleh Penguji dengan Peran Santri.*

| No | Kategori | Aspek / Indikator Penilaian | Tipe Input | Skala Likert |
|---|---|---|---|---|
| **7.1** | **Usability & UI** | **[Operasional] Antarmuka Layanan & Keuangan Santri**<br>Desain tampilan dashboard santri, navigasi menu layanan, jadwal kegiatan, rincian tagihan, dan form pengaduan mudah dipahami serta nyaman digunakan di smartphone. | Skala Linier | 1 (STS) - 5 (SS) |
| **7.2** | **Usability & UI** | **[Scabies] Antarmuka Modul Kesehatan Scabies**<br>Tampilan fitur kesehatan, ruang baca materi edukasi scabies, dan antarmuka ruang konsultasi medis tersusun rapi, jelas, dan mudah diakses. | Skala Linier | 1 (STS) - 5 (SS) |
| **7.3** | **Kelengkapan Fitur** | **[Operasional] Fitur Layanan, Kegiatan, Tagihan & Pengaduan**<br>Fitur mengecek rincian tagihan bulanan, pengajuan permohonan layanan, pemberian rating layanan selesai, dan pembuatan pengaduan santri berfungsi lengkap tanpa error. | Skala Linier | 1 (STS) - 5 (SS) |
| **7.4** | **Kelengkapan Fitur** | **[Scabies] Fitur Screening & Konsultasi Scabies**<br>Formulir mandiri screening gejala kesehatan kulit/scabies, materi edukasi penyakit, serta ruang konsultasi chat medis interaktif berfungsi lengkap sesuai alur. | Skala Linier | 1 (STS) - 5 (SS) |
| **7.5** | **Efektivitas** | **[Operasional] Efektivitas Layanan & Informasi Pondok**<br>Aplikasi ini secara efektif mempermudah santri dalam memperoleh informasi tagihan, mengikuti agenda pondok, dan mengurus permohonan izin/layanan secara mandiri. | Skala Linier | 1 (STS) - 5 (SS) |
| **7.6** | **Efektivitas** | **[Scabies] Efektivitas Edukasi & Konsultasi Scabies**<br>Modul kesehatan ini secara efektif meningkatkan pemahaman santri terkait pencegahan scabies serta mempermudah konsultasi medis secara dini. | Skala Linier | 1 (STS) - 5 (SS) |
| **7.7** | **Performa & Kecepatan** | **[Operasional] Kecepatan Akses Fitur Operasional**<br>Proses pemuatan halaman dashboard, pengiriman form permohonan layanan, dan submit pengaduan berlangsung cepat dan responsif. | Skala Linier | 1 (STS) - 5 (SS) |
| **7.8** | **Performa & Kecepatan** | **[Scabies] Kecepatan Pemuatan Materi & Chat Medis**<br>Proses pemuatan halaman materi edukasi scabies, pengiriman pesan chat konsultasi medis, dan submit screening kesehatan berjalan cepat tanpa mengalami *lag*. | Skala Linier | 1 (STS) - 5 (SS) |
| **7.9** | **Kualitatif** | **Catatan / Saran / Kendala Modul Santri** | Paragraf | Isian Bebas (Opsional) |

---

## 👨‍👩‍👧 SECTION 8: Penilaian Modul Orang Tua (Role: Orang Tua / Wali)

> *Diuji oleh Penguji dengan Peran Orang Tua / Wali Santri.*

| No | Kategori | Aspek / Indikator Penilaian | Tipe Input | Skala Likert |
|---|---|---|---|---|
| **8.1** | **Usability & UI** | **Kemudahan Tampilan & Fitur Switch Anak**<br>Informasi tagihan anak jelas, dan perpindahan tampilan (*switch*) antar anak bagi ortu yang memiliki >1 santri lancar. | Skala Linier | 1 (STS) - 5 (SS) |
| **8.2** | **Kelengkapan Fitur** | **Upload Bukti Pembayaran & Validasi Berkas**<br>Proses mengunggah bukti transfer pembayaran iuran mudah dilakukan dan mendeteksi kesalahan berkas dengan benar. | Skala Linier | 1 (STS) - 5 (SS) |
| **8.3** | **Kelengkapan Fitur** | **Monitoring Kegiatan, Kesehatan & Pengaduan Ortu**<br>Orang tua dapat memantau kegiatan anak, status kesehatan, serta menyampaikan aspirasi ke pengurus pondok. | Skala Linier | 1 (STS) - 5 (SS) |
| **8.4** | **Efektivitas** | **Kemudahan Transparansi Informasi Iuran**<br>Sistem ini secara efektif membantu orang tua memperoleh kepastian pembayaran dan perkembangan anak secara mutakhir. | Skala Linier | 1 (STS) - 5 (SS) |
| **8.5** | **Performa & Kecepatan** | **Kecepatan Upload Bukti Transfer**<br>Proses pengunggahan foto/pdf bukti transfer pembayaran berlangsung cepat tanpa kendala kegagalan *timeout*. | Skala Linier | 1 (STS) - 5 (SS) |
| **8.6** | **Kualitatif** | **Catatan / Saran / Kendala Modul Orang Tua** | Paragraf | Isian Bebas (Opsional) |

---

## 📝 SECTION 9: Penilaian Modul PPDB (Penerimaan Peserta Didik Baru)

> *Diuji oleh Calon Santri / Orang Tua (Publik) & Panitia PPDB.*

| No | Kategori | Aspek / Indikator Penilaian | Tipe Input | Skala Likert |
|---|---|---|---|---|
| **9.1** | **Usability & UI** | **Kemudahan Form Pendaftaran Online**<br>Halaman formulir pendaftaran PPDB publik bertahap mudah dipahami dan petunjuk pengisian jelas. | Skala Linier | 1 (STS) - 5 (SS) |
| **9.2** | **Kelengkapan Fitur** | **Input Data, Upload Dokumen & Cetak PDF Bukti**<br>Fitur pilih gelombang, input biodata, upload berkas (KTP/KK), serta cetak PDF bukti pendaftaran berfungsi akurat. | Skala Linier | 1 (STS) - 5 (SS) |
| **9.3** | **Kelengkapan Fitur** | **Cek Status Pendaftaran & Dashboard Seleksi PPDB**<br>Pendaftar dapat mengecek status seleksi via NIK/Nomor Pendaftaran, dan panitia dapat melakukan seleksi pendaftar. | Skala Linier | 1 (STS) - 5 (SS) |
| **9.4** | **Efektivitas** | **Efisiensi Alur Pendaftaran Online**<br>Sistem ini secara efektif mempermudah pendaftar melakukan registrasi tanpa perlu datang langsung ke lokasi pondok. | Skala Linier | 1 (STS) - 5 (SS) |
| **9.5** | **Performa & Kecepatan** | **Kecepatan Submit & Cetak Bukti PDF**<br>Proses pengiriman formulir pendaftaran dan pembuatan dokumen PDF bukti pendaftaran berlangsung cepat. | Skala Linier | 1 (STS) - 5 (SS) |
| **9.6** | **Kualitatif** | **Catatan / Saran / Kendala Modul PPDB** | Paragraf | Isian Bebas (Opsional) |

---

## 🩺 SECTION 10: Penilaian Modul Tim Kesehatan (Role: Tim Kesehatan / Poskestren)

> *Diuji oleh Penguji dengan Peran Tim Kesehatan / Pengelola Poskestren.*

| No | Kategori | Aspek / Indikator Penilaian | Tipe Input | Skala Likert |
|---|---|---|---|---|
| **10.1** | **Usability & UI** | **Tampilan Dashboard & Urgent Action List**<br>Penyajian KPI statistik kesehatan, grafik tren penyakit, dan daftar santri butuh observasi mudah dipahami. | Skala Linier | 1 (STS) - 5 (SS) |
| **10.2** | **Kelengkapan Fitur** | **Modul Screening, Observasi & Absensi Kebersihan**<br>Formulir pencatatan screening kesehatan, lembar skor observasi harian, dan absensi kebersihan kamar berfungsi presisi. | Skala Linier | 1 (STS) - 5 (SS) |
| **10.3** | **Kelengkapan Fitur** | **Fitur Konsultasi Medis Online & Cetak Laporan PDF**<br>Fitur membalas konsultasi kesehatan santri dan pengunduhan laporan PDF kesehatan berjalan tanpa error. | Skala Linier | 1 (STS) - 5 (SS) |
| **10.4** | **Efektivitas** | **Efisiensi Pemantauan Kesehatan Santri**<br>Aplikasi secara efektif membantu tim poskestren mendeteksi dan menangani indikasi kesehatan (scabies) secara dini. | Skala Linier | 1 (STS) - 5 (SS) |
| **10.5** | **Performa & Kecepatan** | **Kecepatan Respon Simpan Data & Export PDF**<br>Proses penginputan data observasi harian dan pembuatan laporan PDF kesehatan berlangsung cepat. | Skala Linier | 1 (STS) - 5 (SS) |
| **10.6** | **Kualitatif** | **Catatan / Saran / Kendala Modul Tim Kesehatan** | Paragraf | Isian Bebas (Opsional) |

---

## 📈 Rekapitulasi & Formula Perhitungan Hasil UAT

Untuk mempermudah analisa kuantitatif dari tanggapan Google Form, gunakan formula persentase berikut:

$$\text{Persentase Kelayakan (\%)} = \left( \frac{\text{Total Skor Aktual}}{\text{Total Skor Maksimal}} \right) \times 100\%$$

### Analisa Tambahan Per-Kategori Dimensi Kualitas:
Selain skor total akhir, Anda juga dapat menghitung persentase rata-rata per dimensi kualitas:
* **Persentase Usability & UI** = $(\text{Total Skor Usability} / \text{Max Skor Usability}) \times 100\%$
* **Persentase Kelengkapan Fitur** = $(\text{Total Skor Fitur} / \text{Max Skor Fitur}) \times 100\%$
* **Persentase Efektivitas** = $(\text{Total Skor Efektivitas} / \text{Max Skor Efektivitas}) \times 100\%$
* **Persentase Performa & Kecepatan** = $(\text{Total Skor Performa} / \text{Max Skor Performa}) \times 100\%$

### Kategori Kelayakan UAT (ISO/IEC 25010):
* **81% – 100%** : **Sangat Layak / Sangat Sesuai** (Aplikasi Siap Rilis)
* **61% – 80%** : **Layak / Sesuai** (Perlu Penyesuaian Minor)
* **41% – 60%** : **Cukup Layak** (Memerlukan Perbaikan Modul)
* **21% – 40%** : **Kurang Layak** (Memerlukan Perbaikan Mayor)
* **0% – 20%** : **Sangat Kurang Layak** (Aplikasi Belum Siap)
