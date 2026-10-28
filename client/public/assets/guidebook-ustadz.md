# Pendahuluan

{section:pendahuluan}

**SIM-Tren (Sistem Informasi Manajemen Pesantren)** adalah platform terintegrasi Pondok Pesantren Modern Darun-Na'im Yapia (PPDNY) yang dirancang untuk mendukung operasional pendidikan, kedisiplinan, dan pembinaan santri secara modern dan transparan.

Bagi **Ustadz / Pengajar**, sistem ini dirancang secara khusus untuk mempermudah tugas pembimbingan dan pengawasan tanpa beban administratif yang rumit. Melalui portal ini, Anda dapat:

* Memantau biodata, kontak orang tua/wali, serta riwayat kehadiran santri binaan (baik perwalian kelas maupun kamar asrama).
* Menjadwalkan dan mengelola kegiatan pembinaan khusus kelas atau kamar yang Anda ampu.
* Memantau agenda rutin seluruh pesantren yang diterbitkan oleh Pengurus Pusat.
* Melaporkan catatan kedisiplinan, pelanggaran, atau kendala santri secara langsung kepada jajaran Pengurus Pondok.
* Berdiskusi secara interaktif melalui tanggapan pengaduan hingga masalah terselesaikan.
* Memperbarui profil pribadi dan mengelola kata sandi akun secara mandiri.

> [!tip]
> SIM-Tren dirancang berbasis **Progressive Web App (PWA)** dengan antarmuka yang sangat responsif di perangkat *mobile* (smartphone). Anda dapat menginstalnya di layar utama ponsel untuk akses cepat saat sedang bertugas di kelas maupun di asrama.

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
2. Pada formulir login, masukkan salah satu pengenal terdaftar: **NIP** (contoh: `UST001`), **Email**, atau **Nomor HP aktif**.
3. Masukkan **Kata Sandi** Anda (ketuk ikon mata untuk memastikan ketikan sandi tidak keliru).
4. Ketuk tombol **"Masuk"**. Sistem akan memvalidasi kredensial dan langsung mengarahkan Anda ke Dashboard Ustadz.

![Halaman Login](auth_login_desktop.png|auth_login_mobile.png)

> [!note]
> Bila Anda memiliki lebih dari satu hak akses (misalnya Ustadz sekaligus Pengurus Pondok), sistem akan menampilkan pilihan peran sebelum masuk ke dashboard. Pilih peran **"Ustadz"**.

## 2.3 Lupa Kata Sandi

Apabila Anda tidak dapat mengingat kata sandi akun:

1. Di bawah tombol Masuk, ketuk tautan **"Lupa kata sandi?"**.
2. Pada modal pemulihan kata sandi yang muncul:
   * Pilih tipe akun: **Ustadz / Pengajar**.
   * Isi Nama Lengkap, NIP, serta Nomor WhatsApp Anda.
3. Ketuk tombol **"Kirim ke WhatsApp"**.
4. Sistem akan otomatis menyiapkan pesan konfirmasi langsung ke nomor WhatsApp Administrator Sistem untuk verifikasi dan pengaturan ulang (*reset*) sandi Anda.

![Lupa Kata Sandi](auth_lupa_password_desktop.png|auth_lupa_password_mobile.png)

## 2.4 Cara Keluar (Logout)

Untuk mengamankan sesi akun setelah selesai bertugas, terutama bila menggunakan komputer bersama di kantor asatidz:
* **Pada Tampilan Desktop/Laptop**: Ketuk foto avatar di pojok kanan atas, lalu pilih opsi berwarna merah **"Keluar"**.
* **Pada Tampilan Smartphone**: Buka menu **Profil** dari navigasi bawah, gulir ke bagian paling bawah, lalu ketuk tombol **"Keluar dari Akun"**.

---

# Dashboard Utama

{section:dashboard}

Setelah proses masuk berhasil, Anda langsung disambut oleh halaman **Dashboard Ustadz** yang menyajikan ringkasan informasi terpenting secara padat dan intuitif.

![Dashboard Utama Ustadz](dashboard_main_desktop.png|dashboard_main_mobile.png)

## Elemen Utama Dashboard:

* **Header & Identitas**: Menampilkan ucapan *Ahlan wa Sahlan*, nama lengkap Ustadz, NIP, serta *badge* jabatan perwalian aktif (contoh: `Wali Kelas VII-A`, `Wali Kamar Umar bin Khattab`, atau `Pengajar`).
* **Menu Akses Cepat**: Tiga tombol pintas utama yang mempermudah navigasi langsung:
  * **Santri** (Ikon Hijau): Menuju daftar santri binaan.
  * **Kegiatan** (Ikon Biru): Menuju jadwal agenda pondok dan kelas.
  * **Pengaduan** (Ikon Oranye): Menuju catatan pelanggaran dan aspirasi santri.
