# Pendahuluan

{section:pendahuluan}

**SIM-Tren (Sistem Informasi Manajemen Pesantren)** adalah platform terpadu Pondok Pesantren Modern Darun-Na'im Yapia (PPDNY) yang menghubungkan seluruh ekosistem pondok—mulai dari santri, ustadz, pimpinan, pengurus, hingga orang tua dan wali santri.

Bagi **Orang Tua / Wali Santri**, portal ini dirancang sebagai jendela transparan pemantauan perkembangan putra-putri tercinta selama menempuh pendidikan dan mondok di PPDNY. Tanpa harus menunggu kepulangan berkala atau menghubungi pengurus secara manual, wali santri dapat:

* **Memonitor Multi-Anak Secara Fleksibel**: Beralih antar-profil santri secara instan (*Switch Anak*) dalam satu akun wali keluarga.
* **Memantau Kondisi Kesehatan & Scabies Real-Time**: Melihat catatan screening medis, riwayat pemeriksaan klinis, serta grafik evaluasi kebersihan santri.
* **Mengelola Pembayaran & Tagihan SPP**: Melihat rincian tagihan aktif, mengunggah bukti transfer bank secara digital, serta mengunduh riwayat pembayaran lunas.
* **Memantau Agenda & Kegiatan Santri**: Mengetahui jadwal pembelajaran, pembinaan asrama, serta tingkat kehadiran anak pada kegiatan pondok.
* **Menyampaikan Aspirasi & Pengaduan**: Menyampaikan laporan, keluhan fasilitas, maupun permohonan bantuan langsung ke jajaran pengurus pondok dan memantau respons tindak lanjutnya.
* **Memperbarui Data Diri & Keamanan Akun**: Memperbarui nomor kontak WhatsApp resmi dan mengelola kata sandi secara mandiri.

> [!tip]
> SIM-Tren mendukung **Progressive Web App (PWA)** sehingga dapat dipasang langsung di layar utama smartphone Android maupun iPhone Anda seperti aplikasi native, tanpa memakan banyak memori penyimpanan ponsel.

---

# Instalasi & Login

{section:instalasi}

## 2.1 Instalasi PWA (Progressive Web App)

Untuk kenyamanan akses sehari-hari dari ponsel pintar:

1. Buka peramban (*web browser*) di ponsel Anda (disarankan **Google Chrome** pada perangkat Android atau **Safari** pada perangkat iPhone/iPad).
2. Kunjungi situs resmi SIM-Tren PPDNY di tautan yang disediakan oleh sekretariat pesantren.
3. Buka menu opsi peramban:
   * Pada **Google Chrome**: Ketuk ikon **Titik Tiga** di pojok kanan atas, lalu pilih **"Tambahkan ke Layar Utama"** (*Add to Home Screen*) atau ketuk tombol banner **"Instal SIM-Tren"** jika muncul.
   * Pada **Safari**: Ketuk tombol **Bagikan** (*Share* berikon kotak panah ke atas) di bagian bawah layar, gulir ke bawah dan pilih **"Tambahkan ke Layar Utama"** (*Add to Home Screen*).
4. Konfirmasikan nama aplikasi dan ketuk **"Tambah / Instal"**.
5. Ikon SIM-Tren kini tersimpan di layar utama ponsel dan dapat dibuka dengan tampilan layar penuh yang cepat dan bebas gangguan alamat URL.

## 2.2 Cara Masuk (Login)

1. Buka aplikasi SIM-Tren di peramban atau ikon layar utama ponsel Anda.
2. Masukkan salah satu identitas terdaftar pada kolom **"Email atau Nomor HP"**:
   * Alamat **Email** yang didaftarkan saat pendaftaran santri (contoh: `ayah@gmail.com`).
   * Atau **Nomor WhatsApp / HP** yang terdaftar di sistem.
3. Masukkan **Kata Sandi** akun Anda. Anda dapat mengetuk ikon mata untuk melihat karakter sandi yang diketik.
4. Ketuk tombol **"Masuk"**. Sistem akan memvalidasi data dan mengarahkan Anda ke Dashboard Wali Santri.

![Halaman Login](auth_login_desktop.png|auth_login_mobile.png)

