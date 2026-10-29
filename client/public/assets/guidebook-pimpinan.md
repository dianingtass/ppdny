# Pendahuluan

{section:pendahuluan}

**Buku Panduan Pengguna SIM-Tren PPDNY (Sub-Sistem Pengasuh & Dewan Pimpinan)** disusun sebagai pedoman operasional tertinggi bagi Pimpinan Pondok, Kyai/Pengasuh, dan Direktur Pendidikan dalam menjalankan pengawasan (*governance*), pemantauan indikator kinerja utama (*Key Performance Indicators*), serta pengambilan kebijakan strategis berbasis data (*data-driven decision making*) di lingkungan Pondok Pesantren Modern Darun-Na'im Yapia (PPDNY).

Sebagai pengemban amanah kepemimpinan, Pimpinan memiliki hak akses istimewa (*Executive Privilege*) yang mencakup visibilitas holistik 360 derajat terhadap seluruh pilar kehidupan pesantren:

* **Executive Intelligence Dashboard**: Visualisasi ringkasan real-time arus kas, rasio santri-ustadz, cakupan sanitasi asrama, status kesehatan bebas wabah scabies, dan indeks kepuasan santri.
* **Pengawasan Direktori Kependidikan**: Pemantauan demografi santri putra/putri, rekam jejak pengajaran ustadz, penugasan staf kependidikan, serta database wali santri.
* **Monitoring Kegiatan & Pemanfaatan Fasilitas**: Evaluasi keterlaksanaan agenda pondok harian, kajian kitab kuning, ekstrakurikuler, dan riwayat perizinan fasilitas pesantren.
* **Kanal Aspirasi & Disposisi Aduan**: Pengawasan respons cepat pengurus terhadap keluhan wali santri untuk menjamin transparansi pelayanan pesantren.
* **Transparansi Finansial & Kas Tagihan**: Rekapitulasi pelunasan SPP, evaluasi tunggakan, dan monitoring kesehatan kas operasional pondok.
* **Pengendalian Mutu & Suara Santri**: Tinjauan indeks kepuasan fasilitas pesantren secara berkala melalui instrumen evaluasi bintang dan ulasan santri.
* **Monitoring Penerimaan Santri Baru (PPDB)**: Pemantauan konversi gelombang pendaftaran, hasil seleksi ujian masuk, dan kepatuhan kuota daya tampung asrama.
* **Pengawasan Sanitasi & Kesehatan Santri (Poskestren)**: Pengawasan epidemiologi scabies, kepatuhan cuci tangan WHO, serta hasil inspeksi kebersihan kamar asrama.

> [!important]
> Informasi yang disajikan dalam Portal Pimpinan merupakan ringkasan eksekutif bersifat rahasia (*Confidential Executive Data*). Pastikan akun Anda tidak digunakan oleh pihak yang tidak berwenang dan selalu lakukan *Logout* setelah menyelesaikan sesi kerja.

---

# Instalasi & Login

{section:instalasi}

## 2.1 Instalasi PWA (Progressive Web App)

Agar aplikasi dapat diakses instan layaknya aplikasi Android/iOS tanpa perlu mengunduh dari toko aplikasi:

1. Buka peramban (*browser*) di smartphone Anda (disarankan **Google Chrome** di Android atau **Safari** di iOS).
2. Kunjungi alamat resmi SIM-Tren: **`https://ppdny.vercel.app`** (atau alamat lokal server saat terhubung ke jaringan internal pondok).
3. Ketuk menu opsi browser (ikon titik tiga di pojok kanan atas Chrome, atau ikon *Share/Bagikan* di Safari).
4. Pilih opsi **"Tambahkan ke Layar Utama"** (*Add to Home Screen*) atau **"Instal Aplikasi"**.
5. Konfirmasikan instalasi. Ikon SIM-Tren akan muncul di beranda smartphone Anda dan dapat dibuka satu ketukan dalam mode layar penuh (*standalone*).