* **Kegiatan & Jadwal Hari Ini**: Menampilkan agenda pondok yang terjadwal untuk hari ini lengkap dengan rentang jam pelaksanaan dan deskripsi singkat.
* **Pengaduan Santri Terbaru**: Menampilkan laporan kedisiplinan terbaru yang membutuhkan perhatian Anda dengan status (*Aktif* atau *Selesai*).
* **Ikhtisar Pondok (Kolom Kanan)**: Tiga kartu statistik kunci:
  * **Total Santri Aktif**: Akumulasi santri aktif di pondok pesantren.
  * **Pengaduan Belum Selesai**: Jumlah laporan kedisiplinan yang masih dalam proses penanganan.
  * **Kegiatan Aktif**: Total agenda pondok yang sedang berjalan.

## Notifikasi Sistem

Di pojok kanan atas header terdapat ikon lonceng **Notifikasi**. Ketuk lonceng ini untuk melihat pemberitahuan penting seperti tanggapan baru dari pengurus terkait aduan santri atau perubahan jadwal kegiatan pondok.

![Notifikasi Ustadz](dashboard_notifikasi_desktop.png|dashboard_notifikasi_mobile.png)

---

# Profil & Akun

{section:profil}

Halaman Profil dapat diakses melalui menu dropdown header (desktop) atau ikon **Profil** di bilah navigasi bawah (mobile). Halaman ini digunakan untuk memeriksa data kepegawaian, melengkapi data diri, serta memperbarui kata sandi.

![Halaman Profil](profil_main_desktop.png|profil_main_mobile.png)

## 4.1 Mengubah Foto Profil

1. Ketuk ikon kamera kecil pada lingkaran foto profil Anda.
2. Pilih file foto resmi dari perangkat Anda.
3. Tunggu hingga proses unggah selesai dan foto profil otomatis diperbarui.

> [!important]
> Foto harus dalam format gambar (**JPG**, **JPEG**, atau **PNG**) dengan ukuran berkas maksimal **2 MB**. Disarankan menggunakan foto dengan pose sopan dan rapi mengenakan busana muslim resmi pondok.

## 4.2 Data Kepegawaian (Read-Only)

Bagian atas menyajikan data resmi kepegawaian Anda yang dikelola oleh Pengurus Pusat:
* **NIP (Nomor Induk Pegawai)**.
* **Status Akun**: Menandakan keaktifan akun di database pondok.
* **Jabatan / Amanah Binaan**: Daftar kelas walian dan kamar binaan yang saat ini diamanahkan kepada Anda.
*(Apabila terdapat ketidaksesuaian data amanah, silakan hubungi Bagian Kesantrian/Admin).*

## 4.3 Memperbarui Data Diri

Anda dapat memperbarui data kontak pribadi pada formulir di bawahnya:
* Nama Lengkap, Jenis Kelamin, Tempat & Tanggal Lahir.
* Alamat Domisili lengkap.
* Email resmi dan Nomor HP/WhatsApp aktif.
Setelah selesai mengubah data, ketuk tombol hijau **"Simpan Perubahan"**.

## 4.4 Mengubah Kata Sandi

Disarankan mengganti kata sandi secara berkala untuk menjaga kerahasiaan data santri:

1. Pada bagian informasi pribadi, ketuk tombol **"Ganti Sandi"**.
2. Modal pembaruan kata sandi akan muncul di layar.
3. Masukkan kata sandi baru Anda, lalu ulangi pada kolom konfirmasi kata sandi.
4. Ketuk **"Simpan Sandi Baru"**.

![Modal Ganti Sandi](profil_modal_password_desktop.png|profil_modal_password_mobile.png)

> [!note]
> Kata sandi baru minimal memiliki panjang **8 karakter** dan wajib mengombinasikan setidaknya satu huruf dan satu angka.

---

# Santri Binaan

{section:santri}

Modul **Santri Binaan** merupakan pusat informasi bagi Ustadz untuk memantau santri-santri yang berada dalam pengawasan langsung Anda, baik di ruang kelas maupun asrama kamar.

![Daftar Santri Binaan](santri_main_desktop.png|santri_main_mobile.png)

## 5.1 Tab "Kelas Saya" dan "Kamar Saya"

