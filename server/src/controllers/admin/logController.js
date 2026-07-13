const prisma = require("../../config/prisma");

// Get All Logs with Server-Side Search & Optional Pagination
exports.getAllLogs = async (req, res) => {
    try {
        // Ambil parameter dari frontend
        const page = req.query.page ? parseInt(req.query.page) : null;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const { search, aksi, role, startDate, endDate } = req.query;

        // Bangun kondisi query pencarian
        let whereClause = {};

        if (aksi && aksi !== 'Semua') whereClause.aksi = aksi;
        if (role && role !== 'Semua') whereClause.role_user = role;

        if (startDate || endDate) {
            whereClause.created_at = {};
            if (startDate) {
                whereClause.created_at.gte = new Date(`${startDate}T00:00:00.000Z`);
            }
            if (endDate) {
                whereClause.created_at.lte = new Date(`${endDate}T23:59:59.999Z`);
            }
        }

        if (search) {
            whereClause.OR = [
                { keterangan: { contains: search } },
                { entitas: { contains: search } },
                { role_user: { contains: search } },
                { users: { nama: { contains: search } } }
            ];
        }

        let logs;
        let totalRows;

        if (page && limit) {
            const skip = (page - 1) * limit;
            const [count, list] = await prisma.$transaction([
                prisma.activity_log.count({ where: whereClause }),
                prisma.activity_log.findMany({
                    where: whereClause,
                    skip: skip,
                    take: limit,
                    orderBy: { created_at: 'desc' },
                    include: { users: { select: { nama: true } } }
                })
            ]);
            totalRows = count;
            logs = list;
        } else {
            logs = await prisma.activity_log.findMany({
                where: whereClause,
                orderBy: { created_at: 'desc' },
                include: { users: { select: { nama: true } } }
            });
            totalRows = logs.length;
        }

        // Mapping agar rapi
        const formattedLogs = logs.map(log => ({
            id: log.id,
            nama_user: log.users?.nama || "Sistem / Anonim",
            role_user: log.role_user || "-",
            aksi: log.aksi || "-",
            entitas: log.entitas || "-",
            keterangan: log.keterangan || "-",
            created_at: log.created_at
        }));

        res.json({ 
            success: true, 
            data: formattedLogs,
            meta: {
                totalRows,
                totalPages: limit ? Math.ceil(totalRows / limit) : 1,
                currentPage: page || 1
            }
        });
    } catch (error) {
        console.error("Error get all logs:", error);
        res.status(500).json({ success: false, message: "Gagal memuat log aktivitas" });
    }
};

// Route untuk mengambil list role yang unik (agar dropdown filter tetap jalan)
exports.getUniqueRoles = async (req, res) => {
    try {
        const rolesRaw = await prisma.activity_log.groupBy({
            by: ['role_user'],
            where: { role_user: { not: null } }
        });
        const roles = rolesRaw.map(r => r.role_user);
        res.json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};