## 2.2 Cara Masuk (Login)

1. Buka aplikasi SIM-Tren di smartphone atau laptop Anda.
2. Pada formulir login, masukkan salah satu pengenal terdaftar: **NIP**, **Email**, atau **Nomor HP aktif**.
3. Masukkan **Kata Sandi** Anda (ketuk ikon mata untuk memastikan ketikan sandi tidak keliru).
4. Ketuk tombol **"Masuk"**. Sistem akan memvalidasi kredensial dan langsung mengarahkan Anda ke Executive Dashboard Pimpinan.

![Halaman Login](auth_login_desktop.png|auth_login_mobile.png)

> [!note]
> Bila Anda memiliki lebih dari satu hak akses (multi-role), sistem akan menampilkan pilihan peran sebelum masuk ke dashboard. Pilih peran **"Pimpinan"**.

## 2.3 Lupa Kata Sandi

Apabila Anda tidak dapat mengingat kata sandi akun:

1. Di bawah tombol Masuk, ketuk tautan **"Lupa kata sandi?"**.
2. Pada formulir pemulihan kata sandi yang muncul:
   * Pilih tipe akun: **Pimpinan Pondok**.
   * Masukkan NIP/Email serta Nomor WhatsApp Anda.
3. Ketuk tombol **"Kirim ke WhatsApp"**.
4. Sistem akan otomatis menyiapkan pesan verifikasi untuk pemulihan kredensial Anda ke Administrator.

![Lupa Kata Sandi](auth_lupa_password_desktop.png|auth_lupa_password_mobile.png)

## 2.4 Cara Keluar (Logout)

Untuk mengamankan sesi akun pimpinan setelah selesai memeriksa laporan:
* **Pada Tampilan Desktop/Laptop**: Ketuk foto avatar di pojok kanan atas header, lalu pilih opsi berwarna merah **"Keluar"**.
* **Pada Tampilan Smartphone**: Buka menu Profil dari navigasi bawah, gulir ke bagian paling bawah, lalu ketuk tombol **"Keluar dari Akun"**.

---

# Executive Dashboard & Analitik Pondok

{section:dashboard}

## 2.1 Panel Ringkasan Indikator Kinerja Utama (KPI)

Setelah berhasil masuk dengan kredensial Pimpinan, sistem akan langsung mengarahkan Anda ke **Executive Dashboard**:

![Executive Dashboard Pimpinan](dashboard_utama_desktop.webp|dashboard_utama_mobile.webp)

Pada bagian atas dashboard, tersaji kartu metrik ringkasan eksekutif:
1. **Total Kas Masuk / Keuangan**: Akumulasi pembayaran SPP dan tagihan santri yang telah terverifikasi lunas pada periode berjalan.
2. **Total Santri Aktif**: Jumlah santriwan dan santriwati yang terdaftar aktif dalam rombel kelas dan asrama.
3. **Pengaduan Menunggu Respon**: Jumlah aduan atau masukan dari wali santri yang membutuhkan perhatian atau disposisi segera.
4. **Indikator Bebas Scabies**: Persentase santri yang telah menjalani screening berkala 30 hari dan berada dalam kondisi sehat.

## 2.2 Visualisasi Grafik Arus Finansial & Tren Sanitasi

Di area tengah dashboard, Pimpinan dapat mengamati grafik performa pondok:
* **Grafik Penerimaan Finansial Bulanan**: Menampilkan tren komparasi target tagihan vs realisasi penerimaan kas masuk setiap bulannya.
* **Grafik Epidemiologi Scabies Bulanan & Tahunan**: Memantau penurunan angka kejadian penyakit kulit menular hasil intervensi program Poskestren.

## 2.3 Fitur Ekspor Laporan Eksekutif PDF

