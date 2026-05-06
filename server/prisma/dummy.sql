-- ============================================================
-- SEED DATA - Generated for development/testing purposes
-- Password legend:
--   password123 => $2b$10$Ik85C.pgOn8ESDkSokZfguHcAGhloLTE88e8LjgxIDYRdUkVwe.nq
--   santri123   => $2b$10$gpKaKoMhiqrxPiZB7bDV9eKG3y51n9abpmt6GqDtXrndkQXoXvJLS
--   admin123    => $2b$10$utn6g/NphcFZwHqxj/HkjOquVKj5FEqkAayfruVohnI8ibWLUUVO.
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TRUNCATE ALL TABLES (urutan terbalik FK dependency)
-- ============================================================
-- TRUNCATE TABLE pengajuan_materi;
-- TRUNCATE TABLE materi_comment_reply;
-- TRUNCATE TABLE materi_comment;
-- TRUNCATE TABLE konsultasi_read_cursor;
-- TRUNCATE TABLE konsultasi_message;
-- TRUNCATE TABLE konsultasi_room;
-- TRUNCATE TABLE screening_predileksi;
-- TRUNCATE TABLE screening_penanganan;
-- TRUNCATE TABLE detail_screening;
-- TRUNCATE TABLE screening;
-- TRUNCATE TABLE penanganan;
-- TRUNCATE TABLE pertanyaan_screening;
-- TRUNCATE TABLE detail_observasi;
-- TRUNCATE TABLE pertanyaan_observasi;
-- TRUNCATE TABLE observasi;
-- TRUNCATE TABLE absensi_detail;
-- TRUNCATE TABLE heading_absensi;
-- TRUNCATE TABLE item_kebersihan;
-- TRUNCATE TABLE absensi;
-- TRUNCATE TABLE feedback;
-- TRUNCATE TABLE tanggapan_aduan;
-- TRUNCATE TABLE pengaduan;
-- TRUNCATE TABLE riwayat_layanan_detail;
-- TRUNCATE TABLE riwayat_layanan;
-- TRUNCATE TABLE jenis_layanan;
-- TRUNCATE TABLE pembayaran;
-- TRUNCATE TABLE ppdb_pembayaran_ref;
-- TRUNCATE TABLE ppdb_dokumen;
-- TRUNCATE TABLE ppdb_orangtua;
-- TRUNCATE TABLE ppdb_seleksi;
-- TRUNCATE TABLE ppdb_pendaftar;
-- TRUNCATE TABLE ppdb_tahun;
-- TRUNCATE TABLE tagihan;
-- TRUNCATE TABLE jenis_tagihan;
-- TRUNCATE TABLE detail_materi;
-- TRUNCATE TABLE materi;
-- TRUNCATE TABLE activity_log;
-- TRUNCATE TABLE kelas_santri;
-- TRUNCATE TABLE kelas;
-- TRUNCATE TABLE kamar_santri;
-- TRUNCATE TABLE kegiatan;
-- TRUNCATE TABLE kamar;
-- TRUNCATE TABLE orangtua;
-- TRUNCATE TABLE user_role;
-- TRUNCATE TABLE role;
-- TRUNCATE TABLE faq;
-- TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. ROLE
-- ============================================================
INSERT INTO role (id, role, is_active) VALUES
(1, 'santri',       '1'),
(2, 'pengurus',     '1'),
(3, 'ustadz',       '1'),
(4, 'orangtua',     '1'),
(5, 'pimpinan',     '1'),
(6, 'admin',        '1'),
(7, 'timkesehatan', '1');

