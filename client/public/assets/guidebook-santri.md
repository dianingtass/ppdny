# Pendahuluan

{section:pendahuluan}

**SIM-Tren (Sistem Informasi Manajemen Pesantren)** adalah aplikasi resmi Pondok Pesantren Modern Darun-Na'im Yapia yang dirancang khusus untuk memudahkan aktivitas digital santri selama menetap di pesantren.

Sebagai **Santri**, aplikasi ini membantu Anda untuk:

* Memantau informasi kelas, kamar, dan data diri secara mandiri
* Melihat status tagihan dan riwayat pembayaran (pembayaran dilakukan oleh Orang Tua/Wali)
* Mengikuti perkembangan agenda dan kegiatan pesantren
* Mengajukan permohonan layanan pesantren (izin, pemeriksaan, dsb.)
* Memantau kondisi kesehatan dan hasil pemeriksaan scabies
* Berkonsultasi langsung dengan Tim Kesehatan pesantren

> [!tip]
> SIM-Tren adalah sebuah **Progressive Web App (PWA)**. Artinya, aplikasi ini dapat diinstal langsung di layar utama smartphone Anda seperti aplikasi biasa melalui browser tanpa perlu mengunduh dari Play Store atau App Store.

---

# Instalasi & Login

{section:instalasi}

## 2.1 Instalasi PWA (Progressive Web App)

Cara termudah menggunakan SIM-Tren adalah dengan menginstalnya langsung di smartphone Anda:

1. Buka **browser** di smartphone Anda (Google Chrome sangat direkomendasikan).
2. Kunjungi alamat: **`https://ppdny.vercel.app`**
3. Setelah halaman terbuka, cari ikon **"Tambahkan ke layar utama"** di browser Anda (biasanya di menu titik tiga di pojok kanan atas browser).
4. Ikuti instruksi browser untuk menambahkan aplikasi ke layar utama HP Anda.
5. Aplikasi SIM-Tren kini tersedia di homescreen dan bisa dibuka seperti aplikasi biasa.

## 2.2 Cara Masuk (Login)

1. Buka aplikasi SIM-Tren di HP Anda.
2. Pada halaman **Login**, masukkan email terdaftar atau nomor induk santri Anda (NIS) di kolom Identifier.
3. Masukkan **Kata Sandi** Anda (ketuk ikon mata untuk menampilkan password).
4. Ketuk tombol **"Masuk"**.

![Halaman Login](login_desktop.png|login_mobile.png)

## 2.3 Lupa Kata Sandi

Apabila Anda lupa kata sandi Anda:

1. Di bawah tombol masuk, ketuk tautan **"Lupa kata sandi?"**.
2. Isi formulir pada modal yang muncul: pilih tipe akun **"Santri"**, lalu isi nama lengkap, NIS, dan No. HP Anda.
3. Ketuk **"Kirim ke WhatsApp"**. Sistem akan membuka chat WhatsApp ke Admin pesantren untuk mereset password Anda.

![Lupa Password](lupa_password_desktop.png|lupa_password_mobile.png)

## 2.4 Cara Keluar (Logout)

Untuk keluar dari aplikasi, ketuk ikon **Keluar** (pintu keluar merah) di menu header kanan atas (tampilan desktop) atau di bar navigasi paling bawah (tampilan mobile).

---

# Dashboard Utama

{section:dashboard}

Setelah berhasil login, Anda akan masuk ke halaman **Dashboard Santri** yang merangkum segala aktivitas Anda secara komprehensif.

![Dashboard Utama](dashboard_desktop.png|dashboard_mobile.png)

## Elemen Dashboard Utama:

* **Kartu Selamat Datang**: Menampilkan Nama, NIS, Kelas, Kamar asrama, Wali kelas, dan Pengawas kamar Anda.
* **Menu Cepat (Grid)**: Akses pintasan instan ke fitur-fitur seperti Pendataan Diri, Keuangan, Kegiatan, Pengaduan, dan Scabies.
* **Kegiatan Hari Ini**: Jadwal kegiatan yang wajib Anda ikuti pada hari ini.
* **Ringkasan Pengaduan & Aktivitas Kesehatan**: Menampilkan data screening kesehatan scabies terakhir dan catatan laporan pelanggaran terbaru atas nama Anda.
* **Status Tagihan**: Menampilkan kartu ringkasan status keuangan pesantren Anda.

