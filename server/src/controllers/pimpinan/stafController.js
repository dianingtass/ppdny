const prisma = require("../../config/prisma");

// GET: Ambil list staf untuk pimpinan (view only)
exports.getStaffList = async (req, res) => {
  try {
    const targetRoles = ['admin', 'pimpinan', 'timkesehatan', 'pengurus'];
    const staff = await prisma.users.findMany({
      where: {
        user_role: { some: { role: { role: { in: targetRoles } } } }
      },
      include: { user_role: { include: { role: true } } },
      orderBy: { nama: 'asc' }
    });

    const formattedData = staff.map(user => {
      const activeRoles = user.user_role.filter(ur => ur.is_active);
      const rolesToMap = activeRoles.length > 0 ? activeRoles : user.user_role;
      return {
        id: user.id,
        nip: user.nip || "-",
        nama: user.nama || "Tanpa Nama",
        email: user.email || "-",
        no_hp: user.no_hp || "-",
        jenis_kelamin: user.jenis_kelamin,
        is_active: user.is_active,
        roles: rolesToMap.map(ur => {
          const r = ur.role.role;
          if (r === 'timkesehatan') return 'Tim Kesehatan';
          return r.charAt(0).toUpperCase() + r.slice(1);
        }), 
        foto_profil: user.foto_profil || null
      };
    });

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal memuat data staf" });
  }
};