-- ============================================================
-- 2. USERS
-- Kelompok:
--   ID  1-10  : Santri        (password: santri123)
--   ID 11-13  : Timkesehatan  (password: password123)
--   ID 14-15  : Ustadz/Wali   (password: password123)
--   ID 16     : Admin          (password: admin123)
--   ID 17     : Pimpinan       (password: admin123)
--   ID 18     : Pengurus       (password: password123)
--   ID 19-22  : Orangtua       (password: password123)
-- ============================================================
INSERT INTO users (id, nip, nama, jenis_kelamin, tempat_lahir, tanggal_lahir, email, no_hp, alamat, foto_profil, password, is_active) VALUES
-- Santri Laki-laki
(1,  NULL, 'Ahmad Fauzi',       'Laki-laki', 'Bandung',   '2006-03-12', 'ahmad.fauzi@pondok.id',    '081211110001', 'Jl. Mawar No.1, Bandung',   NULL, '$2b$10$gpKaKoMhiqrxPiZB7bDV9eKG3y51n9abpmt6GqDtXrndkQXoXvJLS', 1),
(2,  NULL, 'Rizky Ramadhan',    'Laki-laki', 'Jakarta',   '2005-07-20', 'rizky.r@pondok.id',        '081211110002', 'Jl. Melati No.2, Jakarta',  NULL, '$2b$10$gpKaKoMhiqrxPiZB7bDV9eKG3y51n9abpmt6GqDtXrndkQXoXvJLS', 1),
(3,  NULL, 'Dimas Ardiansyah',  'Laki-laki', 'Surabaya',  '2006-01-05', 'dimas.a@pondok.id',        '081211110003', 'Jl. Dahlia No.3, Surabaya', NULL, '$2b$10$gpKaKoMhiqrxPiZB7bDV9eKG3y51n9abpmt6GqDtXrndkQXoXvJLS', 1),
(4,  NULL, 'Fajar Nugroho',     'Laki-laki', 'Yogyakarta','2005-11-18', 'fajar.n@pondok.id',        '081211110004', 'Jl. Anggrek No.4, Jogja',   NULL, '$2b$10$gpKaKoMhiqrxPiZB7bDV9eKG3y51n9abpmt6GqDtXrndkQXoXvJLS', 1),
(5,  NULL, 'Hendra Wijaya',     'Laki-laki', 'Semarang',  '2006-09-25', 'hendra.w@pondok.id',       '081211110005', 'Jl. Kenanga No.5, Semarang',NULL, '$2b$10$gpKaKoMhiqrxPiZB7bDV9eKG3y51n9abpmt6GqDtXrndkQXoXvJLS', 1),
-- Santri Perempuan
(6,  NULL, 'Siti Aisyah',       'Perempuan', 'Malang',    '2006-04-14', 'siti.a@pondok.id',         '081211110006', 'Jl. Tulip No.6, Malang',    NULL, '$2b$10$gpKaKoMhiqrxPiZB7bDV9eKG3y51n9abpmt6GqDtXrndkQXoXvJLS', 1),
(7,  NULL, 'Nur Fatimah',       'Perempuan', 'Bogor',     '2005-12-30', 'nur.f@pondok.id',          '081211110007', 'Jl. Seroja No.7, Bogor',    NULL, '$2b$10$gpKaKoMhiqrxPiZB7bDV9eKG3y51n9abpmt6GqDtXrndkQXoXvJLS', 1),
(8,  NULL, 'Dewi Rahayu',       'Perempuan', 'Bekasi',    '2006-06-08', 'dewi.r@pondok.id',         '081211110008', 'Jl. Cempaka No.8, Bekasi',  NULL, '$2b$10$gpKaKoMhiqrxPiZB7bDV9eKG3y51n9abpmt6GqDtXrndkQXoXvJLS', 1),
(9,  NULL, 'Laila Maghfiroh',   'Perempuan', 'Depok',     '2005-08-22', 'laila.m@pondok.id',        '081211110009', 'Jl. Flamboyan No.9, Depok', NULL, '$2b$10$gpKaKoMhiqrxPiZB7bDV9eKG3y51n9abpmt6GqDtXrndkQXoXvJLS', 1),
(10, NULL, 'Zahra Aulia',       'Perempuan', 'Tangerang', '2006-02-17', 'zahra.a@pondok.id',        '081211110010', 'Jl. Bougenville No.10, Tgr',NULL, '$2b$10$gpKaKoMhiqrxPiZB7bDV9eKG3y51n9abpmt6GqDtXrndkQXoXvJLS', 1),
-- Timkesehatan
(11, 'TK001', 'dr. Budi Santoso',  'Laki-laki', 'Bandung',   '1985-05-10', 'budi.s@pondok.id',    '08131111001', 'Jl. Dokter No.1, Bandung',  NULL, '$2b$10$Ik85C.pgOn8ESDkSokZfguHcAGhloLTE88e8LjgxIDYRdUkVwe.nq', 1),
(12, 'TK002', 'Ns. Rini Aprilia',  'Perempuan', 'Surabaya',  '1990-09-15', 'rini.a@pondok.id',    '08131111002', 'Jl. Perawat No.2, Surabaya',NULL, '$2b$10$Ik85C.pgOn8ESDkSokZfguHcAGhloLTE88e8LjgxIDYRdUkVwe.nq', 1),
(13, 'TK003', 'Ahmad Kesehatan',   'Laki-laki', 'Jakarta',   '1988-03-22', 'ahmad.k@pondok.id',   '08131111003', 'Jl. Sehat No.3, Jakarta',   NULL, '$2b$10$Ik85C.pgOn8ESDkSokZfguHcAGhloLTE88e8LjgxIDYRdUkVwe.nq', 1),
-- Ustadz / Wali Kelas / Wali Kamar
(14, 'UST001', 'Ust. Mahmud Hakim',   'Laki-laki', 'Cirebon',   '1978-11-01', 'mahmud.h@pondok.id',  '08141111001', 'Jl. Ustadz No.1, Cirebon',  NULL, '$2b$10$Ik85C.pgOn8ESDkSokZfguHcAGhloLTE88e8LjgxIDYRdUkVwe.nq', 1),
(15, 'UST002', 'Ustadzah Khadijah',   'Perempuan', 'Yogyakarta','1982-07-14', 'khadijah@pondok.id',  '08141111002', 'Jl. Ustadzah No.2, Jogja',  NULL, '$2b$10$Ik85C.pgOn8ESDkSokZfguHcAGhloLTE88e8LjgxIDYRdUkVwe.nq', 1),
-- Admin
(16, 'ADM001', 'Siti Admin',         'Perempuan', 'Bandung',   '1992-04-20', 'admin@pondok.id',     '08161111001', 'Jl. Admin No.1, Bandung',   NULL, '$2b$10$utn6g/NphcFZwHqxj/HkjOquVKj5FEqkAayfruVohnI8ibWLUUVO.', 1),
-- Pimpinan
(17, 'PIM001', 'KH. Abdullah Hakim', 'Laki-laki', 'Madura',    '1965-01-01', 'pimpinan@pondok.id',  '08171111001', 'Pesantren Al-Ikhlas, Madura',NULL, '$2b$10$utn6g/NphcFZwHqxj/HkjOquVKj5FEqkAayfruVohnI8ibWLUUVO.', 1),
-- Pengurus
(18, 'PGR001', 'Fikri Pengurus',     'Laki-laki', 'Bekasi',    '1995-06-30', 'pengurus@pondok.id',  '08181111001', 'Jl. Pengurus No.1, Bekasi', NULL, '$2b$10$Ik85C.pgOn8ESDkSokZfguHcAGhloLTE88e8LjgxIDYRdUkVwe.nq', 1),
-- Orangtua
(19, NULL, 'Bapak Fauzi Senior',  'Laki-laki', 'Bandung',   '1975-03-10', 'ortu.fauzi@gmail.com',  '08191111001', 'Jl. Mawar No.1, Bandung',   NULL, '$2b$10$Ik85C.pgOn8ESDkSokZfguHcAGhloLTE88e8LjgxIDYRdUkVwe.nq', 1),
(20, NULL, 'Ibu Ramadhan',        'Perempuan', 'Jakarta',   '1978-08-05', 'ortu.rizky@gmail.com',  '08191111002', 'Jl. Melati No.2, Jakarta',  NULL, '$2b$10$Ik85C.pgOn8ESDkSokZfguHcAGhloLTE88e8LjgxIDYRdUkVwe.nq', 1),
(21, NULL, 'Bapak Siti Senior',   'Laki-laki', 'Malang',    '1972-06-18', 'ortu.siti@gmail.com',   '08191111003', 'Jl. Tulip No.6, Malang',    NULL, '$2b$10$Ik85C.pgOn8ESDkSokZfguHcAGhloLTE88e8LjgxIDYRdUkVwe.nq', 1),
(22, NULL, 'Ibu Zahra',           'Perempuan', 'Tangerang', '1980-02-14', 'ortu.zahra@gmail.com',  '08191111004', 'Jl. Bougenville No.10, Tgr',NULL, '$2b$10$Ik85C.pgOn8ESDkSokZfguHcAGhloLTE88e8LjgxIDYRdUkVwe.nq', 1);

-- ============================================================
-- 3. USER_ROLE
-- ============================================================
INSERT INTO user_role (id, id_user, id_role, is_active) VALUES
-- Santri (role 1)
(1,  1,  1, 1),(2,  2,  1, 1),(3,  3,  1, 1),(4,  4,  1, 1),(5,  5,  1, 1),
(6,  6,  1, 1),(7,  7,  1, 1),(8,  8,  1, 1),(9,  9,  1, 1),(10, 10, 1, 1),
-- Pengurus (role 2)
(11, 18, 2, 1),
-- Ustadz (role 3)
(12, 14, 3, 1),(13, 15, 3, 1),
-- Orangtua (role 4)
(14, 19, 4, 1),(15, 20, 4, 1),(16, 21, 4, 1),(17, 22, 4, 1),
-- Pimpinan (role 5)
(18, 17, 5, 1),
-- Admin (role 6)
(19, 16, 6, 1),
-- Timkesehatan (role 7)
(20, 11, 7, 1),(21, 12, 7, 1),(22, 13, 7, 1);

-- ============================================================
-- 4. ORANGTUA (relasi santri - orangtua)
-- ============================================================
INSERT INTO orangtua (id, id_orangtua, id_santri, hubungan, is_active) VALUES
(1, 19, 1, 'Ayah', 1),
(2, 20, 2, 'Ibu',  1),
(3, 21, 6, 'Ayah', 1),
(4, 22, 10,'Ibu',  1);

-- ============================================================
-- 5. KAMAR
-- ============================================================
INSERT INTO kamar (id, id_wali, kamar, kapasitas, gender, lokasi, keterangan, is_active) VALUES
(1, 14, 'Al-Fatih',  10, 'Laki-laki', 'Gedung A Lt.1', 'Kamar putra senior',   1),
(2, 14, 'Al-Ghazali', 10, 'Laki-laki', 'Gedung A Lt.2', 'Kamar putra junior',   1),
(3, 15, 'Khadijah',  10, 'Perempuan', 'Gedung B Lt.1', 'Kamar putri senior',   1),
(4, 15, 'Aisyah',    10, 'Perempuan', 'Gedung B Lt.2', 'Kamar putri junior',   1);

