const prisma = require("../../config/prisma");
const bcrypt = require("bcryptjs");

const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

// 1. Get Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.users.findUnique({
      where: { id: userId, is_active: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    const data = {
      data_kepegawaian: { nip: user.nip || "-" },
      data_diri: {
        nama_lengkap: user.nama || "",
        jenis_kelamin: user.jenis_kelamin || "",
        email: user.email || "",
        no_hp: user.no_hp || "",
        alamat: user.alamat || "",
        foto_profil: user.foto_profil || null
      }
    };

    res.json({ success: true, data });
  } catch (err) {
    console.error("Error getProfile:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil data profil" });
  }
};

// 2. Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nama_lengkap, jenis_kelamin, email, no_hp, alamat } = req.body;

    await prisma.users.update({
      where: { id: userId },
      data: {
        nama: nama_lengkap,
        jenis_kelamin,
        email,
        no_hp,
        alamat
      }
    });

    res.json({ success: true, message: "Data profil berhasil diperbarui" });
  } catch (err) {
    console.error("Error updateProfile:", err);
    res.status(500).json({ success: false, message: "Gagal memperbarui data profil" });
  }
};

// 3. Update Password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password_baru } = req.body;

    if (!password_baru || password_baru.length < 6) {
      return res.status(400).json({ success: false, message: "Password minimal 6 karakter" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_baru, salt);

    await prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ success: true, message: "Password berhasil diubah" });
  } catch (err) {
    console.error("Error updatePassword:", err);
    res.status(500).json({ success: false, message: "Gagal mengubah password" });
  }
};

// 4. Update Photo
exports.updatePhoto = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah" });
    }

    const newPhotoUrl = req.file.secure_url || req.file.path;

    await prisma.users.update({
      where: { id: userId },
      data: { foto_profil: newPhotoUrl }
    });

    res.json({
      success: true,
      message: "Foto profil berhasil diperbarui",
      data: { url: newPhotoUrl }
    });
  } catch (err) {
    console.error("Error updatePhoto:", err);
    res.status(500).json({ success: false, message: "Gagal mengunggah foto" });
  }
};
