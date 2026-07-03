const prisma = require("../../config/prisma");

exports.getLandingStats = async (req, res) => {
    try {
        // 1. Hitung Total Santri Aktif
        let totalSantri = await prisma.user_role.count({
            where: {
                role: { role: 'Santri' },
                is_active: true,
                users: { is_active: true }
            }
        });

        if(totalSantri > 10){
            totalSantri = totalSantri - (totalSantri % 10);
        }

        // 2. Hitung Total Pengajar (Ustadz) Aktif
        let totalUstadz = await prisma.user_role.count({
            where: {
                role: { role: 'Ustadz' },
                is_active: true,
                users: { is_active: true }
            }
        });

        if(totalUstadz > 10){
            totalUstadz = totalUstadz - (totalUstadz % 10);
        }        

        res.json({
            success: true,
            data: {
                santri: totalSantri,
                ustadz: totalUstadz
            }
        });

    } catch (error) {
        console.error("Public Stats Error:", error);
        res.status(500).json({ success: false, message: "Gagal memuat statistik publik" });
    }
};

exports.getPpdbStatus = async (req, res) => {
    try {
        const activeYear = await prisma.ppdb_tahun.findFirst({
            where: {
                is_active: true,
                tanggal_buka: { lte: new Date() },
                tanggal_tutup: { gte: new Date() }
            }
        });

        res.json({
            success: true,
            isOpen: !!activeYear,
            gelombang: activeYear ? activeYear.nama_gelombang : null
        });
    } catch (error) {
        console.error("Get PPDB Status Error:", error);
        res.status(500).json({ success: false, message: "Gagal memuat status PPDB" });
    }
};