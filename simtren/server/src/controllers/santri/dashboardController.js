const prisma = require("../../config/prisma");

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        const pengguna = await prisma.users.findUnique({
            where: { id: userId },
            include: {
                kelas_santri: {
                    where: { is_active: true },
                    take: 1,
                    orderBy: { id: 'desc' },
                    include: {
                        kelas: {
                            include: {
                                users: { select: { id: true, nama: true } } // wali kelas
                            }
                        }
                    }
                },
                kamar_santri: {
                    where: { is_active: true },
                    take: 1,
                    orderBy: { tanggal_masuk: 'desc' },
                    include: {
                        kamar: {
                            include: {
                                users: { select: { id: true, nama: true } } // wali kamar
                            }
                        }
                    }
                }
            }
        });

        if (!pengguna) {
            return res.status(404).json({ success: false, message: 'Data santri tidak ditemukan' });
        }

        const santriId = pengguna.id; 

        const dayjs = require("dayjs");
        const utc = require("dayjs/plugin/utc");
        const timezone = require("dayjs/plugin/timezone");
        dayjs.extend(utc);
        dayjs.extend(timezone);
        const todayJakarta = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD");
        const startDate = new Date(`${todayJakarta}T00:00:00.000Z`);
        const endDate = new Date(`${todayJakarta}T23:59:59.999Z`);

        const [
            tagihan, 
            kegiatanHariIni, 
            pengaduanList,
            stats
        ] = await Promise.all([
            prisma.tagihan.findFirst({
                where: { id_santri: santriId, is_active: true },
                orderBy: { tanggal_tagihan: 'desc' },
                include: {
                    pembayaran: { orderBy: { tanggal_bayar: 'desc' }, take: 1 }
                }
            }),
            prisma.kegiatan.findMany({
                where: { tanggal: { gte: startDate, lte: endDate }, is_active: true },
                orderBy: { waktu_mulai: 'asc' }
            }),
            prisma.pengaduan.findMany({
                where: { id_santri: santriId, is_active: true },
                orderBy: { waktu_aduan: 'desc' },
                take: 3
            }),
            Promise.all([
                prisma.pengaduan.count({ where: { id_santri: santriId, is_active: true } })
            ])
        ]);

        const [jumlahPengaduan] = stats;
        const pembayaranTerakhir = tagihan?.pembayaran?.[0] || null;

        const kelasData = pengguna.kelas_santri[0]?.kelas;
        const kamarData = pengguna.kamar_santri[0]?.kamar;

        const dashboardData = {
            santri: {
                nama: pengguna.nama || '-',
                nip: pengguna.nip || '-',
                foto_profil: pengguna.foto_profil,
                kelas: kelasData?.kelas || '-',
                kamar: kamarData?.kamar || '-',
                wali_kelas: kelasData?.users?.nama || null,
                wali_kamar: kamarData?.users?.nama || null,
                status: pengguna.is_active ? 'Aktif' : 'Tidak Aktif'
            },

            keuangan: {
                tagihan_terakhir: {
                    bulan: tagihan?.nama_tagihan || (tagihan?.tanggal_tagihan ? new Date(tagihan.tanggal_tagihan).toLocaleString('id-ID', { month: 'long' }) : '-'),
                    jumlah: tagihan?.nominal || 0,
                    status: tagihan?.status || (pembayaranTerakhir ? 'Diproses' : 'Belum Lunas'),
                    jatuh_tempo: tagihan?.batas_pembayaran || '-'
                },
                pembayaran_terakhir: pembayaranTerakhir ? {
                    tanggal: pembayaranTerakhir.tanggal_bayar,
                    nominal: pembayaranTerakhir.nominal,
                    metode: pembayaranTerakhir.metode_bayar,
                    status: pembayaranTerakhir.status
                } : null
            },

            kegiatan_hari_ini: kegiatanHariIni.map(keg => ({
                waktu_mulai: keg.waktu_mulai,
                waktu_selesai: keg.waktu_selesai,
                nama: keg.nama_kegiatan,
                penanggung_jawab: "Ustadz/Pengurus",
                deskripsi: keg.deskripsi
            })),

            aktivitas_terakhir: {
                pengaduan: pengaduanList.map(p => ({
                    id: p.id,
                    deskripsi: p.judul || p.deskripsi || 'Pengaduan',
                    waktu: p.waktu_aduan,
                    status: p.status || 'Aktif',
                    jenis: 'pengaduan'
                }))
            },

            statistik: {
                jumlah_pengaduan: jumlahPengaduan
            },

            menu_cepat: [
                { id: 1, nama: "Pendataan Diri", icon: "user", endpoint: "/santri/profil", accessible: true },
                { id: 2, nama: "Tagihan & Keuangan", icon: "credit-card", endpoint: "/santri/keuangan", accessible: true },
                { id: 3, nama: "Kegiatan", icon: "calendar", endpoint: "/santri/kegiatan", accessible: true },
                { id: 4, nama: "Pengaduan", icon: "alert-circle", endpoint: "/santri/pengaduan", accessible: true },
                { id: 5, nama: "Riwayat Layanan", icon: "history", endpoint: "/santri/layanan", accessible: true }
            ]
        };

        res.status(200).json({
            success: true,
            data: dashboardData,
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan sistem',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined 
        });
    }
};