-- ============================================================
-- 6. KAMAR_SANTRI
-- ============================================================
INSERT INTO kamar_santri (id, id_santri, id_kamar, tanggal_masuk, tanggal_keluar, is_active) VALUES
(1, 1,  1, '2024-07-01', NULL, 1),
(2, 2,  1, '2024-07-01', NULL, 1),
(3, 3,  2, '2024-07-01', NULL, 1),
(4, 4,  2, '2024-07-01', NULL, 1),
(5, 5,  2, '2024-07-01', NULL, 1),
(6, 6,  3, '2024-07-01', NULL, 1),
(7, 7,  3, '2024-07-01', NULL, 1),
(8, 8,  4, '2024-07-01', NULL, 1),
(9, 9,  4, '2024-07-01', NULL, 1),
(10,10, 4, '2024-07-01', NULL, 1);

-- ============================================================
-- 7. KELAS
-- ============================================================
INSERT INTO kelas (id, id_wali, kelas, tahun_ajaran, is_active) VALUES
(1, 14, 'Kelas 1A', '2024/2025', 1),
(2, 14, 'Kelas 2A', '2024/2025', 1),
(3, 15, 'Kelas 1B', '2024/2025', 1),
(4, 15, 'Kelas 2B', '2024/2025', 1);

-- ============================================================
-- 8. KELAS_SANTRI
-- ============================================================
INSERT INTO kelas_santri (id, id_santri, id_kelas, is_active) VALUES
(1,  1,  1, 1),
(2,  2,  1, 1),
(3,  3,  2, 1),
(4,  4,  2, 1),
(5,  5,  2, 1),
(6,  6,  3, 1),
(7,  7,  3, 1),
(8,  8,  4, 1),
(9,  9,  4, 1),
(10, 10, 4, 1);

-- ============================================================
-- 9. KEGIATAN
-- ============================================================
INSERT INTO kegiatan (id, id_kelas, id_kamar, nama_kegiatan, tanggal, lokasi, waktu_mulai, waktu_selesai, penanggung_jawab, deskripsi, rutin, is_active) VALUES
(1, 1, NULL, 'Kajian Kitab Kuning',   '2025-01-10', 'Aula Utama',    '08:00:00', '10:00:00', 14, 'Kajian rutin kitab kuning kelas 1A', 1, 1),
(2, 2, NULL, 'Tahfidz Al-Quran',      '2025-01-10', 'Masjid',        '05:00:00', '06:30:00', 14, 'Setoran hafalan al-quran',           1, 1),
(3, 3, NULL, 'Nahwu Shorof',          '2025-01-11', 'Ruang Kelas 3', '13:00:00', '14:30:00', 15, 'Pelajaran tata bahasa arab',         1, 1),
(4, NULL, 1, 'Piket Kamar Al-Fatih',  '2025-01-12', 'Kamar Al-Fatih','06:00:00', '07:00:00', 18, 'Piket kebersihan kamar',             1, 1),
(5, NULL, 3, 'Piket Kamar Khadijah',  '2025-01-12', 'Kamar Khadijah','06:00:00', '07:00:00', 18, 'Piket kebersihan kamar',             1, 1),
(6, NULL, NULL,'Upacara Pondok',      '2025-01-13', 'Lapangan',      '07:00:00', '08:00:00', 17, 'Upacara rutin pondok pesantren',     0, 1);

-- ============================================================
-- 10. ABSENSI
-- ============================================================
INSERT INTO absensi (id, id_user, id_kegiatan, status, keterangan, is_active) VALUES
(1,  1, 1, 'Hadir',  NULL,              1),
(2,  2, 1, 'Hadir',  NULL,              1),
(3,  3, 2, 'Izin',   'Pulang ke rumah', 1),
(4,  4, 2, 'Hadir',  NULL,              1),
(5,  5, 2, 'Sakit',  'Demam',           1),
(6,  6, 3, 'Hadir',  NULL,              1),
(7,  7, 3, 'Hadir',  NULL,              1),
(8,  8, 3, 'Alpa',   NULL,              1),
(9,  9, 4, 'Hadir',  NULL,              1),
(10, 10,5, 'Hadir',  NULL,              1),
(11, 1, 6, 'Hadir',  NULL,              1),
(12, 2, 6, 'Izin',   'Urusan keluarga', 1);

-- ============================================================
-- 11. ITEM_KEBERSIHAN
-- ============================================================
INSERT INTO item_kebersihan (id_item, nama_item, waktu_pengerjaan, is_active) VALUES
(1, 'Menyapu lantai kamar',          'Setiap Hari',       1),
(2, 'Mengepel lantai kamar',         'Setiap Hari',       1),
(3, 'Membersihkan kamar mandi',      'Setiap Hari',       1),
(4, 'Mengelap jendela',              'Dua Minggu Sekali', 1),
(5, 'Membersihkan lemari',           'Dua Minggu Sekali', 1),
(6, 'Membuang sampah',               'Setiap Hari',       1),
(7, 'Merapikan tempat tidur',        'Setiap Hari',       1),
(8, 'Membersihkan kipas angin',      'Dua Minggu Sekali', 1);

-- ============================================================
-- 12. HEADING_ABSENSI (absensi kebersihan kamar)
-- ============================================================
INSERT INTO heading_absensi (id_heading, id_kamar, id_timkes, tanggal, catatan, is_active) VALUES
(1, 1, 11, '2025-01-10', 'Pemeriksaan rutin kamar Al-Fatih',  1),
(2, 2, 11, '2025-01-10', 'Pemeriksaan rutin kamar Al-Ghazali',1),
(3, 3, 12, '2025-01-10', 'Pemeriksaan rutin kamar Khadijah',  1),
(4, 4, 12, '2025-01-10', 'Pemeriksaan rutin kamar Aisyah',    1);

-- ============================================================
-- 13. ABSENSI_DETAIL (hasil pemeriksaan kebersihan)
-- ============================================================
INSERT INTO absensi_detail (id_detail, id_heading, id_item, status, is_active) VALUES
(1,  1, 1, 'Dilakukan',     1),
(2,  1, 2, 'Dilakukan',     1),
(3,  1, 3, 'Tidak Dilakukan',1),
(4,  1, 7, 'Dilakukan',     1),
(5,  2, 1, 'Dilakukan',     1),
(6,  2, 3, 'Dilakukan',     1),
(7,  3, 1, 'Dilakukan',     1),
(8,  3, 2, 'Dilakukan',     1),
(9,  3, 6, 'Dilakukan',     1),
(10, 4, 1, 'Tidak Dilakukan',1),
(11, 4, 7, 'Dilakukan',     1);

-- ============================================================
-- 14. JENIS_LAYANAN
-- ============================================================
INSERT INTO jenis_layanan (id, nama_layanan, deskripsi, estimasi, is_active) VALUES
(1, 'Konsultasi Umum',   'Konsultasi kesehatan umum dengan tim kesehatan', '30 menit', 1),
(2, 'Pemeriksaan Fisik', 'Pemeriksaan fisik menyeluruh',                   '45 menit', 1),
(3, 'Pengobatan Dasar',  'Pemberian obat dan tindakan medis dasar',        '20 menit', 1),
(4, 'Rujukan Eksternal', 'Rujukan ke fasilitas kesehatan luar pondok',     '60 menit', 1);