Di bagian atas daftar santri, terdapat tombol filter beralih cepat:
* **Kelas Saya**: Menampilkan daftar santri di kelas tempat Anda bertugas sebagai Wali Kelas.
* **Kamar Saya**: Menampilkan daftar santri yang menempati kamar asrama di bawah bimbingan Anda sebagai Pengawas Kamar.

## 5.2 Pencarian & Filter Sub-Kelas / Kamar

* **Bilah Pencarian**: Ketikkan nama santri atau NIS pada kolom pencarian untuk menyaring santri secara instan tanpa perlu berpindah halaman.
* **Chip Filter Sub**: Bila Anda mengampu lebih dari satu kelas atau kamar, chip pilihan di bawah kolom pencarian memungkinkan Anda memfilter santri per rombel/kamar tertentu.

## 5.3 Memantau Kehadiran Santri

Setiap kartu santri memuat indikator kehadiran kegiatan harian:
* **Badge Hijau (≥ 80%)**: Santri sangat disiplin mengikuti agenda wajib pondok.
* **Badge Kuning (60% - 79%)**: Tingkat kehadiran cukup, perlu perhatian pembina.
* **Badge Merah (< 60%)**: Santri sering absen, memerlukan evaluasi kedisiplinan dan komunikasi dengan orang tua.

## 5.4 Melihat Biodata Lengkap Santri

Ketuk tombol **"Lihat Profil"** pada kartu santri untuk membuka detail informasi:
* **Biodata Pribadi**: Nama lengkap, NIS, jenis kelamin, kelas aktif, dan kamar asrama.
* **Data Kontak Orang Tua / Wali**: Nama ayah/ibu, nomor telepon/WhatsApp wali santri (memudahkan komunikasi langsung saat darurat).
* **Riwayat Penempatan**: Riwayat kelas dan kamar dari tahun-tahun sebelumnya.

![Detail Profil Santri](santri_modal_detail_desktop.png|santri_modal_detail_mobile.png)

## 5.5 Melihat Riwayat Pengaduan Santri

Ketuk tombol **"Laporan"** dengan ikon perisai oranye untuk memeriksa rekam jejak kedisiplinan santri yang bersangkutan. Modal akan menampilkan histori laporan yang pernah tercatat atas nama santri tersebut beserta status penanganannya.

![Riwayat Laporan Santri](santri_modal_aduan_desktop.png|santri_modal_aduan_mobile.png)

---

# Agenda & Kegiatan

{section:kegiatan}

Menu **Kegiatan** memudahkan Ustadz mengetahui seluruh agenda wajib pondok pesantren serta menambahkan kegiatan perwalian khusus kelas atau asrama.

![Daftar Kegiatan](kegiatan_main_desktop.png|kegiatan_main_mobile.png)

## 6.1 Membedakan Skala Kegiatan

Setiap kartu kegiatan dilengkapi label skala sasaran:
* **Seluruh Pesantren** (Biru): Kegiatan umum pondok (contoh: Sholat Berjamaah, Muhadhoroh Akbar, Puasa Sunnah, Upacara). Kegiatan ini diterbitkan oleh Pengurus Pusat.
* **Kelas Tertentu / Kamar Tertentu** (Hijau / Ungu): Kegiatan lokal pembinaan (contoh: Bimbingan Tajwid Kelas VII-A, Kerja Bakti Kamar Umar).

## 6.2 Filter & Urutan Jadwal

* **Filter Jenis / Status**: Saring kegiatan berdasarkan status pelaksanaan (*Semua*, *Mendatang*, atau *Selesai*).
* **Filter Skala**: Filter berdasarkan rombel kelas atau kamar tertentu yang Anda bimbing.
* **Tombol Sortir**: Balik urutan penanggalan dari yang terdekat atau terlama.

## 6.3 Menambah Kegiatan Perwalian Baru

Sebagai Wali Kelas atau Pengawas Kamar, Anda berhak menambahkan agenda kegiatan mandiri:

1. Ketuk tombol putih/hijau **"+ Tambah Kegiatan"** di bagian atas.
2. Lengkapi isian formulir kegiatan:
   * **Nama Kegiatan**: Contoh *"Bimbingan Muhadatsah Malam"*.
   * **Sasaran Perwalian**: Pilih apakah kegiatan ini ditujukan untuk **Kelas Binaan** Anda atau **Kamar Binaan** Anda.
   * **Tanggal Pelaksanaan**: Tentukan hari dan tanggal acara.
   * **Waktu Mulai & Waktu Selesai**: Atur jam pelaksanaan (format jam:menit).
   * **Lokasi**: Lokasi kegiatan (contoh: *Ruang Kelas VII-A*, *Masjid Lantai 2*, dsb.).
   * **Deskripsi Agenda**: Rincian kegiatan dan perlengkapan yang wajib dibawa santri.