Pimpinan dapat mengunduh dokumen laporan komprehensif berformat PDF resmi pondok yang siap dicetak untuk rapat dewan pengasuh:
1. Klik tombol **"Cetak Laporan Lengkap"** di sudut kanan atas dashboard untuk mencetak seluruh rekapitulasi operasional pondok.
2. Klik tombol **"Ekspor Scabies Bulanan"** atau **"Ekspor Scabies Tahunan"** untuk mengunduh laporan status sanitasi asrama secara khusus.

---

# Direktori & Manajemen Kependidikan

{section:kependidikan}

Pengawasan database sivitas akademika pondok terbagi ke dalam sub-menu yang terstruktur rapi pada bilah navigasi:

## 3.1 Direktori Santri & Demografi

Menu **"Data Santri"** menyajikan direktori seluruh santri aktif:
* Menampilkan NIS, Nama Lengkap, Jenis Kelamin, Kelas Pembelajaran, Kamar Asrama, dan Status Keaktifan.
* Dilengkapi filter cerdas berdasarkan jenjang kelas dan blok gedung asrama untuk mempermudah audit persebaran santri.

![Direktori Data Santri](santri_daftar_desktop.webp|santri_daftar_mobile.webp)

## 3.2 Direktori Ustadz & Tenaga Pendidik

Menu **"Data Ustadz"** memuat database seluruh dewan guru dan pengajar kitab:
* Memantau NIP, keahlian bidang keilmuan, nomor kontak aktif, dan riwayat pendidikan asatidz.
* Memastikan rasio kecukupan guru terhadap santri tetap seimbang sesuai standar mutu pesantren.

![Direktori Data Ustadz](ustadz_daftar_desktop.webp|ustadz_daftar_mobile.webp)

## 3.3 Direktori Staf Kependidikan & Tenaga Operasional

Menu **"Data Staf"** memuat database staf non-pengajar yang mengelola administrasi, keuangan, keamanan, dan logistik pondok:

![Direktori Data Staf](staf_daftar_desktop.webp|staf_daftar_mobile.webp)

## 3.4 Direktori Wali Santri & Informasi Kontak

Menu **"Data Orang Tua"** memfasilitasi Pimpinan untuk meninjau data relasi keluarga santri:
* Menampilkan nama ayah/ibu/wali, alamat domisili, pekerjaan, dan nomor telepon WhatsApp aktif untuk keperluan kedaruratan atau silaturahmi.

![Direktori Data Orang Tua](orangtua_daftar_desktop.webp|orangtua_daftar_mobile.webp)

## 3.5 Pemantauan Rombel Kelas & Kamar Asrama

Menu **"Data Kelas"** dan **"Data Kamar"** memungkinkan pemantauan daya tampung fasilitas belajar dan hunian:
* Memastikan tidak terjadi kelebihan kapasitas (*overcapacity*) pada setiap kamar santri demi menjamin kenyamanan istirahat dan standar sanitasi yang sehat.

![Pemantauan Rombel Kelas](kelas_kamar_desktop.webp|kelas_kamar_mobile.webp)

---

# Pengawasan Kegiatan & Layanan Pesantren

{section:kegiatan_layanan}

## 4.1 Pemantauan Agenda & Kegiatan Pondok

Menu **"Kegiatan"** menyajikan agenda terpadu pesantren:
* Menampilkan jadwal sholat berjamaah, taklim bada maghrib, program tahfidz Al-Qur'an, muhadharah (latihan pidato), dan kegiatan ekstrakurikuler santri.
* Pimpinan dapat memantau keterlaksanaan agenda serta ustadz penanggung jawab masing-masing kegiatan.

![Pemantauan Agenda Kegiatan](kegiatan_daftar_desktop.webp|kegiatan_daftar_mobile.webp)

## 4.2 Riwayat Pemanfaatan Layanan Santri

Menu **"Riwayat Layanan"** mencatat pemanfaatan fasilitas pendukung pondok (seperti perizinan pulang/pesiar, permohonan kunjungan wali santri, dan surat keterangan):
* Pimpinan dapat memantau tren perizinan keluar pondok untuk menjaga kedisiplinan dan keamanan seluruh santri.

