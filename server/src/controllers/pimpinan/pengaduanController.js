const prisma = require("../../config/prisma");

// Helper Date
const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// 1. GET: Daftar Pengaduan (Semua Pengaduan Aktif)
exports.getDaftarPengaduan = async (req, res) => {
  try {
    const { rolePelapor, startDate, endDate, idPelapor } = req.query;

    const where = { is_active: true };

    if (idPelapor) {
      where.id_pelapor = parseInt(idPelapor);
    } else if (rolePelapor === "ustadz") {
      where.users_pengaduan_id_pelaporTousers = {
        user_role: { some: { id_role: 3, is_active: true } }
      };
    } else if (rolePelapor === "orangtua") {
      where.users_pengaduan_id_pelaporTousers = {
        user_role: { some: { id_role: 4, is_active: true } }
      };
    }

    if (startDate || endDate) {
      where.waktu_aduan = {};
      if (startDate) where.waktu_aduan.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.waktu_aduan.lte = end;
      }
    }

    const pengaduan = await prisma.pengaduan.findMany({
      where,
      orderBy: [ {status: "asc"}, {waktu_aduan: "desc"} ],
      include: {
        users_pengaduan_id_santriTousers: {
          select: {
            nama: true,
            nip: true,
            foto_profil: true,
            kelas_santri: { include: { kelas: true }, take: 1 },
          },
        },
        users_pengaduan_id_pelaporTousers: {
          select: { nama: true }
        },
        _count: { select: { tanggapan_aduan: { where: { is_active: true } } } },
      },
    });

    const formattedData = pengaduan.map((item) => ({
      id: item.id,
      judul: item.judul || "Tanpa Judul",
      deskripsi: item.deskripsi,
      waktu: formatDate(item.waktu_aduan),
      status: item.status,
      santri: {
        nama: item.users_pengaduan_id_santriTousers?.nama || "Tidak diketahui",
        nip: item.users_pengaduan_id_santriTousers?.nip || "-",
        foto_profil: item.users_pengaduan_id_santriTousers?.foto_profil || null,
        kelas: item.users_pengaduan_id_santriTousers?.kelas_santri[0]?.kelas?.kelas || "-",
      },
      pelapor: item.users_pengaduan_id_pelaporTousers?.nama || "Tidak diketahui",
      jumlah_tanggapan: item._count.tanggapan_aduan,
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error get pengaduan:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data pengaduan" });
  }
};

// 2. GET: Detail & Percakapan (Sama seperti referensimu)
exports.getDetailPengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await prisma.pengaduan.findUnique({
      where: { id: parseInt(id) },
      include: {
        users_pengaduan_id_santriTousers: { select: { nama: true, nip: true } },
        tanggapan_aduan: {
          where: { is_active: true },
          orderBy: { waktu_tanggapan: "asc" },
          include: {
            users: {
              select: {
                id: true,
                nama: true,
                foto_profil: true,
                user_role: { include: { role: true }, take: 1 },
              },
            },
          },
        },
      },
    });

    if (!detail)
      return res
        .status(404)
        .json({ success: false, message: "Pengaduan tidak ditemukan" });

    // Formatting date
    detail.waktu_aduan_format = formatDate(detail.waktu_aduan);
    detail.tanggapan_aduan = detail.tanggapan_aduan.map((t) => ({
      ...t,
      waktu_format: formatDate(t.waktu_tanggapan),
    }));

    res.json({ success: true, data: detail });
  } catch (error) {
    console.error("Error get detail:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil detail pengaduan" });
  }
};