> [!note]
> Apabila nomor HP atau email Anda belum terdaftar di SIM-Tren, silakan hubungi bagian Administrasi Pesantren untuk sinkronisasi data wali dengan santri terkait.

## 2.3 Lupa Kata Sandi

Jika Anda lupa kata sandi akun Anda:

1. Pada halaman login di bawah kolom isian sandi, ketuk tautan **"Lupa kata sandi?"**.
2. Pada modal bantuan pemulihan yang terbuka:
   * Pilih tipe akun: **Orang Tua / Wali**.
   * Masukkan **Nama Lengkap** wali santri dan **Nomor WhatsApp** yang terdaftar.
3. Ketuk tombol **"Kirim ke WhatsApp"**.
4. Sistem akan mengarahkan Anda membuka aplikasi WhatsApp dengan pesan permohonan reset sandi otomatis yang ditujukan ke Administrator SIM-Tren PPDNY. Tim Admin akan memverifikasi data keluarga sebelum memberikan tautan reset sandi baru.

![Lupa Kata Sandi](auth_lupa_password_desktop.png|auth_lupa_password_mobile.png)

## 2.4 Cara Keluar (Logout)

Demi keamanan akun, pastikan Anda keluar setelah menggunakan perangkat bersama:

* **Pada Komputer / Laptop**: Klik foto profil Anda di pojok kanan atas layar, lalu klik menu **"Keluar"**.
* **Pada Smartphone**: Ketuk ikon **"Keluar"** di bilah navigasi bawah (*Bottom Nav*), atau buka menu profil di bagian kanan atas lalu pilih **"Keluar"**.

---

# Dashboard & Fitur Multi-Santri

{section:dashboard}

## 3.1 Tampilan Beranda Wali Santri

Saat berhasil masuk, Anda akan disambut oleh Dashboard Utama yang menyajikan ringkasan holistik kondisi anak Anda:

![Dashboard Utama](dashboard_utama_desktop.png|dashboard_utama_mobile.png)

Dashboard tersusun atas beberapa bagian utama:
* **Kartu Identitas Santri Aktif**: Menampilkan foto profil santri, nama lengkap, Nomor Induk Santri (NIS), nama kelas, dan nama kamar asrama.
* **Tombol Cepat Bayar Tagihan**: Pintasan langsung menuju halaman pembayaran tagihan terdekat.
* **Menu Cepat Wali**: Ikon jalan pintas menuju modul *Keuangan*, *Kegiatan*, *Aduan*, *Scabies (Kesehatan)*, dan *Buku Panduan*.
* **Statistik Cepat**: Angka riil jumlah tagihan yang belum dibayar serta total kehadiran kegiatan santri.
* **Pengaduan Terakhir**: Daftar aduan terakhir terkait anak beserta status penyelesaiannya.
* **Widget Tagihan Mendesak**: Menampilkan nama tagihan terdekat beserta nominal dan batas tanggal jatuh tempo.
* **Widget Kondisi Kesehatan**: Status observasi cuci tangan terakhir dan diagnosa medis terkini.

## 3.2 Fitur Unggulan: Mengganti Santri Aktif (Switch Anak)

Bagi orang tua yang memondokkan lebih dari satu anak di PPDNY, SIM-Tren menyediakan fitur **Switch Anak** terintegrasi tanpa perlu keluar (*logout*) dari akun:

1. Perhatikan bagian atas kartu profil santri, di samping tulisan `DATA ANAK ANDA`.
2. Klik atau ketuk menu dropdown pemilih: **"Ganti ke: [Nama Anak]"**.
3. Pilih nama anak yang ingin Anda pantau.
4. Seluruh data pada dashboard—mulai dari tagihan SPP, agenda kegiatan, catatan kesehatan, hingga aduan—akan **otomatis berubah seketika** menampilkan data anak yang dipilih.

![Fitur Ganti Santri](dashboard_switch_anak_desktop.png|dashboard_switch_anak_mobile.png)

> [!important]
> Pilihan santri aktif akan tersimpan di perangkat Anda. Setiap kali Anda membuka halaman lain (seperti Keuangan atau Kegiatan), data yang ditampilkan selalu mengacu pada anak yang sedang aktif dipilih.

## 3.3 Menu Navigasi Cepat Wali

