# Pendahuluan

{section:pendahuluan}

**Buku Panduan Pengguna SIM-Tren PPDNY (Sub-Sistem Pengurus Pondok)** merupakan panduan operasional teknis harian bagi Dewan Pengurus, Staf Tata Usaha, dan Panitia Operasional di lingkungan Pondok Pesantren Modern Darun-Na'im Yapia (PPDNY).

Sebagai motor penggerak birokrasi dan administrasi pondok, **Pengurus** memegang peranan krusial dalam menjamin kelancaran aktivitas santri dari bangun tidur hingga istirahat malam:

* **Pusat Komando Operasional Harian**: Memantau statistik santri aktif, pengajar, antrean layanan yang memerlukan disposisi cepat, serta validasi transaksi pembayaran santri.
* **Manajemen Master Data Kependidikan**: Mengelola pembaruan biodata santri, pemetaan rombongan belajar (kelas), alokasi kamar dan ranjang santri di asrama, data wali santri, serta direktori asatidz.
* **Pengaturan Katalog & Verifikasi Layanan**: Mengonfigurasi master jenis perizinan/layanan pondok (izin pulang, pesiar, jenguk wali, fasilitas khusus) dan memproses pengajuan santri secara objektif.
* **Tata Kelola Finansial & Tagihan**: Mengonfigurasi pos jenis tarif pembayaran, melakukan pencatatan transaksi kas masuk, memverifikasi bukti transfer wali santri, serta memantau tagihan piutang SPP.
* **Agenda & Jadwal Kegiatan Pesantren**: Menyusun jadwal taklim kitab kuning, tahfidz Al-Qur'an, kegiatan ekstrakurikuler, dan menugaskan ustadz pembina pada setiap agenda.
* **Kepanitiaan Penerimaan Santri Baru (PPDB)**: Mengelola rekapitulasi gelombang pendaftaran, memverifikasi berkas pendaftar baru, dan menginput hasil ujian seleksi calon santri.

> [!important]
> Akurasi data yang diinput oleh Pengurus menjadi dasar keputusan bagi Dewan Pimpinan dan laporan resmi kepada wali santri. Pastikan setiap verifikasi dokumen dan pembayaran dilakukan dengan cermat sesuai bukti fisik atau rekening koran bank pondok.

---

# Dashboard Operasional & Indikator Kinerja

{section:dashboard}

## 2.1 Kartu Statistik Kinerja Harian

Setelah masuk dengan akun pengurus, sistem menampilkan **Dashboard Operasional Pengurus**:

![Dashboard Utama Pengurus](dashboard_utama_desktop.webp|dashboard_utama_mobile.webp)

Panel atas memuat 4 indikator metrik utama:
1. **Santri Aktif**: Total santri yang terdaftar dan aktif mengikuti kegiatan belajar mengajar serta tinggal di asrama pondok.
2. **Ustadz Pengajar**: Jumlah dewan guru aktif yang membina kelas madrasah diniyah dan formal.
3. **Layanan Pending**: Jumlah permohonan izin pulang, pesiar, atau layanan fasilitas dari santri yang membutuhkan persetujuan pengurus segera.
4. **Verifikasi Pembayaran**: Jumlah transaksi pembayaran SPP/iuran yang menunggu validasi dari staf keuangan pondok.

## 2.2 Grafik Tren Pemasukan 6 Bulan Terakhir

Di bagian tengah dashboard, grafik area (*Area Chart*) menyajikan fluktuasi penerimaan dana SPP dan tagihan operasional pondok selama 6 bulan terakhir:
* Membantu pengurus mengidentifikasi pola kepatuhan pembayaran wali santri pada awal atau akhir semester.

## 2.3 Tabel Layanan Mendesak (*Recent Services*)

Bagian bawah dashboard menyajikan daftar antrean permohonan layanan terbaru yang diajukan oleh santri:
* Klik baris permohonan untuk langsung diarahkan ke halaman detail pemrosesan izin santri.

---

# Manajemen Master Data Kependidikan

{section:kependidikan}

Pengurus bertanggung jawab penuh atas keteraturan basis data seluruh sivitas akademika:

## 3.1 Manajemen Data Santri

Menu **"Data Santri"** menyajikan direktori lengkap santri:
* Menampilkan NIS, Nama Lengkap, Jenis Kelamin, Kelas Pembelajaran, Kamar Asrama, dan Status Keaktifan.
* Pengurus dapat menambahkan santri baru melalui tombol **"+ Tambah Santri"** atau memperbarui data santri melalui tombol **"Edit"**.
* Gunakan fitur filter rombel dan kamar untuk memilah santri putra dan putri secara cepat.

![Manajemen Data Santri](santri_daftar_desktop.webp|santri_daftar_mobile.webp)

