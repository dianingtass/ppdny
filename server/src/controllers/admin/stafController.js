const prisma = require("../../config/prisma");
const bcrypt = require('bcryptjs');

// Helper untuk mengambil list staf
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

// CREATE STAF BARU (Transaction & Validasi NIP)
exports.createStaff = async (req, res) => {
  try {
    const { nip, nama, email, no_hp, jenis_kelamin, roles } = req.body;
    
    if (nip && nip !== "") {
        const existingNip = await prisma.users.findFirst({
            where: { nip: nip }
        });
        if (existingNip) {
            return res.status(400).json({ 
                success: false, 
                message: "Gagal menyimpan: NIP tersebut sudah terdaftar di sistem!" 
            });
        }
    }

    if (email && email.trim() !== "") {
        const existingEmail = await prisma.users.findFirst({
            where: { email: email, is_active: true }
        });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'Email sudah digunakan oleh akun lain.' });
        }
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const dbRoles = roles.map(r => {
      if (r.toLowerCase() === 'tim kesehatan') return 'timkesehatan';
      return r.toLowerCase();
    });
    const roleRecords = await prisma.role.findMany({ where: { role: { in: dbRoles } } });
    
    if (roleRecords.length === 0) return res.status(400).json({ success: false, message: "Role tidak valid" });

    await prisma.$transaction(async (tx) => {
      const newUser = await tx.users.create({
        data: { nip, nama, email, no_hp, jenis_kelamin, password: hashedPassword, is_active: true }
      });

      const userRolesData = roleRecords.map(r => ({
        id_user: newUser.id,
        id_role: r.id,
        is_active: true
      }));

      await tx.user_role.createMany({ data: userRolesData });
    });

    res.json({ success: true, message: "Staf berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal menambah staf" });
  }
};

// UPDATE STAF
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const targetId = parseInt(id);
    const { nip, nama, email, no_hp, jenis_kelamin, roles } = req.body;

    if (nip && nip !== "") {
        const existingNip = await prisma.users.findFirst({
            where: { 
                nip: nip,
                id: { not: targetId }
            }
        });
        if (existingNip) {
            return res.status(400).json({ 
                success: false, 
                message: "Gagal menyimpan: NIP tersebut sudah dipakai oleh staf/pengguna lain!" 
            });
        }
    }

    if (email && email.trim() !== "") {
        const existingEmail = await prisma.users.findFirst({
            where: { email: email, id: { not: targetId }, is_active: true }
        });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'Email sudah digunakan oleh akun lain.' });
        }
    }

    const dbRoles = roles.map(r => {
      if (r.toLowerCase() === 'tim kesehatan') return 'timkesehatan';
      return r.toLowerCase();
    });
    const roleRecords = await prisma.role.findMany({ where: { role: { in: dbRoles } } });

    await prisma.$transaction(async (tx) => {
      // 1. Update profil dasar
      await tx.users.update({
        where: { id: targetId },
        data: { nip, nama, email, no_hp, jenis_kelamin }
      });

      // 2. Hapus (Soft Delete) semua role lama
      await tx.user_role.updateMany({
        where: { id_user: targetId },
        data: { is_active: false }
      });

      // 3. Masukkan role yang baru dicentang (Atau update jadi true jika sudah ada)
      for (const r of roleRecords) {
        const existingRole = await tx.user_role.findFirst({
          where: { id_user: targetId, id_role: r.id }
        });

        if (existingRole) {
          await tx.user_role.update({ where: { id: existingRole.id }, data: { is_active: true } });
        } else {
          await tx.user_role.create({ data: { id_user: targetId, id_role: r.id, is_active: true } });
        }
      }
    });

    res.json({ success: true, message: "Data staf berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal memperbarui staf" });
  }
};

// SOFT DELETE STAF (Deactivate)
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.$transaction([
      prisma.users.update({ where: { id: parseInt(id) }, data: { is_active: false } }),
      prisma.user_role.updateMany({ where: { id_user: parseInt(id) }, data: { is_active: false } })
    ]);
    res.json({ success: true, message: "Akun staf berhasil dinonaktifkan" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menonaktifkan staf" });
  }
};

// TOGGLE ACTIVATION STATUS
exports.toggleStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const targetId = parseInt(id);
    
    const user = await prisma.users.findUnique({
      where: { id: targetId },
      include: { user_role: true }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Staf tidak ditemukan" });
    }
    
    const newStatus = !user.is_active;
    
    await prisma.$transaction(async (tx) => {
      await tx.users.update({
        where: { id: targetId },
        data: { is_active: newStatus }
      });
      
      await tx.user_role.updateMany({
        where: { id_user: targetId },
        data: { is_active: newStatus }
      });
    });
    
    res.json({ 
      success: true, 
      message: `Akun staf berhasil ${newStatus ? "diaktifkan kembali" : "dinonaktifkan"}` 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengubah status aktif staf" });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    await prisma.users.update({
      where: { id: parseInt(id) },
      data: { password: hashedPassword }
    });
    res.json({ success: true, message: "Password berhasil direset ke 'password123'" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mereset password" });
  }
};