Di bawah kartu profil, tersedia panel **Menu Wali** dengan kode warna intuitif:

| Menu | Ikon | Warna | Fungsi Utama |
| :--- | :--- | :--- | :--- |
| **Keuangan** | Dompet / Kartu | Hijau | Cek tagihan aktif, rincian biaya, dan upload bukti transfer |
| **Kegiatan** | Kalender | Ungu | Pantau jadwal kegiatan, agenda asrama, dan absensi anak |
| **Aduan** | Tanda Seru | Oranye | Lihat riwayat aduan santri dan buat laporan baru ke pondok |
| **Scabies** | Palang Medis | Toska | Dashboard pemantauan kesehatan, screening, dan observasi |
| **Panduan** | Buku Terbuka | Biru | Membuka buku panduan interaktif SIM-Tren ini |

## 3.4 Notifikasi Sistem

SIM-Tren dilengkapi lonceng notifikasi real-time di pojok kanan atas:

1. Ketuk ikon **Lonceng** pada header atas.
2. Anda akan melihat daftar pemberitahuan penting, seperti penerbitan tagihan baru, perubahan status pembayaran (diverifikasi/lunas), aduan yang ditanggapi pengurus, atau jadwal kegiatan penting.
3. Ketuk salah satu notifikasi untuk langsung diarahkan ke halaman terkait.

![Pusat Notifikasi](dashboard_notifikasi_desktop.png|dashboard_notifikasi_mobile.png)

---

# Keuangan & Pembayaran SPP

{section:keuangan}

## 4.1 Memantau Tagihan Aktif & Jatuh Tempo

Modul Keuangan menyajikan transparansi seluruh kewajiban administrasi santri:

1. Dari dashboard, ketuk menu **"Keuangan"** atau tombol hijau **"Bayar Tagihan"**.
2. Anda akan diarahkan ke halaman **Daftar Tagihan**.
3. Bagian atas menyajikan **Data Diri Santri** beserta jumlah tagihan aktif yang belum lunas.
4. Tabel **Tagihan Aktif** memuat daftar tagihan yang harus dibayar, meliputi Nama Tagihan (contoh: *SPP Bulanan*, *Daftar Ulang*), Nominal Rupiah, dan Batas Waktu Pembayaran (Jatuh Tempo).

![Daftar Tagihan Keuangan](keuangan_daftar_desktop.png|keuangan_daftar_mobile.png)

> [!warning]
> Perhatikan tanggal **Batas Pembayaran**. Tagihan yang melewati batas jatuh tempo akan ditandai dengan teks warna merah sebagai tagihan mendesak.

## 4.2 Melihat Rincian Biaya Tagihan

Untuk memastikan detail komponen yang harus dibayarkan:

1. Pada baris tagihan aktif yang bersangkutan, klik tombol **"Lihat Detail"**.
2. Modal rincian tagihan akan terbuka di layar, menampilkan informasi lengkap mengenai nama tagihan, tanggal terbit, batas jatuh tempo, dan rincian total nominal.
3. Jika Anda siap melakukan pembayaran, Anda dapat langsung mengklik tombol **"Bayar Sekarang"** di dalam modal tersebut.

![Detail Tagihan Modal](keuangan_detail_desktop.png|keuangan_detail_mobile.png)

## 4.3 Mengunggah Bukti Pembayaran (Transfer Bank)

SIM-Tren memudahkan pembayaran secara non-tunai melalui transfer bank resmi pesantren:

1. Lakukan transfer dana melalui ATM, Mobile Banking, atau Internet Banking ke nomor rekening resmi PPDNY yang tertera pada panduan pembayaran. Simpan struk bukti transfer atau tangkapan layar (*screenshot*) transaksi Anda (format JPG, PNG, atau WebP, maks. 2MB).
2. Pada modal rincian tagihan atau baris tagihan, klik tombol **"Bayar Sekarang"**.
3. Modal formulir **Konfirmasi Pembayaran** akan muncul:
   * Sistem menampilkan nomor rekening tujuan pesantren dan nama tagihan.
   * Klik area unggah file **"Pilih Bukti Pembayaran"** untuk memilih berkas foto/gambar struk transfer dari perangkat Anda.
   * Pastikan nama pengirim, nominal transfer, tanggal transaksi, dan nomor referensi terbaca jelas.
