# Pendahuluan

{section:pendahuluan}

**SIM-Tren Poskestren (Pos Kesehatan Pesantren)** adalah sub-sistem rekam medis dan pengendalian kesehatan terintegrasi Pondok Pesantren Modern Darun-Na'im Yapia (PPDNY). Portal ini dikembangkan secara khusus untuk mendukung tenaga medis, dokter, perawat (*nurse*), dan kader kesehatan santri dalam menjaga sanitasi lingkungan pondok serta menekan penyebaran penyakit menular, khususnya penyakit kulit (**Scabies**).

Bagi **Tim Kesehatan / Poskestren**, sistem ini menyediakan alat kerja klinis komprehensif tanpa beban birokrasi kertas:

* **Analytical Medical Dashboard**: Memantau grafik epidemiologi bulanan dan tahunan kasus scabies, cakupan screening 30 hari, serta indikator santri berisiko tinggi.
* **Sistem Skrining Klinis Scabies**: Melakukan pencatatan rekam medis digital gejala kardinal scabies (gatal nokturna, terowongan/kanalikulus, papul/vesikel), pemetaan area predileksi tubuh, penegakan diagnosa medis (*Bukan Scabies*, *Kemungkinan Scabies*, *Scabies Terkonfirmasi*), resep salep/obat, serta instruksi isolasi asrama.
* **Observasi Perilaku Cuci Tangan**: Memantau dan menilai kepatuhan santri dalam menjalankan 6 langkah cuci tangan dengan sabun air mengalir.
* **Inspeksi Sanitasi & Absensi Kamar**: Menilai tingkat kebersihan kasur, ventilasi, sprei, dan penataan pakaian santri di seluruh kamar asrama secara berkala.
* **Telekonsultasi Medis Online**: Berinteraksi langsung melalui ruang konsultasi pesan instan bersama santri yang membutuhkan keluhan kesehatan mendesak.
* **Manajemen & Tinjauan Edukasi Kesehatan**: Meninjau dan menerbitkan modul artikel edukasi kesehatan yang diajukan oleh santri atau staf pondok.

> [!important]
> Seluruh rekam medis santri bersifat rahasia dan hanya dapat diakses oleh Tim Medis Poskestren yang berwenang, Pengasuh Pondok, serta wali santri terkait.

---

# Dashboard & Analitik Kesehatan

{section:dashboard}

## 2.1 Antarmuka Utama & Metrik KPI Prioritas

Setelah masuk dengan akun tim kesehatan, Anda akan melihat **Panel Analitik Tim Kesehatan**:

![Dashboard Utama Tim Kesehatan](dashboard_utama_desktop.png|dashboard_utama_mobile.png)

Panel atas menyajikan 4 kartu metrik utama (*Key Performance Indicators*):
1. **Kasus Berisiko Bulan Ini**: Jumlah santri yang terkonfirmasi mengalami scabies atau memerlukan evaluasi intensif pada bulan berjalan.
2. **Belum Screening 30 Hari**: Jumlah santri yang belum pernah diperiksa fisik dalam 30 hari terakhir beserta persentase cakupan screening pondok.
3. **Konsultasi Aktif**: Jumlah ruang telekonsultasi santri yang sedang berlangsung dan pesan baru yang belum dibalas oleh petugas.
4. **Pengajuan Materi**: Jumlah draf artikel edukasi kesehatan yang diajukan oleh santri/ustadz yang menunggu peninjauan dokter/timkes.

## 2.2 Grafik Tren Bulanan & Tahunan

Di bagian tengah, dashboard dilengkapi visualisasi analitik interaktif:
* **Tren Bulanan Tahun Berjalan**: Grafik gabungan (*Composed Chart*) yang membandingkan volume pemeriksaan screening (area hijau), observasi cuci tangan (area biru), dan garis fluktuasi kasus scabies (garis merah).
* **Tren Tahunan**: Grafik batang (*Bar Chart*) rekam jejak kesehatan 5 tahun terakhir untuk evaluasi keberhasilan program sanitasi pondok.