-- ============================================================
-- 15. RIWAYAT_LAYANAN
-- ============================================================
INSERT INTO riwayat_layanan (id, id_layanan, id_santri, waktu, status_sebelum, status_sesudah, catatan, is_active) VALUES
(1, 1, 1,  '2025-01-05 09:00:00', 'Proses', 'Selesai', 'Santri mengeluh pusing, diberikan obat dan istirahat', 1),
(2, 3, 5,  '2025-01-06 14:00:00', 'Proses', 'Selesai', 'Demam, diberikan parasetamol dan vitamin',             1),
(3, 2, 8,  '2025-01-07 10:30:00', 'Proses', 'Selesai', 'Pemeriksaan rutin bulanan',                           1),
(4, 1, 3,  '2025-01-08 11:00:00', 'Proses', 'Proses',  'Keluhan gatal-gatal, perlu tindak lanjut',             1),
(5, 4, 7,  '2025-01-09 09:00:00', 'Proses', 'Selesai', 'Dirujuk ke puskesmas terdekat',                       1);

-- ============================================================
-- 16. RIWAYAT_LAYANAN_DETAIL
-- ============================================================
INSERT INTO riwayat_layanan_detail (id, id_riwayat, aspek, detail, is_active) VALUES
(1, 1, 'Keluhan',    'Pusing dan lemas sejak kemarin',          1),
(2, 1, 'Diagnosis',  'Kelelahan, kurang tidur',                 1),
(3, 1, 'Tindakan',   'Istirahat 1 hari, parasetamol 500mg',     1),
(4, 2, 'Keluhan',    'Demam 38.5 derajat, menggigil',           1),
(5, 2, 'Tindakan',   'Parasetamol, vitamin C, kompres hangat',  1),
(6, 3, 'Hasil',      'Tekanan darah normal, berat badan normal',1),
(7, 4, 'Keluhan',    'Gatal di sela-sela jari tangan',          1),
(8, 5, 'Alasan',     'Membutuhkan penanganan lebih lanjut',     1);

-- ============================================================
-- 17. FEEDBACK
-- ============================================================
INSERT INTO feedback (id, id_user, id_riwayat_layanan, id_kegiatan, rating, isi_text, tanggal, is_active) VALUES
(1, 1, 1, NULL, 5, 'Pelayanan sangat baik dan ramah',        '2025-01-05', 1),
(2, 5, 2, NULL, 4, 'Cukup cepat, terima kasih',              '2025-01-06', 1),
(3, 8, 3, NULL, 5, 'Pemeriksaan sangat teliti',              '2025-01-07', 1),
(4, 1, NULL, 1, 4, 'Kajian sangat bermanfaat',               '2025-01-10', 1),
(5, 6, NULL, 3, 5, 'Materi nahwu shorof sangat jelas',       '2025-01-11', 1);

-- ============================================================
-- 18. PENGADUAN
-- ============================================================
INSERT INTO pengaduan (id, id_pelapor, id_santri, waktu_aduan, judul, deskripsi, status, is_active) VALUES
(1, 1,  3,  '2025-01-08 13:00:00', 'Fasilitas Kamar Rusak',    'Kipas angin di kamar Al-Ghazali rusak sudah 3 hari', 'Aktif',   1),
(2, 6,  8,  '2025-01-09 15:00:00', 'Lampu Kamar Padam',        'Lampu kamar Aisyah mati sejak kemarin malam',        'Selesai', 1),
(3, 18, NULL,'2025-01-10 09:00:00','Kebersihan Lingkungan',    'Area belakang pondok kurang terawat',                 'Aktif',   1);

-- ============================================================
-- 19. TANGGAPAN_ADUAN
-- ============================================================
INSERT INTO tanggapan_aduan (id, id_aduan, id_user, waktu_tanggapan, tanggapan, is_active) VALUES
(1, 2, 18, '2025-01-09 17:00:00', 'Lampu sudah diganti, terima kasih laporannya',      1),
(2, 1, 18, '2025-01-08 16:00:00', 'Sedang diproses, teknisi akan datang besok',        1);

-- ============================================================
-- 20. JENIS_TAGIHAN
-- ============================================================
INSERT INTO jenis_tagihan (id, jenis_tagihan, is_active) VALUES
(1, 'SPP Bulanan',      1),
(2, 'Biaya Makan',      1),
(3, 'Biaya Laundry',    1),
(4, 'Biaya Pendaftaran',1),
(5, 'Biaya Kegiatan',   1);

-- ============================================================
-- 21. TAGIHAN
-- ============================================================
INSERT INTO tagihan (id, id_santri, id_jenis_tagihan, nama_tagihan, nominal, tanggal_tagihan, batas_pembayaran, status, is_active) VALUES
(1,  1, 1, 'SPP Januari 2025',     500000, '2025-01-01', '2025-01-10', 'Lunas',  1),
(2,  2, 1, 'SPP Januari 2025',     500000, '2025-01-01', '2025-01-10', 'Lunas',  1),
(3,  3, 1, 'SPP Januari 2025',     500000, '2025-01-01', '2025-01-10', 'Aktif',  1),
(4,  4, 1, 'SPP Januari 2025',     500000, '2025-01-01', '2025-01-10', 'Aktif',  1),
(5,  5, 1, 'SPP Januari 2025',     500000, '2025-01-01', '2025-01-10', 'Lunas',  1),
(6,  6, 1, 'SPP Januari 2025',     500000, '2025-01-01', '2025-01-10', 'Lunas',  1),
(7,  7, 1, 'SPP Januari 2025',     500000, '2025-01-01', '2025-01-10', 'Aktif',  1),
(8,  8, 1, 'SPP Januari 2025',     500000, '2025-01-01', '2025-01-10', 'Aktif',  1),
(9,  9, 1, 'SPP Januari 2025',     500000, '2025-01-01', '2025-01-10', 'Lunas',  1),
(10, 10,1, 'SPP Januari 2025',     500000, '2025-01-01', '2025-01-10', 'Lunas',  1),
(11, 1, 2, 'Biaya Makan Januari',  300000, '2025-01-01', '2025-01-05', 'Lunas',  1),
(12, 2, 2, 'Biaya Makan Januari',  300000, '2025-01-01', '2025-01-05', 'Lunas',  1),
(13, 5, 3, 'Biaya Laundry Jan',    100000, '2025-01-01', '2025-01-15', 'Aktif',  1);

-- ============================================================
-- 22. PEMBAYARAN
-- ============================================================
INSERT INTO pembayaran (id, id_tagihan, tanggal_bayar, nominal, metode_bayar, bukti_bayar, status, is_active) VALUES
(1,  1,  '2025-01-05', 500000, 'Transfer', 'bukti_1.jpg',  'Berhasil', 1),
(2,  2,  '2025-01-06', 500000, 'Tunai',    NULL,           'Berhasil', 1),
(3,  5,  '2025-01-07', 500000, 'Transfer', 'bukti_5.jpg',  'Berhasil', 1),
(4,  6,  '2025-01-05', 500000, 'Transfer', 'bukti_6.jpg',  'Berhasil', 1),
(5,  9,  '2025-01-08', 500000, 'Tunai',    NULL,           'Berhasil', 1),
(6,  10, '2025-01-07', 500000, 'Transfer', 'bukti_10.jpg', 'Berhasil', 1),
(7,  11, '2025-01-03', 300000, 'Transfer', 'bukti_11.jpg', 'Berhasil', 1),
(8,  12, '2025-01-04', 300000, 'Tunai',    NULL,           'Berhasil', 1);