3. Ketuk **"Simpan Kegiatan"**.

![Modal Tambah Kegiatan](kegiatan_modal_form_desktop.png|kegiatan_modal_form_mobile.png)

## 6.4 Melihat Detail & Mengedit Kegiatan Binaan

Ketuk salah satu kartu kegiatan untuk melihat rincian lengkapnya:
* Ustadz dapat mengedit kembali nama, waktu, atau lokasi kegiatan yang **dibuat oleh Anda sendiri**.
* Untuk mengedit, buka detail kegiatan lalu ketuk tombol **"Edit Kegiatan"**.

![Detail Kegiatan](kegiatan_modal_detail_desktop.png|kegiatan_modal_detail_mobile.png)

> [!warning]
> Ustadz **tidak dapat mengubah atau menghapus** agenda bertanda skala *"Seluruh Pesantren"*. Kegiatan tingkat pesantren dikelola terpusat oleh Pengurus Pondok.

---

# Pengaduan & Kedisiplinan

{section:pengaduan}

Modul **Pengaduan** merupakan jembatan koordinasi resmi antara Ustadz dan Pengurus Kesantrian untuk mencatat, menindaklanjuti, dan memantau penyelesaian pelanggaran tata tertib santri binaan.

![Daftar Pengaduan](pengaduan_main_desktop.png|pengaduan_main_mobile.png)

## 7.1 Memantau Status Pengaduan

Daftar laporan dikelompokkan berdasarkan status:
* **Aktif (Kuning/Oranye)**: Laporan baru diajukan atau sedang dalam penanganan/musyawarah bersama tim pengurus.
* **Selesai (Hijau)**: Masalah telah ditangani, santri telah diberikan pembinaan/sanksi edukatif, dan laporan resmi ditutup.

## 7.2 Membuat Laporan Pengaduan Baru

Bila menemukan santri binaan yang melakukan pelanggaran tata tertib atau mengalami kendala khusus yang memerlukan penanganan terpadu:

1. Ketuk tombol oranye **"+ Buat Laporan Baru"**.
2. Pada modal formulir pelaporan:
   * **Pilih Santri**: Pilih santri dari daftar drop-down (hanya menampilkan santri yang berada dalam rombel perwalian Anda).
   * **Judul Laporan**: Buat judul yang padat dan jelas (contoh: *"Keterlambatan Sholat Subuh Berulang"*, *"Pelanggaran Penggunaan Fasilitas Pondok"*).
   * **Deskripsi / Kronologi**: Tuliskan detail kejadian, waktu, saksi, serta kronologi pelanggaran secara objektif.
3. Ketuk **"Kirim Pengaduan"**. Laporan akan langsung masuk ke sistem Pengurus Pondok.

![Modal Buat Pengaduan](pengaduan_modal_form_desktop.png|pengaduan_modal_form_mobile.png)

## 7.3 Ruang Diskusi & Tanggapan Terpadu

Setiap laporan memiliki ruang percakapan resmi (*Thread Tanggapan*) untuk koordinasi berkelanjutan:

1. Ketuk kartu laporan pengaduan untuk membuka **Detail Pengaduan**.
2. Anda dapat membaca tanggapan atau instruksi tindak lanjut dari Bagian Keamanan/Pengurus Pondok.
3. Ketikkan balasan atau perkembangan santri pada kolom tanggapan di bagian bawah, lalu ketuk kirim.

![Detail & Diskusi Pengaduan](pengaduan_modal_detail_desktop.png|pengaduan_modal_detail_mobile.png)

## 7.4 Menyelesaikan Pengaduan

Setelah santri mendapatkan pembinaan dan menyelesaikan konsekuensi kedisiplinan:
* Ustadz pelapor dapat mengetuk tombol **"Selesaikan Pengaduan"** di dalam modal detail.
* Status laporan akan berubah menjadi **Selesai**, menandakan kasus telah tertangani secara tuntas dalam arsip rekam jejak pondok.

> [!tip]
> Pengaduan yang telah diselesaikan akan tetap tersimpan permanen di riwayat santri sebagai bahan pertimbangan dalam penilaian rapor kepribadian dan akhlak santri di akhir semester.