## 3.2 Manajemen Data Orang Tua / Wali

Menu **"Data Orang Tua"** memuat database wali santri:
* Mengelola informasi ayah, ibu, dan wali yang berwenang menjemput santri.
* Fitur **"Hubungkan Santri"** digunakan untuk menautkan satu akun wali dengan beberapa anak (santri bersaudara) agar wali dapat memantau seluruh anaknya dalam satu akun.

![Manajemen Data Orang Tua](orangtua_daftar_desktop.webp|orangtua_daftar_mobile.webp)

## 3.3 Manajemen Data Ustadz

Menu **"Data Ustadz"** mencatat tenaga pendidik pondok:
* Memuat NIP, nama lengkap ustadz/ustadzah, keahlian bidang ilmu/kitab, dan nomor kontak aktif.

![Manajemen Data Ustadz](ustadz_daftar_desktop.webp|ustadz_daftar_mobile.webp)

## 3.4 Manajemen Rombongan Belajar (Kelas)

Menu **"Data Kelas"** mengelola pembagian rombel belajar:
* Menentukan tingkat jenjang kelas, nama kelas, kapasitas maksimal siswa, dan menugaskan Ustadz sebagai Wali Kelas.

![Manajemen Rombel Kelas](kelas_daftar_desktop.webp|kelas_daftar_mobile.webp)

## 3.5 Manajemen Kamar Asrama

Menu **"Data Kamar"** mengatur hunian asrama santri:
* Menentukan gedung blok asrama putra/putri, nomor kamar, kapasitas tempat tidur/ranjang, serta penunjukan Ustadz sebagai Musyrif / Pembina Kamar.
* Memastikan kapasitas kamar tidak melebihi batas demi menjaga sirkulasi udara dan sanitasi yang sehat.

![Manajemen Kamar Asrama](kamar_daftar_desktop.webp|kamar_daftar_mobile.webp)

---

# Pengelolaan Katalog & Riwayat Layanan Santri

{section:layanan}

## 4.1 Konfigurasi Master Jenis Layanan

Menu **"Jenis Layanan"** memungkinkan pengurus membuat dan mengelola kategori perizinan:
* Mengatur nama layanan (misalnya: *Izin Pulang Sakit*, *Izin Pesiar Hari Ahad*, *Kunjungan Keluarga di Pondok*, atau *Legalitas Surat Keterangan*).
* Menentukan apakah layanan memerlukan persetujuan khusus wali asrama atau pengurus piket.

![Konfigurasi Master Jenis Layanan](layanan_jenis_desktop.webp|layanan_jenis_mobile.webp)

## 4.2 Pemrosesan & Verifikasi Pengajuan Layanan

Menu **"Riwayat Layanan"** adalah meja kerja harian pengurus untuk memproses permohonan santri:

1. Periksa daftar permohonan dengan status **"Menunggu Persetujuan"**.
2. Klik tombol **"Detail"** untuk membaca alasan izin, tanggal berangkat, dan rencana tanggal kembali ke pondok.
3. Berikan keputusan:
   * **Setujui**: Terbitkan surat izin keluar pondok digital.
   * **Tolak**: Sertakan alasan penolakan secara jelas (misalnya: *Masa ujian sedang berlangsung* atau *Batas kuota pesiar telah habis*).
4. Catat waktu kepulangan santri secara real-time saat santri kembali melapor ke posko piket.

![Pemrosesan Riwayat Layanan](layanan_riwayat_desktop.webp|layanan_riwayat_mobile.webp)

---

# Administrasi Finansial & Penerimaan Tagihan

{section:keuangan}

## 5.1 Pengaturan Master Jenis Tagihan

Menu **"Jenis Tagihan"** digunakan untuk mendefinisikan tarif kewajiban pembayaran santri:
* Menentukan nama tagihan (misalnya: *SPP Bulanan*, *Iuran Makan Asrama*, *Uang Pangkal Masuk*, atau *Kegiatan Rihlah Ilmiah*).
* Menetapkan nominal biaya, periode tagihan (bulanan atau tahunan), dan tanggal jatuh tempo.

![Konfigurasi Master Jenis Tagihan](tagihan_jenis_desktop.webp|tagihan_jenis_mobile.webp)

## 5.2 Pencatatan & Verifikasi Transaksi Kas Masuk

Menu **"Keuangan"** mencatat arus kas penerimaan dana pendidikan:

1. Pada tab **Verifikasi Pembayaran**, pengurus dapat melihat bukti bayar / resi transfer bank yang diunggah oleh wali santri melalui portal wali.
2. Periksa kecocokan nomor rekening pengirim, tanggal transaksi, dan nominal dana yang masuk ke rekening pondok.
3. Klik **"Verifikasi Lunas"** untuk menerbitkan kuitansi resmi sistem.
4. Apabila wali membayar tunai di kantor bendahara, pengurus dapat menggunakan tombol **"+ Input Pembayaran Manual"**.
5. Sistem menyediakan fitur cetak bukti pembayaran resmi dalam format dokumen PDF.

![Pencatatan Transaksi Keuangan](keuangan_daftar_desktop.webp|keuangan_daftar_mobile.webp)

---

# Penjadwalan & Monitoring Kegiatan Santri

{section:kegiatan}

## 6.1 Penyusunan Agenda Kegiatan Pesantren

Menu **"Kegiatan"** memfasilitasi penjadwalan terpadu aktivitas santri:

1. Klik tombol **"+ Tambah Kegiatan Baru"**.
2. Masukkan nama kegiatan (misalnya: *Muhadharah Akbar Bahasa Arab/Inggris*, *Kajian Kitab Fathul Qorib*, atau *Senam & Kerja Bakti Asrama*).
3. Tentukan tanggal, jam mulai hingga selesai, lokasi (Masjid, Aula, atau Lapangan), dan ustadz koordinator pendamping.
4. Simpan kegiatan agar otomatis terbit pada kalender kegiatan di dashboard santri dan wali santri.

![Manajemen Jadwal Kegiatan](kegiatan_daftar_desktop.webp|kegiatan_daftar_mobile.webp)

## 6.2 Monitoring Keterlaksanaan & Absensi

Pengurus dapat menandai status kegiatan (*Selesai* atau *Ditunda*) dan menambahkan catatan evaluasi jalannya agenda untuk dilaporkan ke Pimpinan.

---

# Kepanitiaan Penerimaan Santri Baru (PPDB)

{section:ppdb}

Selama masa seleksi calon santri baru, pengurus bertindak sebagai Panitia Pelaksana PPDB:

## 7.1 Dashboard Rekapitulasi Gelombang PPDB

Menu **"PPDB > Rekapitulasi"** menyajikan performa penerimaan secara visual:
* Menampilkan jumlah akun pendaftar, formulir terisi lengkap, status pembayaran biaya pendaftaran, dan rekapitulasi kuota daya tampung jenjang pendidikan.

![Rekapitulasi Penerimaan Santri Baru](ppdb_rekapitulasi_desktop.webp|ppdb_rekapitulasi_mobile.webp)

## 7.2 Verifikasi Berkas Persyaratan Administrasi

Menu **"PPDB > Pendaftar"** memuat antrean berkas pendaftar baru:

1. Klik tombol **"Periksa Berkas"** pada baris calon santri.
2. Periksa dokumen yang diunggah (Kartu Keluarga, Akta Kelahiran, Ijazah/SKL, dan Surat Keterangan Sehat).
3. Tandai dokumen yang valid atau berikan catatan revisi jika berkas buram/tidak terbaca.
4. Setelah seluruh berkas sesuai, ubah status pendaftar menjadi **"Terverifikasi"** agar calon santri dapat mencetak kartu ujian seleksi.

![Verifikasi Berkas Calon Santri](ppdb_pendaftar_desktop.webp|ppdb_pendaftar_mobile.webp)

## 7.3 Penilaian Ujian Seleksi Masuk

Menu **"PPDB > Seleksi"** digunakan untuk mencatat hasil tes masuk:
* Menginput skor tes baca Al-Qur'an, tes kemampuan hafalan, ujian potensi akademik, dan tes wawancara kepribadian.
* Mengubah status seleksi menjadi **"Lulus"** atau **"Tidak Lulus"** yang akan langsung tampil pada portal cek status calon santri.

![Penilaian Seleksi Calon Santri](ppdb_seleksi_desktop.webp|ppdb_seleksi_mobile.webp)

---

# Profil Pengurus & Pusat Bantuan

{section:profil}

## 8.1 Manajemen Profil Pengurus

1. Klik menu **"Edit Profil"** pada bilah bawah sidebar.
2. Halaman profil memuat identitas pribadi: Nama Lengkap, NIP Pengurus, Alamat Email, Nomor WhatsApp, dan Foto Profil.
3. Perbarui nomor ponsel secara berkala untuk mempermudah koordinasi darurat dengan dewan asatidz dan piket keamanan.

![Profil Pengurus Pondok](profil_utama_desktop.webp|profil_utama_mobile.webp)

## 8.2 Keamanan Akun & Tanya Jawab FAQ

* Lakukan pembaruan kata sandi secara berkala demi menjamin keamanan data sensitif santri.
* Menu **"FAQ"** menyediakan ringkasan tanya jawab seputar alur kerja administrasi pondok dan kontak tim pengembang SIM-Tren.