-- ============================================================
-- 23. PERTANYAAN_SCREENING
-- ============================================================
INSERT INTO pertanyaan_screening (id_pertanyaan_screening, pertanyaan, bagian, is_active, tipe_jawaban) VALUES
(1,  'Apakah terdapat rasa gatal yang lebih parah pada malam hari?',              'A', 1, 'BOOLEAN'),
(2,  'Apakah gatal dirasakan oleh lebih dari satu orang dalam satu kamar?',       'A', 1, 'BOOLEAN'),
(3,  'Apakah terdapat bintil-bintil kecil merah di kulit?',                       'A', 1, 'BOOLEAN'),
(4,  'Apakah terdapat terowongan kecil di kulit (garis tipis berliku)?',          'A', 1, 'BOOLEAN'),
(5,  'Apakah keluhan muncul di sela-sela jari, pergelangan tangan, atau lipatan?','A', 1, 'BOOLEAN'),
(6,  'Berapa lama gejala sudah dirasakan? (hari)',                                 'B', 1, 'NUMBER'),
(7,  'Apakah sudah pernah mendapat pengobatan sebelumnya?',                        'B', 1, 'BOOLEAN'),
(8,  'Apakah ada kontak dengan penderita scabies yang diketahui?',                 'B', 1, 'BOOLEAN');

-- ============================================================
-- 24. PENANGANAN
-- ============================================================
INSERT INTO penanganan (id_penanganan, opsi_penanganan, is_active) VALUES
(1, 'Pemberian salep permetrin 5%',            1),
(2, 'Pemberian obat antihistamin oral',         1),
(3, 'Isolasi kamar sementara',                 1),
(4, 'Cuci semua pakaian dan sprei dengan air panas', 1),
(5, 'Rujuk ke puskesmas / dokter spesialis',   1),
(6, 'Edukasi kebersihan diri',                 1),
(7, 'Pemantauan berkala 1 minggu',             1);

-- ============================================================
-- 25. PERTANYAAN_OBSERVASI
-- ============================================================
INSERT INTO pertanyaan_observasi (id_pertanyaan_observasi, pertanyaan, is_active) VALUES
(1, 'Santri tampak menjaga kebersihan diri',              1),
(2, 'Pakaian santri bersih dan rapi',                     1),
(3, 'Tidak tampak lesi/ruam mencurigakan di area terbuka',1),
(4, 'Santri tidak tampak menggaruk-garuk kulit',          1),
(5, 'Tempat tidur dan lingkungan kamar bersih',           1),
(6, 'Santri tampak sehat dan aktif',                      1);

-- ============================================================
-- 26. SCREENING
-- ============================================================
INSERT INTO screening (id_screening, id_timkes, id_santri, tanggal, total_skor, status, diagnosa, catatan, foto_predileksi, is_active) VALUES
(1, 11, 3,  '2025-01-08 10:00:00', 6,  'Selesai',         'Kemungkinan Scabies', 'Santri mengeluh gatal, terutama di malam hari. Perlu tindak lanjut.',             NULL, 1),
(2, 12, 8,  '2025-01-09 09:00:00', 2,  'Selesai',         'Bukan Scabies',       'Keluhan gatal karena alergi deterjen. Bukan scabies.',                           NULL, 1),
(3, 11, 5,  '2025-01-10 11:00:00', 8,  'Sedang Diproses', 'Scabies',             'Gejala khas scabies, sudah menular ke beberapa teman sekamar.',                   NULL, 1),
(4, 13, 9,  '2025-01-11 10:00:00', 1,  'Belum Diproses',  'Bukan Scabies',       'Pemeriksaan awal, gejala ringan.',                                                NULL, 1);

-- ============================================================
-- 27. DETAIL_SCREENING
-- ============================================================
INSERT INTO detail_screening (id_detail_screening, id_screening, id_pertanyaan_screening, jawaban, is_active, nilai_number) VALUES
-- Screening 1 (santri 3 - Kemungkinan Scabies)
(1,  1, 1, 1, 1, NULL),(2,  1, 2, 1, 1, NULL),(3,  1, 3, 1, 1, NULL),
(4,  1, 4, 0, 1, NULL),(5,  1, 5, 1, 1, NULL),(6,  1, 6, 0, 1, 7),
(7,  1, 7, 0, 1, NULL),(8,  1, 8, 1, 1, NULL),
-- Screening 2 (santri 8 - Bukan Scabies)
(9,  2, 1, 0, 1, NULL),(10, 2, 2, 0, 1, NULL),(11, 2, 3, 1, 1, NULL),
(12, 2, 4, 0, 1, NULL),(13, 2, 5, 0, 1, NULL),(14, 2, 6, 0, 1, 2),
(15, 2, 7, 0, 1, NULL),(16, 2, 8, 0, 1, NULL),
-- Screening 3 (santri 5 - Scabies)
(17, 3, 1, 1, 1, NULL),(18, 3, 2, 1, 1, NULL),(19, 3, 3, 1, 1, NULL),
(20, 3, 4, 1, 1, NULL),(21, 3, 5, 1, 1, NULL),(22, 3, 6, 0, 1, 14),
(23, 3, 7, 0, 1, NULL),(24, 3, 8, 1, 1, NULL);

-- ============================================================
-- 28. SCREENING_PENANGANAN
-- ============================================================
INSERT INTO screening_penanganan (id, id_screening, id_penanganan) VALUES
(1, 1, 2),(2, 1, 6),(3, 1, 7),
(4, 3, 1),(5, 3, 3),(6, 3, 4),(7, 3, 6);

-- ============================================================
-- 29. SCREENING_PREDILEKSI
-- ============================================================
INSERT INTO screening_predileksi (id_predileksi, id_screening, area, bentuk_kelainan, is_active) VALUES
(1, 1, 'tangan_kiri',   'Bintil_Merah_Kecil',      1),
(2, 1, 'tangan_kanan',  'Bintil_Merah_Kecil',      1),
(3, 3, 'tangan_kiri',   'Terowongan_Kecil_di_Kulit',1),
(4, 3, 'tangan_kanan',  'Terowongan_Kecil_di_Kulit',1),
(5, 3, 'selangkangan',  'Ruam_Merah',               1),
(6, 3, 'perut',         'Bintil_Bernanah',           1);

-- ============================================================
-- 30. OBSERVASI
-- ============================================================
INSERT INTO observasi (id_observasi, id_santri, id_kamar, id_timkes, tanggal, waktu, is_active, skor_diperoleh, catatan, tindak_lanjut) VALUES
(1, 3, 2, 11, '2025-01-09 08:00:00', 'Pagi',  1, 4, 'Santri tampak kurang menjaga kebersihan',     'Edukasi kebersihan diri secara personal'),
(2, 5, 2, 11, '2025-01-10 08:00:00', 'Pagi',  1, 3, 'Ada bintil merah di tangan, perlu diawasi',  'Lanjut screening lebih dalam'),
(3, 8, 4, 12, '2025-01-10 09:00:00', 'Pagi',  1, 6, 'Kondisi santri baik, lingkungan bersih',     'Tetap pantau'),
(4, 9, 4, 12, '2025-01-11 20:00:00', 'Malam', 1, 5, 'Santri sehat, tidak ada keluhan',             NULL);