4. Klik tombol **"Kirim Bukti Pembayaran"**.
5. Status tagihan akan berubah menjadi **"Perlu Konfirmasi"** (berwarna kuning). Pengurus bagian keuangan pondok akan memverifikasi mutasi bank dan mengubah statusnya menjadi **"Lunas"**.

![Formulir Bayar & Upload Bukti](keuangan_bayar_desktop.png|keuangan_bayar_mobile.png)

> [!note]
> Selama status masih bertuliskan **Perlu Konfirmasi**, bukti transfer Anda sedang diperiksa oleh bendahara pondok. Anda tidak perlu mengunggah ulang bukti kecuali ada permintaan revisi.

## 4.4 Riwayat Pembayaran Lunas

Di bawah tabel tagihan aktif, terdapat bagian **Riwayat Tagihan Lunas**:
* Menyimpan seluruh arsip pembayaran yang telah berhasil diverifikasi oleh bendahara.
* Menampilkan nama tagihan, nominal yang dibayarkan, dan tanggal pelunasan resmi.
* Anda dapat mengklik tombol **"Lihat Detail"** pada riwayat untuk melihat arsip tanda terima atau bukti transaksi yang pernah dikirimkan.

---

# Pemantauan Kesehatan & Scabies

{section:kesehatan}

Pondok Pesantren Modern Darun-Na'im Yapia memiliki program unggulan pemantauan kesehatan terpadu dan pencegahan penyakit kulit (Scabies) yang dikelola oleh Poskestren (Pos Kesehatan Pesantren).

## 5.1 Dashboard Analitik Scabies Santri

Dari beranda utama, ketuk menu **"Scabies"** (ikon palang medis toska) untuk membuka **Analytical Dashboard Monitoring Scabies**:

![Dashboard Analitik Kesehatan & Scabies](kesehatan_dashboard_desktop.png|kesehatan_dashboard_mobile.png)

Halaman analitik ini memuat:
1. **Screening Terakhir**: Menampilkan diagnosa medis terakhir santri (*Bukan Scabies*, *Evaluasi Lanjutan*, atau *Scabies*) beserta tanggal pemeriksaan tim medis.
2. **Observasi Terakhir**: Menampilkan skor dan kategori kepatuhan cuci tangan anak (misalnya: *100 - Sangat Baik*).
3. **Total Riwayat Screening**: Akumulasi total frekuensi anak telah diperiksa oleh Poskestren.
4. **Riwayat Aman**: Jumlah pemeriksaan yang menyatakan kondisi anak bersih dan sehat.
5. **Grafik Tren Bulanan**: Grafik garis (*line chart*) interaktif yang memperlihatkan riwayat status kesehatan anak dari bulan ke bulan pada tahun berjalan.
6. **Insight Wali**: Catatan kecerdasan sistem mengenai intensitas pemantauan kebersihan dan rekomendasi untuk orang tua di rumah.

## 5.2 Portal Riwayat Screening Lengkap

Untuk melihat setiap catatan pemeriksaan fisik yang dilakukan oleh tenaga medis:

1. Pada kartu *Riwayat Screening Terakhir*, klik tombol **"Lihat Selengkapnya"**.
2. Anda akan diarahkan ke halaman **Portal Screening Santri**:
   * Menampilkan daftar seluruh riwayat screening dengan status tanggal, diagnosa, dan catatan tim kesehatan.
   * Anda dapat melihat apakah santri membutuhkan salep/obat khusus, isolasi sementara, atau pemantauan kebersihan pakaian di kamar asrama.

![Portal Riwayat Screening](kesehatan_screening_portal_desktop.png|kesehatan_screening_portal_mobile.png)

## 5.3 Portal Riwayat Observasi Perilaku Cuci Tangan

Pencegahan scabies dimulai dari disiplin mencuci tangan menggunakan sabun air mengalir:

1. Pada kartu *Riwayat Observasi Terakhir*, klik tombol **"Lihat Selengkapnya"**.
2. Anda akan diarahkan ke halaman **Portal Observasi Santri**:
   * Menampilkan tabel penilaian 6 langkah cuci tangan yang dipantau langsung oleh kader kesehatan dan pengurus asrama.
   * Skor evaluasi disajikan dalam skala nilai dan kategori (Sangat Baik, Baik, Cukup, Perlu Bimbingan).