![Riwayat Layanan Santri](layanan_riwayat_desktop.webp|layanan_riwayat_mobile.webp)

---

# Monitoring Aduan & Tata Kelola Aspirasi

{section:pengaduan}

Pimpinan memiliki wewenang tertinggi dalam mengawasi saluran komunikasi dan penanganan keluhan dari wali santri maupun santri:

## 5.1 Rekapitulasi Laporan Pengaduan

Menu **"Pengaduan"** menyajikan rekapitulasi status aduan masuk:
* **Menunggu Verifikasi**: Aduan baru yang belum diproses oleh pengurus.
* **Sedang Diproses**: Aduan yang telah ditugaskan kepada staf terkait untuk investigasi atau perbaikan di lapangan.
* **Selesai**: Aduan yang telah ditindaklanjuti dan mendapatkan konfirmasi penyelesaian dari pihak pelapor.

![Pengawasan Pengaduan](pengaduan_daftar_desktop.webp|pengaduan_daftar_mobile.webp)

## 5.2 Pengawasan Ketuntasan Disposisi

1. Klik tombol **"Detail"** pada baris pengaduan untuk membaca kronologi masalah, foto bukti pendukung, dan tanggapan berkala yang diberikan pengurus.
2. Pimpinan dapat mengevaluasi kecepatan tanggap staf operasional demi menjaga reputasi dan kepercayaan masyarakat terhadap pondok pesantren.

---

# Evaluasi Finansial & Arus Kas Pondok

{section:keuangan}

Manajemen finansial yang sehat dan transparan merupakan pilar utama keberlangsungan operasional pesantren:

## 6.1 Laporan Rekapitulasi Finansial

Menu **"Keuangan"** menyajikan analitik penerimaan dana pendidikan:
* Menampilkan total tagihan yang diterbitkan pada tahun ajaran aktif.
* Menampilkan persentase realisasi penerimaan (*collection rate*) dari pembayaran SPP, uang makan, dan biaya asrama.

![Laporan Keuangan Eksekutif](keuangan_laporan_desktop.webp|keuangan_laporan_mobile.webp)

## 6.2 Pemantauan Tunggakan Santri

Pimpinan dapat meninjau rincian santri yang mengalami keterlambatan pembayaran:
* Membedakan antara santri yang memerlukan dispensasi khusus/beasiswa dengan penanganan reguler.
* Memberikan dasar kebijakan keringanan pembiayaan bagi santri yang berprestasi atau yatim/dhuafa.

---

# Evaluasi Mutu & Suara Santri (Feedback)

{section:feedback}

Untuk menjaga kepuasan santri terhadap mutu kehidupan di asrama, SIM-Tren menyediakan sistem umpan balik berkala:

## 7.1 Indeks Kepuasan Santri

Menu **"Feedback"** merangkum skor kepuasan santri terhadap berbagai aspek:
* **Kualitas Makanan Dapur Pondok**: Penilaian rasa, gizi, dan kebersihan makanan.
* **Kebersihan Sarana & Prasarana**: Ketersediaan air bersih di kamar mandi, sanitasi tempat wudhu, dan kenyamanan kamar.
* **Mutu Pembelajaran Kelas**: Ulasan santri terhadap metode pengajaran ustadz di kelas madrasah.

![Evaluasi Mutu & Feedback Santri](feedback_evaluasi_desktop.webp|feedback_evaluasi_mobile.webp)

## 7.2 Menindaklanjuti Masukan Kualitatif

Pimpinan dapat membaca saran dan kritik konstruktif yang dituliskan langsung oleh santri secara objektif, guna merencanakan renovasi fisik gedung atau peningkatan kualitas gizi dapur umum.

---

# Monitoring Penerimaan Santri Baru (PPDB)

{section:ppdb}

Keberhasilan regenerasi santri dipantau secara langsung melalui portal PPDB terintegrasi:

## 8.1 Dashboard Rekapitulasi Gelombang Pendaftaran

Menu **"PPDB > Rekapitulasi"** memuat grafik corong konversi penerimaan santri:
* Menampilkan jumlah pengunjung formulir, pendaftar yang telah mengisi biodata, berkas yang telah diverifikasi, hingga santri yang telah melunasi biaya daftar ulang.

![Rekapitulasi Penerimaan Santri Baru](ppdb_rekapitulasi_desktop.webp|ppdb_rekapitulasi_mobile.webp)

## 8.2 Verifikasi Berkas Calon Santri

Menu **"PPDB > Pendaftar"** memuat tabel seluruh calon santri baru:
* Pimpinan dapat meninjau asal sekolah pendaftar, daerah domisili asal, dan kelengkapan dokumen persyaratan (ijazah, KK, akta lahir).

![Daftar Calon Santri PPDB](ppdb_pendaftar_desktop.webp|ppdb_pendaftar_mobile.webp)

## 8.3 Pengawasan Keputusan Seleksi Masuk

Menu **"PPDB > Seleksi"** menampilkan hasil tes baca Al-Qur'an, hafalan juz amma, pengetahuan agama, dan tes wawancara kepribadian calon santri untuk menentukan penerimaan secara transparan.

---

# Pengawasan Sanitasi & Kesehatan Santri (Poskestren)

{section:kesehatan}

Pengendalian wabah penyakit menular (khususnya scabies/gudikan) di pesantren menjadi prioritas utama Pimpinan demi kenyamanan santri beribadah dan menuntut ilmu:

## 9.1 Inspeksi Kebersihan Kamar Asrama

Menu **"Absensi Kesehatan"** menampilkan rekapitulasi penilaian berkala kamar santri:
* Memantau kamar-kamar yang memiliki skor sanitasi rendah (kurang ventilasi udara atau penumpukan pakaian kotor) agar wali asrama segera melakukan penertiban.

![Inspeksi Sanitasi Kamar Asrama](absensi_daftar_desktop.webp|absensi_daftar_mobile.webp)

## 9.2 Pengawasan Rekam Medis & Skrining Scabies

Menu **"Screening Scabies"** memuat status klinis santri di seluruh asrama:
* Memantau santri yang memerlukan isolasi sementara di Poskestren agar penularan terhenti.
* Memastikan santri yang bergejala mendapatkan terapi salep permetrin sesuai anjuran tim medis.

![Monitoring Skrining Scabies](screening_daftar_desktop.webp|screening_daftar_mobile.webp)

## 9.3 Evaluasi Kepatuhan Cuci Tangan Santri

Menu **"Observasi Cuci Tangan"** menyajikan rekam jejak penilaian 6 langkah cuci tangan WHO santri:
* Memastikan budaya hidup bersih dan sehat (*PHBS*) tertanam secara mendalam dalam karakter setiap santri pondok.

![Monitoring Kepatuhan Cuci Tangan](observasi_daftar_desktop.webp|observasi_daftar_mobile.webp)

---

# Profil Pimpinan & Keamanan Akun

{section:profil}

## 10.1 Memperbarui Data Profil Pimpinan

1. Klik menu **"Edit Profil"** pada bilah bawah sidebar.
2. Halaman profil menampilkan Nama Lengkap, NIP/Identitas Pimpinan, Email, dan Foto Profil resmi.
3. Pastikan nomor kontak telepon tetap terbarui untuk koordinasi strategis pondok.

![Profil Pengasuh Pimpinan](profil_utama_desktop.webp|profil_utama_mobile.webp)

## 10.2 Keamanan Akun & Bantuan Sistem

* Lakukan penggantian kata sandi secara berkala melalui menu profil demi mencegah kebocoran informasi strategis pondok.
* Menu **"FAQ"** menyediakan panduan cepat fungsi sistem serta nomor kontak tim pengembang SIM-Tren untuk asistensi teknis darurat.