## 2.3 Panel Prioritas Tindakan Cepat

Di bagian bawah dashboard, sistem secara otomatis menyeleksi santri yang memerlukan intervensi segera:
* **Kasus Screening Prioritas**: Santri dengan status *Scabies* atau *Kemungkinan Scabies* yang perlu pemberian salep atau kontrol ulang.
* **Observasi Skor Rendah**: Santri dengan kepatuhan cuci tangan skor 3 ke bawah yang membutuhkan pembinaan kebersihan personal.

---

# Pemeriksaan & Screening Scabies

{section:screening}

## 3.1 Portal Pencarian Santri

Untuk memulai pemeriksaan klinis atau melihat riwayat santri:

1. Klik menu **"Screening"** pada bilah navigasi samping (*Sidebar*) atau tombol cepat di dashboard.
2. Halaman **Daftar Santri Screening** akan menampilkan daftar seluruh santri lengkap dengan NIS, kelas, kamar, dan status pemeriksaan terakhir.
3. Gunakan kolom pencarian untuk mengetikkan nama santri atau filter berdasarkan kelas/kamar.
4. Klik tombol **"Portal Screening"** pada baris santri yang bersangkutan.

![Daftar Santri Screening](screening_daftar_desktop.png|screening_daftar_mobile.png)

## 3.2 Portal Rekam Medis Santri

Halaman **Portal Screening Santri** memuat profil lengkap santri dan rekam jejak riwayat pemeriksaan terdahulu:
* Ringkasan diagnosa terakhir dan riwayat frekuensi pemeriksaan.
* Tombol hijau **"+ Tambah Screening Baru"** untuk mencatat rekam medis kunjungan baru.
* Riwayat tabel screening dengan rincian tanggal, nama timkes pemeriksa, diagnosa, dan tombol aksi.

![Portal Screening Santri](screening_portal_desktop.png|screening_portal_mobile.png)

## 3.3 Formulir Pemeriksaan Medis (Input Rekam Medis)

Klik tombol **"+ Tambah Screening Baru"** untuk membuka formulir pemeriksaan lengkap:

1. **Gejala Klinis (Gejala Kardinal)**:
   * Centang apakah terdapat keluhan gatal terutama pada malam hari (*pruritus nokturna*).
   * Centang apakah ada teman sekamar/serumah yang mengalami keluhan serupa.
   * Centang ada/tidaknya lesi kulit khas (terowongan/papul/vesikel/ekskoriasi).
2. **Pemetaan Area Predileksi Kulit**:
   * Tandai bagian tubuh yang mengalami ruam (sela-sela jari tangan, pergelangan tangan, siku, ketiak, perut bawah/umbilikus, area genital, atau bokong).
3. **Kesimpulan Diagnosa**:
   * Pilih hasil diagnosis: **Bukan Scabies**, **Kemungkinan Scabies**, atau **Scabies**.
4. **Tindakan & Terapi**:
   * Masukkan instruksi terapi obat/salep (misalnya: *Permetrin 5% dioleskan malam hari*).
   * Tentukan apakah santri memerlukan rekomendasi isolasi sementara di ruang poskestren atau diperbolehkan kembali ke asrama.
5. Klik tombol **"Simpan Hasil Screening"**.

![Formulir Screening Scabies](screening_form_desktop.png|screening_form_mobile.png)

## 3.4 Meninjau Detail Hasil Rekam Medis

Untuk mencetak rujukan atau melihat riwayat detail pemeriksaan:

1. Pada riwayat kunjungan di Portal Screening, klik tombol **"Lihat Detail"**.
2. Halaman **View Screening** menampilkan rincian checklist klinis, dokter pemeriksa, tanggal periksa, skor keparahan, dan catatan resep medis secara lengkap.

![View Detail Rekam Medis](screening_view_desktop.png|screening_view_mobile.png)

---

# Observasi Perilaku Cuci Tangan

{section:observasi}

Pencegahan transmisi scabies dan infeksi kulit di lingkungan pesantren bergantung pada kedisiplinan mencuci tangan:

## 4.1 Daftar & Portal Observasi Santri

1. Klik menu **"Observasi Cuci Tangan"** pada sidebar.
2. Pilih santri yang akan diobservasi melalui tombol **"Portal Observasi"**.
3. Portal menyajikan grafik perkembangan skor kepatuhan santri dari waktu ke waktu.

![Daftar Santri Observasi](observasi_daftar_desktop.png|observasi_daftar_mobile.png)

![Portal Observasi Santri](observasi_portal_desktop.png|observasi_portal_mobile.png)

## 4.2 Formulir Penilaian 6 Langkah Cuci Tangan

Klik tombol **"+ Tambah Observasi Baru"** saat menguji praktik kebersihan santri:

1. **Ceklis 6 Langkah WHO**:
   * Meratakan sabun dengan menggosok kedua telapak tangan.
   * Menggosok punggung dan sela-sela jari tangan kiri dan sebaliknya.
   * Menggosok kedua telapak tangan dan sela-sela jari.
   * Jari-jari sisi dalam dari kedua tangan saling mengunci.
   * Menggosok ibu jari kiri berputar dalam genggaman tangan kanan dan sebaliknya.
   * Menggosokkan dengan memutar ujung jari-jari di telapak tangan.
2. Sistem akan mengakumulasi skor nilai (0 hingga 6).
3. Berikan catatan edukasi jika terdapat langkah yang masih keliru.
4. Klik tombol **"Simpan Observasi"**.

![Formulir Observasi Cuci Tangan](observasi_form_desktop.png|observasi_form_mobile.png)

## 4.3 Meninjau Hasil Evaluasi Observasi

Klik **"Lihat Detail"** pada rekam observasi untuk meninjau skor nilai dan kategori evaluasi (*Sangat Baik*, *Baik*, *Cukup*, atau *Perlu Bimbingan*).

![View Detail Observasi](observasi_view_desktop.png|observasi_view_mobile.png)

---

# Absensi & Monitoring Kebersihan Kamar

{section:absensi}

Kamar asrama yang bersih, sprei yang rutin dicuci, dan ventilasi udara yang sehat adalah benteng utama pencegahan wabah penyakit kulit di pondok:

## 5.1 Daftar Kamar Asrama

1. Klik menu **"Absensi Kesehatan"** pada sidebar.
2. Halaman memuat seluruh daftar kamar asrama putra dan putri beserta kapasitas kamar, wali asrama, dan riwayat skor sanitasi kamar.
3. Klik tombol **"Portal Kamar"** untuk membuka arsip inspeksi kamar terkait.

![Daftar Kamar Absensi](absensi_daftar_desktop.png|absensi_daftar_mobile.png)

![Portal Absensi Kamar](absensi_portal_desktop.png|absensi_portal_mobile.png)

## 5.2 Formulir Ceklis Inspeksi Kebersihan Kamar

Saat melakukan inspeksi berkala di asrama:

1. Pada portal kamar, klik tombol **"+ Input Absensi Baru"**.
2. Isi tanggal pemeriksaan dan nilai indikator:
   * **Kerapian Kasur & Sprei**: Kebersihan kasur, sprei dipasang rapi dan tidak lembab.
   * **Kebersihan Lantai & Sudut Ruangan**: Lantai disapu dan dipel bersih tanpa debu.
   * **Ventilasi & Pencahayaan Alami**: Jendela dibuka untuk pertukaran sirkulasi udara dan masuknya sinar matahari.
   * **Kerapian Pakaian & Gantungan Baju**: Tidak ada tumpukan pakaian kotor bergantungan di dinding kamar.
3. Masukkan catatan temuan dan klik **"Simpan Absensi Kamar"**.

![Formulir Absensi Kamar](absensi_form_desktop.png|absensi_form_mobile.png)

## 5.3 Laporan Rekapitulasi Sanitasi Bulanan

Untuk melaporkan performa kebersihan kamar kepada Pimpinan Pondok:

1. Pada portal kamar, klik tombol **"Laporan Rekapitulasi"**.
2. Sistem menyajikan grafik tren kebersihan kamar per bulan dan tabel rekapitulasi penilaian yang siap diunduh atau dicetak.

![Laporan Rekapitulasi Absensi Kamar](absensi_laporan_desktop.png|absensi_laporan_mobile.png)

---

# Layanan Telekonsultasi Medis Santri

{section:konsultasi}

## 6.1 Daftar Ruang Konsultasi Aktif

Telekonsultasi memfasilitasi santri yang sedang isolasi atau memiliki keluhan awal untuk berdiskusi dengan tim medis:

1. Klik menu **"Konsultasi"** pada sidebar.
2. Halaman **Konsultasi Tim Kesehatan** menyajikan daftar ruang chat (*Chat Rooms*):
   * Menampilkan nama santri, waktu update terakhir, dan ringkasan pesan masuk.
   * Lencana status room: **Aktif** atau **Menunggu Respons**.
3. Klik pada salah satu room untuk membuka antarmuka obrolan klinis real-time.

![Daftar Konsultasi Medis](konsultasi_daftar_desktop.png|konsultasi_daftar_mobile.png)

## 6.2 Berdiskusi & Menutup Sesi Konsultasi

1. Petugas medis dapat membaca keluhan, menanyakan gejala penyerta, dan memberikan instruksi pertolongan pertama.
2. Apabila santri membutuhkan tindakan fisik, arahkan santri untuk segera mendatangi Poskestren.
3. Setelah konsultasi selesai, klik tombol **"Tutup Konsultasi"**, masukkan alasan penutupan (misalnya: *Sudah diberikan obat dan membaik*), dan konfirmasi penutupan.
4. Ruang chat akan diarsipkan secara otomatis ke halaman **Riwayat Konsultasi**.

![Riwayat Konsultasi Medis](konsultasi_riwayat_desktop.png|konsultasi_riwayat_mobile.png)

---

# Edukasi Kesehatan & Manajemen Materi

{section:materi}

## 7.1 Meninjau Pengajuan Materi dari Santri

Untuk menjaga akurasi medis seluruh artikel dan modul edukasi yang beredar di SIM-Tren:

1. Klik menu **"Materi"** pada sidebar.
2. Pada tab **Pengajuan Materi**, tim kesehatan dapat meninjau naskah edukasi yang diajukan oleh santri atau kader kesehatan.
3. Periksa kebenaran ilmiah dan isi materi:
   * Klik **"Setujui"** agar artikel langsung terbit di beranda santri dan publik.
   * Atau klik **"Tolak"** dengan menyertakan catatan revisi medis.

![Manajemen Materi Edukasi](materi_daftar_desktop.png|materi_daftar_mobile.png)

## 7.2 Menerbitkan Panduan Kesehatan Mandiri

Tim kesehatan dapat membuat artikel panduan baru (misalnya: *Cara Pencegahan Penularan Scabies di Asrama* atau *Pola Hidup Bersih dan Sehat*) lengkap dengan gambar pendukung dan format teks kaya (*Rich Text*).

---

# Pengaturan Profil & FAQ

{section:profil}

## 8.1 Memperbarui Profil Petugas Poskestren

1. Klik menu **"Edit Profil"** pada bilah bawah sidebar.
2. Halaman profil menampilkan Nama Lengkap, NIP Timkes, Nomor HP/WhatsApp aktif, dan foto identitas.
3. Perbarui nomor kontak darurat agar staf pondok dan piket asrama dapat menghubungi Anda sewaktu-waktu saat terjadi kegawatdaruratan medis.

![Profil Tenaga Medis Poskestren](profil_utama_desktop.png|profil_utama_mobile.png)

## 8.2 Tanya Jawab (FAQ) Pelayanan Kesehatan

Menu **"FAQ"** pada sidebar menyediakan panduan cepat prosedur rujukan ke rumah sakit mitra, jam buka poskestren, dan panduan ketersediaan obat-obatan rutin.