![Portal Riwayat Observasi](kesehatan_observasi_portal_desktop.png|kesehatan_observasi_portal_mobile.png)

> [!tip]
> Apabila hasil observasi atau screening anak memerlukan evaluasi lanjutan, orang tua disarankan memberikan edukasi saat jam kunjungan atau menjalin komunikasi dengan pengasuh kamar santri.

---

# Agenda & Jadwal Kegiatan Santri

{section:kegiatan}

## 6.1 Daftar Agenda & Jadwal Santri

Untuk mengetahui rutinitas harian, kegiatan ekstrakurikuler, dan acara besar pesantren yang diikuti putra-putri Anda:

1. Dari dashboard, ketuk menu **"Kegiatan"** (ikon kalender ungu).
2. Halaman **Kegiatan Anak** akan menampilkan daftar agenda terjadwal secara kronologis.
3. Setiap kartu kegiatan mencantumkan:
   * Nama Acara / Kegiatan (contoh: *Muhadhoroh Akbar*, *Kajian Kitab Kuning*, *Ujian Tengah Semester*).
   * Waktu Pelaksanaan (Hari, Tanggal, Jam).
   * Lokasi Kegiatan (Masjid Utama, Aula Putra, Lapangan, atau Gedung Kelas).
   * Penanggung Jawab / Pembimbing Kegiatan.

![Daftar Kegiatan Santri](kegiatan_daftar_desktop.png|kegiatan_daftar_mobile.png)

## 6.2 Menggunakan Pencarian & Filter Waktu

Bila agenda kegiatan sangat padat, gunakan alat pencari di bagian atas:

1. **Kolom Pencarian (*Search Bar*)**: Ketikkan kata kunci nama acara (misalnya: `Kajian` atau `Ujian`). Daftar kegiatan akan tersaring secara otomatis.
2. **Filter Waktu**:
   * Klik tombol **Filter**.
   * Pilih opsi: **Semua Waktu**, **Hari Ini**, **Minggu Ini**, atau **Mendatang**.
   * Ketuk **Terapkan Filter** untuk mempersempit daftar sesuai rentang waktu yang diinginkan.

## 6.3 Melihat Rincian & Lokasi Kegiatan

1. Klik atau ketuk salah satu kartu kegiatan yang menarik perhatian Anda.
2. Modal **Detail Kegiatan** akan terbuka di layar.
3. Anda dapat membaca deskripsi lengkap acara, tujuan kegiatan, perlengkapan yang wajib dibawa santri, serta catatan khusus dari ustadz pembimbing.

![Modal Detail Kegiatan](kegiatan_detail_desktop.png|kegiatan_detail_mobile.png)

---

# Pengaduan & Layanan Aspirasi

{section:pengaduan}

PPDNY menjunjung tinggi keterbukaan dan keselamatan para santri. Modul Pengaduan adalah sarana resmi komunikasi dua arah yang aman dan tercatat rapi.

## 7.1 Transparansi Pengaduan Santri

1. Dari dashboard, ketuk menu **"Aduan"** (ikon tanda seru oranye).
2. Halaman **Laporan Pengaduan Anak** menyajikan dua kelompok laporan:
   * Laporan yang diajukan oleh anak Anda sendiri di pondok (misalnya fasilitas kamar asrama yang rusak, kendala belajar, atau keluhan kesehatan).
   * Laporan/aspirasi yang diajukan oleh Anda selaku orang tua kepada pihak pengurus.
3. Anda dapat menyaring status laporan melalui bilah filter: **Semua**, **Menunggu**, **Diproses**, atau **Selesai**.

![Daftar Laporan Pengaduan](pengaduan_daftar_desktop.png|pengaduan_daftar_mobile.png)

## 7.2 Membuat Laporan Pengaduan Baru oleh Orang Tua

Bila Anda memiliki keluhan, permohonan informasi khusus, atau masukan membangun bagi pondok:

1. Di pojok kanan atas halaman pengaduan, klik tombol oranye bertuliskan **"Buat Laporan Baru"** (pada ponsel: ikon plus `+`).
2. Modal formulir laporan akan muncul:
   * **Judul Pengaduan**: Tuliskan judul masalah secara ringkas dan jelas (contoh: *Permohonan Izin Kunjungan Khusus* atau *Konfirmasi Paket Kiriman Santri*).
   * **Deskripsi Aduan**: Uraikan permasalahan secara detail dan sopan agar pengurus dapat segera menindaklanjuti.
   * **Foto Pendukung** (opsional): Unggah foto terkait jika diperlukan (misalnya bukti kendala atau surat keterangan).
3. Klik tombol **"Kirim Pengaduan"**. Laporan akan langsung masuk ke panel kerja Pengurus Pondok dengan status awal **"Menunggu"**.

![Formulir Pengaduan Baru](pengaduan_buat_desktop.png|pengaduan_buat_mobile.png)

> [!important]
> Mohon gunakan bahasa yang santun dan sertakan informasi yang akurat. Laporan palsu atau kata-kata kasar akan langsung ditolak oleh sistem moderasi pesantren.

## 7.3 Memantau Status & Menyimak Tanggapan Pengurus

1. Klik kartu pengaduan yang ingin Anda pantau.
2. Modal **Detail Pengaduan** akan terbuka:
   * Menampilkan tanggal pengajuan, rincian keluhan, dan lencana status penanganan.
   * Di bagian bawah, terdapat kolom **Tanggapan Pengurus** yang berisi jawaban, solusi, atau tindakan yang telah diambil oleh staf pesantren.
3. Status laporan akan diperbarui dari **Menunggu** -> **Diproses** -> hingga **Selesai** setelah pengurus menuntaskan penanganan masalah.

![Rincian Tanggapan Pengaduan](pengaduan_detail_desktop.png|pengaduan_detail_mobile.png)

---

# Profil Wali & Pengaturan Akun

{section:profil}

## 8.1 Memperbarui Data Diri & Nomor Kontak

Nomor kontak orang tua yang selalu aktif sangat krusial bagi pesantren dalam keadaan mendesak:

1. Buka halaman profil:
   * **Pada Komputer**: Klik nama Anda di header kanan atas, lalu pilih **"Edit Profil"**.
   * **Pada Ponsel**: Ketuk ikon **"Profil"** pada bilah navigasi bawah (*Bottom Nav*).
2. Halaman **Profil Wali Santri** menyajikan formulir data pribadi:
   * Nama Lengkap
   * Alamat Email
   * Nomor Handphone / WhatsApp Aktif
   * Alamat Domisili
   * Hubungan Keluarga (Ayah / Ibu / Wali)
3. Perbarui informasi yang mengalami perubahan, lalu klik tombol **"Simpan Perubahan"**.

![Halaman Profil Wali](profil_utama_desktop.png|profil_utama_mobile.png)

## 8.2 Mengganti Foto Profil

1. Pada kartu avatar profil di bagian atas, klik ikon **Kamera**.
2. Pilih file foto wajah Anda yang jelas dan sopan dari galeri komputer atau ponsel (ukuran maks. 2MB).
3. Foto akan otomatis diunggah dan disimpan di sistem SIM-Tren.

## 8.3 Mengubah Kata Sandi Akun

Untuk menjaga privasi dan keamanan akun dari pihak yang tidak berwenang:

1. Pada halaman profil, klik tombol **"Ubah Kata Sandi"** (atau ikon gembok).
2. Modal pengubahan sandi akan terbuka:
   * Masukkan **Kata Sandi Baru** (minimal 6 karakter, disarankan kombinasi huruf dan angka).
   * Masukkan kembali pada kolom **Konfirmasi Kata Sandi Baru**.
3. Klik tombol **"Simpan Password Baru"**.
4. Sandi Anda berhasil diperbarui dan dapat langsung digunakan untuk masuk pada sesi berikutnya.

![Modal Ubah Kata Sandi](profil_password_desktop.png|profil_password_mobile.png)

---

> [!note]
> Bila Anda mengalami kendala teknis atau memiliki pertanyaan seputar operasional SIM-Tren, silakan menghubungi **Layanan Bantuan IT PPDNY** melalui nomor WhatsApp resmi pesantren pada jam kerja operasional kantor sekretariat.