---

# Notifikasi

{section:notifikasi}

Fitur Notifikasi (ikon lonceng di pojok kanan atas) menyimpan pemberitahuan penting seperti tagihan baru, ulasan kegiatan, konfirmasi permohonan layanan, dan screening scabies terbaru.

![Notifikasi](notifikasi_desktop.png|notifikasi_mobile.png)

---

# Profil & Akun

{section:profil}

Halaman ini digunakan untuk mengelola data pribadi, mengganti foto profil, mengganti password, dan menautkan akun Orang Tua.

![Profil Santri](profil_desktop.png|profil_mobile.png)

## 5.1 Mengubah Foto Profil

Ketuk ikon kamera di atas foto profil Anda, pilih file foto dari HP/desktop Anda (Format: JPG/PNG, maksimal 2MB).

![Upload Foto](profil_upload_foto_desktop.png|profil_upload_foto_mobile.png)

## 5.2 Data Diri & Data Kamar/Kelas

Isi data diri Anda secara lengkap mulai dari tempat lahir, alamat, jenis kelamin, dan nomor HP aktif.

> [!important]
> Data diri Anda akan **dikunci (locked) otomatis** secara permanen setelah semua formulir wajib terisi. Jika ada perubahan data setelah terkunci, silakan hubungi Admin pesantren.

![Data Diri](profil_data_diri_desktop.png|profil_data_diri_mobile.png)

## 5.3 Menautkan Data Orang Tua / Wali

Hubungkan akun Anda dengan akun Orang Tua Anda agar mereka dapat memantau pembayaran dan tagihan Anda di pesantren. Jika data sudah diinput, statusnya akan terkunci.

![Orang Tua](profil_ortu_locked_desktop.png|profil_ortu_locked_mobile.png)

## 5.4 Mengganti Password

Ketuk tombol **"Ganti Kata Sandi"**, masukkan password baru Anda (minimal 6 karakter) dan konfirmasi kembali.

![Ganti Password](profil_modal_ganti_password_desktop.png|profil_modal_ganti_password_mobile.png)

---

# Tagihan & Keuangan

{section:keuangan}

Halaman ini menyajikan status tagihan Anda (SPP, uang buku, dsb.) baik yang belum dibayar, menunggu konfirmasi, maupun yang sudah lunas.

> [!note]
> Santri **hanya dapat memantau** informasi tagihan. Pembayaran tagihan dan upload bukti transfer harus dilakukan oleh Orang Tua/Wali melalui akun wali masing-masing.

![Keuangan](keuangan_desktop.png|keuangan_mobile.png)

## Detail & Riwayat Pembayaran Tagihan:

Ketuk tombol **"Lihat Detail"** pada tagihan mana saja untuk membuka rincian log pembayaran dan melihat status verifikasi pembayaran oleh Pengurus.

![Detail Tagihan](keuangan_modal_detail_desktop.png|keuangan_modal_detail_mobile.png)

---

# Kegiatan Pesantren

{section:kegiatan}

Di halaman ini Anda dapat melihat jadwal, agenda harian, dan ulasan kegiatan pesantren yang wajib Anda ikuti.

![Daftar Kegiatan](kegiatan_desktop.png|kegiatan_mobile.png)

## 7.1 Detail Kegiatan

Ketuk tombol **"Detail Kegiatan"** pada salah satu agenda untuk mengetahui deskripsi kegiatan, penanggung jawab, lokasi, dan waktu mulainya.

![Detail Kegiatan](kegiatan_modal_detail_desktop.png|kegiatan_modal_detail_mobile.png)

## 7.2 Mengisi Ulasan / Feedback Kegiatan

Setelah suatu kegiatan selesai dilaksanakan, Anda dapat berkontribusi dengan mengirimkan ulasan. Ketuk tombol **"Beri Ulasan"** di dalam modal detail, beri bintang (1-5), dan ketik ulasan Anda di form yang disediakan.

---

# Pengaduan Pelanggaran

{section:pengaduan}

Halaman ini menyajikan rekaman pelanggaran (kronologi kedisiplinan) atas nama Anda yang dilaporkan oleh Ustadz atau Pengurus.

> [!important]
> Santri **tidak dapat** membuat pengaduan baru atau mengubah status pengaduan. Halaman ini bertindak sebagai media transparansi agar Anda dapat memantau status laporan Anda.