-- ============================================================
-- 31. DETAIL_OBSERVASI
-- ============================================================
INSERT INTO detail_observasi (id_detail_obsrevasi, id_observasi, id_pertanyaan_observasi, jawaban, is_active) VALUES
(1,  1, 1, 0, 1),(2,  1, 2, 1, 1),(3,  1, 3, 1, 1),(4,  1, 4, 0, 1),(5,  1, 5, 1, 1),(6,  1, 6, 1, 1),
(7,  2, 1, 1, 1),(8,  2, 2, 0, 1),(9,  2, 3, 0, 1),(10, 2, 4, 0, 1),(11, 2, 5, 0, 1),(12, 2, 6, 1, 1),
(13, 3, 1, 1, 1),(14, 3, 2, 1, 1),(15, 3, 3, 1, 1),(16, 3, 4, 1, 1),(17, 3, 5, 1, 1),(18, 3, 6, 1, 1),
(19, 4, 1, 1, 1),(20, 4, 2, 1, 1),(21, 4, 3, 1, 1),(22, 4, 4, 1, 1),(23, 4, 5, 0, 1),(24, 4, 6, 1, 1);

-- ============================================================
-- 32. MATERI
-- ============================================================
INSERT INTO materi (id_materi, judul_materi, penulis, is_active, gambar, ringkasan, tanggal_dibuat, sumber) VALUES
(1, 'Pencegahan Scabies di Lingkungan Pesantren', 'Tim Kesehatan', 1, NULL, 'Panduan lengkap mencegah dan mengatasi scabies di lingkungan asrama pondok pesantren', '2025-01-01 08:00:00', 'teori'),
(2, 'Menjaga Kebersihan Diri Sehari-hari',        'Tim Kesehatan', 1, NULL, 'Tips dan cara menjaga kebersihan diri untuk santri pondok pesantren',                  '2025-01-03 09:00:00', 'teori'),
(3, 'Pentingnya Pola Makan Sehat',               'dr. Budi Santoso', 1, NULL, 'Pengalaman menangani santri dengan gizi buruk dan cara mencegahnya',               '2025-01-05 10:00:00', 'pengalaman'),
(4, 'Mengelola Stres di Lingkungan Pesantren',   'Ns. Rini Aprilia', 1, NULL, 'Tips kesehatan mental untuk santri yang tinggal jauh dari keluarga',               '2025-01-07 11:00:00', 'pengalaman');

-- ============================================================
-- 33. DETAIL_MATERI
-- ============================================================
INSERT INTO detail_materi (id_detail_materi, id_materi, isi_materi, is_active) VALUES
(1,  1, 'Scabies adalah penyakit kulit yang disebabkan oleh tungau Sarcoptes scabiei. Penyakit ini sangat mudah menular melalui kontak fisik langsung maupun tidak langsung.', 1),
(2,  1, 'Gejala utama scabies adalah gatal yang hebat terutama pada malam hari. Gatal ini disebabkan oleh reaksi alergi tubuh terhadap tungau dan telurnya.', 1),
(3,  1, 'Pencegahan dapat dilakukan dengan: 1) Mandi teratur 2) Tidak berbagi pakaian/handuk 3) Mencuci pakaian dengan air panas 4) Menjaga kebersihan kamar tidur.', 1),
(4,  2, 'Mandi minimal dua kali sehari menggunakan sabun. Pastikan seluruh bagian tubuh termasuk sela-sela jari dibersihkan dengan baik.', 1),
(5,  2, 'Ganti pakaian setiap hari. Pakaian yang sudah dipakai tidak boleh diletakkan di atas tempat tidur untuk menghindari kontaminasi.', 1),
(6,  3, 'Santri yang aktif membutuhkan asupan gizi yang seimbang. Konsumsi nasi, lauk, sayur, dan buah setiap hari sangat dianjurkan.', 1),
(7,  4, 'Merasa rindu rumah adalah hal yang normal. Ceritakan perasaanmu kepada teman kepercayaan atau pembimbing pondok.', 1);

-- ============================================================
-- 34. MATERI_COMMENT
-- ============================================================
INSERT INTO materi_comment (id_comment, id_materi, id_user, isi_comment, is_active, created_at) VALUES
(1, 1, 1,  'Materinya sangat bermanfaat, terima kasih tim kesehatan!',          1, '2025-01-10 10:00:00'),
(2, 1, 6,  'Apakah scabies bisa sembuh sendiri tanpa obat?',                    1, '2025-01-10 11:00:00'),
(3, 2, 2,  'Sangat membantu untuk mengingatkan pentingnya kebersihan diri',      1, '2025-01-11 09:00:00'),
(4, 3, 7,  'Makanan di pondok sudah cukup bergizi menurut saya',                 1, '2025-01-12 08:00:00');

-- ============================================================
-- 35. MATERI_COMMENT_REPLY
-- ============================================================
INSERT INTO materi_comment_reply (id_reply, id_comment, id_user, isi_reply, is_active, created_at) VALUES
(1, 2, 11, 'Scabies tidak bisa sembuh sendiri dan harus diobati. Segera hubungi tim kesehatan jika ada gejala.', 1, '2025-01-10 12:00:00'),
(2, 1, 12, 'Sama-sama, semoga bermanfaat ya!',                                                                    1, '2025-01-10 13:00:00');

-- ============================================================
-- 36. PENGAJUAN_MATERI
-- ============================================================
INSERT INTO pengajuan_materi (id_pengajuan, judul_materi, penulis, ringkasan, isi_materi, gambar, id_pengaju, nama_pengaju, status, id_materi_hasil, catatan_timkes, created_at, updated_at) VALUES
(1, 'Tips Olahraga Ringan di Pesantren', 'Ahmad Fauzi', 'Cara berolahraga yang bisa dilakukan di lingkungan pondok dengan peralatan minimal', 'Olahraga ringan seperti senam pagi, push-up, dan sit-up bisa dilakukan di halaman kamar setiap pagi...', NULL, 1, 'Ahmad Fauzi', 'ditinjau',  NULL, NULL,                             '2025-01-12 08:00:00', '2025-01-12 08:00:00'),
(2, 'Manfaat Madu untuk Kesehatan',      'Siti Aisyah', 'Kandungan dan manfaat madu bagi kesehatan santri sehari-hari',                      'Madu mengandung antioksidan tinggi yang bermanfaat untuk meningkatkan imun tubuh...', NULL, 6, 'Siti Aisyah', 'disetujui', 4,   'Bagus, sudah dipublish ya', '2025-01-11 09:00:00', '2025-01-12 10:00:00');

-- ============================================================
-- 37. KONSULTASI_ROOM
-- ============================================================
INSERT INTO konsultasi_room (id_room, id_santri, id_timkes, status, antrian_urutan, active_date, last_message_at, closed_at, closed_by, close_reason_type, closed_reason_text, created_at, updated_at) VALUES
(1, 3,  11, 'closed',  1, '2025-01-08 10:00:00', '2025-01-08 11:00:00', '2025-01-08 11:30:00', 11, 'manual_timkes', 'Sesi konsultasi selesai',  '2025-01-08 09:50:00', '2025-01-08 11:30:00'),
(2, 5,  12, 'active',  2, '2025-01-10 09:00:00', '2025-01-10 10:30:00', NULL,                  NULL, NULL,          NULL,                        '2025-01-10 08:55:00', '2025-01-10 10:30:00'),
(3, 8,  11, 'waiting', 3, NULL,                  '2025-01-11 08:00:00', NULL,                  NULL, NULL,          NULL,                        '2025-01-11 07:58:00', '2025-01-11 08:00:00');

