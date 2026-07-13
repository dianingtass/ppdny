const prisma = require("../../config/prisma");

const formatFullDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
};

const formatTimeRange = (start, end) => {
    if (!start || !end) return "-";
    const formatTime = (dateObj) => {
        return new Date(dateObj).toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC'
        });
    };
    return `${formatTime(start)} - ${formatTime(end)} WIB`;
};

// GET: Lihat SEMUA Kegiatan (Global & Semua Kelas)
exports.getKegiatan = async (req, res) => {
    try {
        const { search, type } = req.query; 

        let whereCondition = { is_active: true };
        
        if (search) {
            whereCondition.nama_kegiatan = { contains: search };
        }
        
        const dayjs = require("dayjs");
        const utc = require("dayjs/plugin/utc");
        const timezone = require("dayjs/plugin/timezone");
        dayjs.extend(utc);
        dayjs.extend(timezone);
        const todayStr = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD");
        const today = new Date(`${todayStr}T00:00:00.000Z`);

        if (type === 'Mendatang') {
            whereCondition.tanggal = { gte: today };
        } else if (type === 'Selesai') {
            whereCondition.tanggal = { lt: today };
        }

        const kegiatans = await prisma.kegiatan.findMany({
            where: whereCondition,
            orderBy: { tanggal: 'desc' },
            include: {
                users: { select: { nama: true } },
                kelas: { select: { kelas: true } },
                kamar: { select: { kamar: true } }
            }
        });

        const data = kegiatans.map(k => {
            const kegDate = new Date(k.tanggal);
            kegDate.setHours(0,0,0,0);
            const statusWaktu = kegDate >= today ? "Mendatang" : "Selesai";

            let skala = "Global (Semua Santri)";
            if (k.kelas) skala = `Khusus Kelas ${k.kelas.kelas}`;
            else if (k.kamar) skala = `Khusus Kamar ${k.kamar.kamar}`;

            return {
                id: k.id,
                nama: k.nama_kegiatan,
                tanggal: formatFullDate(k.tanggal),
                waktu: formatTimeRange(k.waktu_mulai, k.waktu_selesai),
                lokasi: k.lokasi,
                deskripsi: k.deskripsi || "Tidak ada deskripsi.",
                nama_penanggung_jawab: k.users?.nama || "Admin Pondok",
                status_waktu: statusWaktu,
                
                skala,
                id_kelas: k.id_kelas,
                id_kamar: k.id_kamar,

                raw_tanggal: k.tanggal ? new Date(k.tanggal).toISOString().split('T')[0] : "",
                raw_waktu_mulai: k.waktu_mulai ? new Date(k.waktu_mulai).toISOString().substring(11, 16) : "",
                raw_waktu_selesai: k.waktu_selesai ? new Date(k.waktu_selesai).toISOString().substring(11, 16) : ""
            };
        });

        res.json({ success: true, data });

    } catch (err) {
        console.error("Error getKegiatan Admin:", err);
        res.status(500).json({ success: false, message: 'Gagal memuat daftar kegiatan' });
    }
};

// POST: Buat Kegiatan Admin (Otomatis Global)
exports.createKegiatan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { nama_kegiatan, tanggal, waktu_mulai, waktu_selesai, lokasi, deskripsi } = req.body;

        const timeStart = new Date(`1970-01-01T${waktu_mulai}:00Z`);
        const timeEnd = new Date(`1970-01-01T${waktu_selesai}:00Z`);

        await prisma.kegiatan.create({
            data: {
                nama_kegiatan: nama_kegiatan,
                tanggal: new Date(tanggal),
                waktu_mulai: timeStart,
                waktu_selesai: timeEnd,
                lokasi: lokasi,
                deskripsi: deskripsi,
                penanggung_jawab: userId,
                id_kelas: null, // ADMIN OTOMATIS BIKIN KEGIATAN GLOBAL
                rutin: false,
                is_active: true
            }
        });

        res.status(201).json({ success: true, message: 'Kegiatan Global berhasil ditambahkan!' });
    } catch (err) {
        console.error("Error createKegiatan Admin:", err);
        res.status(500).json({ success: false, message: 'Gagal menyimpan kegiatan baru' });
    }
};

exports.updateKegiatan = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_kegiatan, tanggal, waktu_mulai, waktu_selesai, lokasi, deskripsi } = req.body;

        const timeStart = new Date(`1970-01-01T${waktu_mulai}:00Z`);
        const timeEnd = new Date(`1970-01-01T${waktu_selesai}:00Z`);

        await prisma.kegiatan.update({
            where: { id: parseInt(id) },
            data: {
                nama_kegiatan,
                tanggal: new Date(tanggal),
                waktu_mulai: timeStart,
                waktu_selesai: timeEnd,
                lokasi,
                deskripsi
            }
        });

        res.json({ success: true, message: 'Kegiatan berhasil diperbarui!' });
    } catch (err) {
        console.error("Error updateKegiatan Admin:", err);
        res.status(500).json({ success: false, message: 'Gagal memperbarui kegiatan' });
    }
};

exports.deleteKegiatan = async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.kegiatan.update({
        where: { id: parseInt(id) },
        data: { is_active: false }
      });
      res.json({ success: true, message: "Kegiatan berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal menghapus kegiatan" });
    }
};