![Pengaduan](pengaduan_desktop.png|pengaduan_mobile.png)

## Detail & Riwayat Percakapan Pengaduan:

Ketuk kartu laporan pelanggaran Anda untuk melihat rincian laporan, nama pelapor, tanggal, dan riwayat tanggapan/solusi pelanggaran dari Ustadz.

![Rincian Pengaduan](pengaduan_modal_detail_desktop.png|pengaduan_modal_detail_mobile.png)

---

# Layanan Pesantren

{section:layanan}

Melalui fitur ini, Anda dapat mengajukan permohonan resmi kepada pengurus, seperti Izin Pulang, Permohonan Obat, Layanan Surat Menyurat, dan lainnya.

![Layanan](layanan_desktop.png|layanan_mobile.png)

## 9.1 Detail Layanan & Prosedur Pengajuan

Ketuk layanan yang Anda inginkan, baca deskripsi serta estimasi pengerjaannya, lalu klik **"Ajukan Sekarang"**. Isi formulir permohonan dan simpan.

![Detail Layanan](layanan_modal_detail_desktop.png|layanan_modal_detail_mobile.png)

![Form Layanan](layanan_modal_form_desktop.png|layanan_modal_form_mobile.png)

## 9.2 Riwayat Pengajuan & Unduh Bukti PDF

Di halaman Riwayat Layanan, Anda dapat memantau permohonan Anda (Menunggu, Diproses, Selesai, atau Batal). Ketuk **"Lihat Rincian Log"** pada layanan yang berstatus Selesai untuk mengunduh bukti permohonan resmi dalam format PDF.

![Riwayat Layanan](riwayat_layanan_desktop.png|riwayat_layanan_mobile.png)

![Log Log Layanan](riwayat_layanan_modal_detail_desktop.png|riwayat_layanan_modal_detail_mobile.png)

## 9.3 Mengirim Feedback Layanan

Beri penilaian dan bintang ulasan pada layanan yang telah diselesaikan untuk perbaikan kinerja petugas pelayanan pesantren.

![Feedback Layanan](riwayat_layanan_modal_feedback_desktop.png|riwayat_layanan_modal_feedback_mobile.png)

---

# Kesehatan & Scabies

{section:scabies}

Fitur khusus untuk memantau pencegahan dan screening infeksi scabies di lingkungan asrama pesantren.

![Dashboard Scabies](scabies_dashboard_desktop.png|scabies_dashboard_mobile.png)

## 10.1 Membaca Artikel Edukasi Scabies

Akses modul edukasi untuk membaca panduan penanganan, tips kesehatan, dan artikel-artikel PHBS.

![Daftar Materi Scabies](scabies_materi_desktop.png|scabies_materi_mobile.png)

![Detail Materi Scabies](scabies_detail_materi_desktop.png|scabies_detail_materi_mobile.png)

## 10.2 Mengajukan Materi Pengalaman

Tulis dan ajukan pengalaman pribadi Anda mengatasi scabies agar dapat dipublikasikan dan dibaca oleh santri lainnya setelah divalidasi oleh Tim Kesehatan.

![Ajukan Materi](scabies_modal_ajukan_materi_desktop.png|scabies_modal_ajukan_materi_mobile.png)

---

# Konsultasi Tim Kesehatan

{section:konsultasi}

Melalui fitur ini, Anda dapat berkonsultasi (chat) secara langsung dengan anggota Tim Kesehatan pesantren yang bertugas.

![Konsultasi Timkes](konsultasi_desktop.png|konsultasi_mobile.png)

## 11.1 Memulai Sesi Percakapan

Pilih anggota tim kesehatan yang berstatus **"Tersedia"**, lalu ketuk tombol **"Mulai Konsultasi"** untuk masuk ke dalam ruang percakapan. Jika status "Full", Anda akan masuk daftar antrian.

![Ruang Chat Konsultasi](konsultasi_room_riwayat_desktop.png|konsultasi_room_riwayat_mobile.png)

## 11.2 Mengakses Riwayat Konsultasi

Ketuk tab **"Riwayat Percakapan"** untuk melihat sesi chat konsultasi yang telah ditutup sebelumnya dalam format baca-saja.

![Riwayat Konsultasi](konsultasi_riwayat_desktop.png|konsultasi_riwayat_mobile.png)