-- ============================================================
-- 38. KONSULTASI_MESSAGE
-- ============================================================
INSERT INTO konsultasi_message (id_message, id_room, id_sender, sender_role, messgae_text, sent_at, read_at, is_active) VALUES
(1, 1, 3,  'santri',       'Assalamualaikum, saya ingin konsultasi mengenai gatal-gatal di tangan saya',         '2025-01-08 10:00:00', '2025-01-08 10:02:00', 1),
(2, 1, 11, 'timkesehatan', 'Waalaikumsalam, sudah berapa lama gatal-gatalnya?',                                   '2025-01-08 10:05:00', '2025-01-08 10:06:00', 1),
(3, 1, 3,  'santri',       'Sudah sekitar seminggu, terutama malam hari terasa sangat gatal',                     '2025-01-08 10:08:00', '2025-01-08 10:09:00', 1),
(4, 1, 11, 'timkesehatan', 'Baik, silakan datang ke klinik pondok untuk pemeriksaan lebih lanjut ya',            '2025-01-08 10:15:00', '2025-01-08 10:20:00', 1),
(5, 2, 5,  'santri',       'Suster, saya masih demam hari ini, obat yang kemarin sudah habis',                   '2025-01-10 09:00:00', '2025-01-10 09:10:00', 1),
(6, 2, 12, 'timkesehatan', 'Baik, nanti saya siapkan obat lagi. Suhu tubuh sekarang berapa?',                   '2025-01-10 09:15:00', '2025-01-10 09:16:00', 1),
(7, 2, 5,  'santri',       '38.2 derajat suster, agak turun dari kemarin',                                       '2025-01-10 10:30:00', NULL,                   1),
(8, 3, 8,  'santri',       'Permisi, ingin konsultasi soal ruam merah di kaki saya',                             '2025-01-11 08:00:00', NULL,                   1);

-- ============================================================
-- 39. KONSULTASI_READ_CURSOR
-- ============================================================
INSERT INTO konsultasi_read_cursor (id_read, id_room, id_user, last_read_message_id, last_read_at) VALUES
(1, 1, 3,  4, '2025-01-08 10:20:00'),
(2, 1, 11, 4, '2025-01-08 10:20:00'),
(3, 2, 5,  6, '2025-01-10 09:16:00'),
(4, 2, 12, 7, '2025-01-10 10:31:00'),
(5, 3, 8,  8, '2025-01-11 08:01:00');

-- ============================================================
-- 40. PPDB_TAHUN
-- ============================================================
INSERT INTO ppdb_tahun (id, nama_gelombang, tahun_ajaran, gelombang, tanggal_buka, tanggal_tutup, tanggal_seleksi, tanggal_pengumuman, kuota, biaya_pendaftaran, deskripsi, is_active) VALUES
(1, 'Gelombang 1 TA 2025/2026', '2025/2026', 1, '2025-01-01 00:00:00', '2025-02-28 23:59:59', '2025-03-10 08:00:00', '2025-03-20 08:00:00', 50, 150000, 'Pendaftaran gelombang pertama tahun ajaran 2025/2026', 1),
(2, 'Gelombang 2 TA 2025/2026', '2025/2026', 2, '2025-03-01 00:00:00', '2025-04-30 23:59:59', '2025-05-10 08:00:00', '2025-05-20 08:00:00', 30, 150000, 'Pendaftaran gelombang kedua tahun ajaran 2025/2026',  1);

-- ============================================================
-- 41. PPDB_PENDAFTAR
-- ============================================================
INSERT INTO ppdb_pendaftar (id, id_tahun, nama_lengkap, jenis_kelamin, tempat_lahir, tanggal_lahir, anak_ke, jumlah_saudara, alamat, no_hp, email, asal_sekolah, jurusan_asal, tahun_lulus, nilai_rata_rapor, kemampuan_quran, juz_hafalan, no_pendaftaran, status, catatan_panitia, id_user_aktif, is_active) VALUES
(1, 1, 'Bilal Saputra',    'Laki-laki', 'Garut',     '2009-05-12', 1, 2, 'Jl. Garut No.1',   '08221111001', 'bilal@mail.com',    'SMP Al-Falah',    '-', '2024', 85.5, 'Juz Amma', 5,  'PPDB-2025-001', 'Seleksi',           NULL,                 NULL, 1),
(2, 1, 'Fatin Nur Azizah', 'Perempuan', 'Cianjur',   '2009-08-20', 2, 1, 'Jl. Cianjur No.2', '08221111002', 'fatin@mail.com',    'MTs Nurul Huda',  '-', '2024', 88.0, 'Al Quran', 10, 'PPDB-2025-002', 'Lulus',             'Nilai sangat baik',  NULL, 1),
(3, 1, 'Zaki Mubarak',     'Laki-laki', 'Tasikmalaya','2009-03-07', 3, 3, 'Jl. Tasik No.3',   '08221111003', 'zaki@mail.com',     'SMP Negeri 1',    '-', '2024', 78.5, 'Iqro',     0,  'PPDB-2025-003', 'Ditolak',           'Kuota sudah penuh',  NULL, 1),
(4, 2, 'Hana Khairunnisa',  'Perempuan', 'Sukabumi',  '2009-11-15', 1, 2, 'Jl. Sukabumi No.4','08221111004', 'hana@mail.com',     'MTs Al-Hidayah',  '-', '2025', 90.0, 'Hafidz',   15, 'PPDB-2025-004', 'Mendaftar',         NULL,                 NULL, 1);

-- ============================================================
-- 42. PPDB_ORANGTUA
-- ============================================================
INSERT INTO ppdb_orangtua (id, id_pendaftar, hubungan, nama, tempat_lahir, tanggal_lahir, pendidikan, pekerjaan, penghasilan, no_hp, alamat, is_active) VALUES
(1, 1, 'Ayah', 'Saputra Jaya',     'Garut',     '1975-01-10', 'SMA',   'Wiraswasta', '3000000-5000000', '08221110001', 'Jl. Garut No.1',    1),
(2, 1, 'Ibu',  'Nani Saputra',     'Bandung',   '1978-06-20', 'SMP',   'Ibu Rumah Tangga', '0',          '08221110002', 'Jl. Garut No.1',    1),
(3, 2, 'Ayah', 'Aziz Rahman',      'Cianjur',   '1973-03-15', 'S1',    'PNS',        '5000000-7000000', '08221110003', 'Jl. Cianjur No.2',  1),
(4, 2, 'Ibu',  'Nur Hayati',       'Sukabumi',  '1976-09-25', 'S1',    'Guru',       '3000000-5000000', '08221110004', 'Jl. Cianjur No.2',  1),
(5, 3, 'Ayah', 'Mubarak Senjaya',  'Tasikmalaya','1980-07-01','SMA',   'Petani',     '1000000-2000000', '08221110005', 'Jl. Tasik No.3',    1),
(6, 4, 'Ibu',  'Khairiyah',        'Sukabumi',  '1982-11-11', 'S1',    'Dokter',     '7000000-10000000','08221110006', 'Jl. Sukabumi No.4', 1);

-- ============================================================
-- 43. PPDB_DOKUMEN
-- ============================================================
INSERT INTO ppdb_dokumen (id, id_pendaftar, jenis_dokumen, nama_file, path_file, status_verif, catatan, is_active) VALUES
(1, 1, 'Foto 3x4',       'foto_bilal.jpg',   'uploads/ppdb/1/foto_bilal.jpg',   'Terverifikasi',      NULL,                    1),
(2, 1, 'Akta Kelahiran', 'akta_bilal.pdf',   'uploads/ppdb/1/akta_bilal.pdf',   'Terverifikasi',      NULL,                    1),
(3, 1, 'Kartu Keluarga', 'kk_bilal.pdf',     'uploads/ppdb/1/kk_bilal.pdf',     'Belum Diverifikasi', NULL,                    1),
(4, 2, 'Foto 3x4',       'foto_fatin.jpg',   'uploads/ppdb/2/foto_fatin.jpg',   'Terverifikasi',      NULL,                    1),
(5, 2, 'Ijazah',         'ijazah_fatin.pdf', 'uploads/ppdb/2/ijazah_fatin.pdf', 'Terverifikasi',      NULL,                    1),
(6, 3, 'Foto 3x4',       'foto_zaki.jpg',    'uploads/ppdb/3/foto_zaki.jpg',    'Ditolak',            'Foto tidak sesuai ukuran',1);

-- ============================================================
-- 44. PPDB_SELEKSI
-- ============================================================
INSERT INTO ppdb_seleksi (id, id_pendaftar, id_penilai, nilai_quran, catatan_quran, juz_diuji, nilai_tulis, catatan_tulis, nilai_wawancara, catatan_wawancara, nilai_total, tanggal_seleksi, status_seleksi, rekomendasi, is_active) VALUES
(1, 1, 11, 75.0, 'Bacaan cukup baik, tajwid perlu diperbaiki', 30, 80.0, 'Lulus KKM dengan baik',       78.0, 'Motivasi tinggi, komunikatif',        77.67, '2025-03-10 09:00:00', 'Selesai', 'Diterima',     1),
(2, 2, 12, 95.0, 'Hafalan sangat baik, mahir tajwid',          30, 92.0, 'Sangat memuaskan',             90.0, 'Sangat baik, mampu beradaptasi',      92.33, '2025-03-10 10:00:00', 'Selesai', 'Diterima',     1),
(3, 3, 11, 55.0, 'Masih iqro, belum lancar quran',             30, 60.0, 'Di bawah KKM',                 65.0, 'Motivasi kurang, sering diam',        60.00, '2025-03-10 11:00:00', 'Selesai', 'Ditolak',      1);

-- ============================================================
-- 45. PPDB_PEMBAYARAN_REF
-- ============================================================
INSERT INTO tagihan (id, id_santri, id_jenis_tagihan, nama_tagihan, nominal, tanggal_tagihan, batas_pembayaran, status, is_active) VALUES
(14, NULL, 4, 'Biaya Pendaftaran PPDB 2025 - Bilal',  150000, '2025-01-05', '2025-01-20', 'Lunas', 1),
(15, NULL, 4, 'Biaya Pendaftaran PPDB 2025 - Fatin',  150000, '2025-01-06', '2025-01-20', 'Lunas', 1),
(16, NULL, 4, 'Biaya Pendaftaran PPDB 2025 - Zaki',   150000, '2025-01-07', '2025-01-20', 'Lunas', 1),
(17, NULL, 4, 'Biaya Pendaftaran PPDB 2025 - Hana',   150000, '2025-02-01', '2025-02-15', 'Aktif', 1);

INSERT INTO ppdb_pembayaran_ref (id, id_pendaftar, id_tagihan, keterangan, is_active) VALUES
(1, 1, 14, 'Pembayaran biaya pendaftaran gelombang 1', 1),
(2, 2, 15, 'Pembayaran biaya pendaftaran gelombang 1', 1),
(3, 3, 16, 'Pembayaran biaya pendaftaran gelombang 1', 1),
(4, 4, 17, 'Pembayaran biaya pendaftaran gelombang 2', 1);

INSERT INTO pembayaran (id, id_tagihan, tanggal_bayar, nominal, metode_bayar, bukti_bayar, status, is_active) VALUES
(9,  14, '2025-01-10', 150000, 'Transfer', 'bukti_ppdb_1.jpg', 'Berhasil', 1),
(10, 15, '2025-01-11', 150000, 'Transfer', 'bukti_ppdb_2.jpg', 'Berhasil', 1),
(11, 16, '2025-01-12', 150000, 'Tunai',    NULL,               'Berhasil', 1);

-- ============================================================
-- 46. ACTIVITY_LOG
-- ============================================================
INSERT INTO activity_log (id, id_user, role_user, aksi, entitas, id_entitas, keterangan, data, created_at) VALUES
(1,  16, 'admin',        'CREATE', 'users',       1,  'Menambahkan santri baru Ahmad Fauzi',             NULL, '2024-07-01 08:00:00'),
(2,  16, 'admin',        'CREATE', 'kamar',        1,  'Membuat kamar Al-Fatih',                          NULL, '2024-07-01 08:30:00'),
(3,  11, 'timkesehatan', 'CREATE', 'screening',    1,  'Melakukan screening scabies pada Dimas',          NULL, '2025-01-08 10:00:00'),
(4,  11, 'timkesehatan', 'UPDATE', 'screening',    3,  'Update status screening Hendra menjadi scabies',  NULL, '2025-01-10 11:30:00'),
(5,  18, 'pengurus',     'UPDATE', 'pengaduan',    2,  'Menutup pengaduan lampu kamar Aisyah',            NULL, '2025-01-09 17:00:00'),
(6,  16, 'admin',        'CREATE', 'ppdb_pendaftar',1, 'Mendaftarkan PPDB pendaftar baru',                NULL, '2025-01-05 09:00:00'),
(7,  12, 'timkesehatan', 'CREATE', 'observasi',    3,  'Observasi kebersihan kamar Aisyah',               NULL, '2025-01-10 09:00:00');

-- ============================================================
-- 47. FAQ
-- ============================================================
INSERT INTO faq (id_faq, pertanyaan, jawaban, urutan, is_active, created_at) VALUES
(1, 'Bagaimana cara mendaftar ke pondok pesantren?',        'Pendaftaran dapat dilakukan secara online melalui sistem PPDB kami. Silakan isi formulir pendaftaran dan upload dokumen yang diperlukan.',              1, 1, '2025-01-01 08:00:00'),
(2, 'Apa saja dokumen yang diperlukan untuk mendaftar?',    'Dokumen yang diperlukan: Foto 3x4, Akta Kelahiran, Kartu Keluarga, Ijazah atau SKL dari sekolah asal.',                                               2, 1, '2025-01-01 08:00:00'),
(3, 'Berapa biaya pendaftaran?',                            'Biaya pendaftaran sebesar Rp 150.000 dapat dibayarkan melalui transfer bank atau tunai ke kantor administrasi pondok.',                                3, 1, '2025-01-01 08:00:00'),
(4, 'Apakah ada beasiswa di pondok pesantren ini?',         'Ya, pondok pesantren menyediakan beasiswa bagi santri berprestasi dan santri dari keluarga kurang mampu. Hubungi admin untuk informasi lebih lanjut.', 4, 1, '2025-01-01 08:00:00'),
(5, 'Bagaimana cara menghubungi tim kesehatan pondok?',     'Tim kesehatan dapat dihubungi melalui fitur konsultasi di aplikasi ini, atau langsung datang ke klinik pondok pada jam operasional 07.00 - 20.00.',   5, 1, '2025-01-01 08:00:00'),
(6, 'Apa yang harus dilakukan jika santri sakit?',          'Segera laporkan ke tim kesehatan pondok melalui fitur konsultasi atau kunjungi klinik pondok. Tim kesehatan siap membantu 24 jam untuk kedaruratan.',  6, 1, '2025-01-01 08:00:00');

-- ============================================================
-- SELESAI
-- ============================================================
SELECT 'Seed data berhasil diinsert!' AS status;