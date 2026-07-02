const prisma = require('../config/prisma');

const validateFaqAccess = (role, kategori) => {
  const normalizedRole = (role || '').toLowerCase().replace(/\s/g, '');
  if (normalizedRole === 'admin') return true;
  if (normalizedRole === 'pengurus' && kategori === 'Umum') return true;
  if (normalizedRole === 'timkesehatan' && kategori === 'Kesehatan') return true;
  return false;
};

exports.getFaqList = async (req, res) => {
  try {
    const data = await prisma.faq.findMany({
      where: { is_active: true },
      orderBy: [{ urutan: 'asc' }, { id_faq: 'asc' }]
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFaq = async (req, res) => {
  try {
    const { pertanyaan, jawaban, kategori, urutan } = req.body;
    const userRole = req.user.role;

    if (!validateFaqAccess(userRole, kategori)) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki hak akses untuk membuat FAQ kategori ini.' });
    }

    const newFaq = await prisma.faq.create({
      data: {
        pertanyaan,
        jawaban,
        kategori,
        urutan: parseInt(urutan) || 1,
        is_active: true,
        created_at: new Date()
      }
    });

    res.json({ success: true, message: 'FAQ berhasil dibuat.', data: newFaq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { pertanyaan, jawaban, kategori, urutan } = req.body;
    const userRole = req.user.role;

    const existingFaq = await prisma.faq.findUnique({ where: { id_faq: parseInt(id) } });
    if (!existingFaq) {
      return res.status(404).json({ success: false, message: 'FAQ tidak ditemukan.' });
    }

    // Validasi kategori lama dan kategori baru
    if (!validateFaqAccess(userRole, existingFaq.kategori) || !validateFaqAccess(userRole, kategori)) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki hak akses untuk mengubah FAQ kategori ini.' });
    }

    const updated = await prisma.faq.update({
      where: { id_faq: parseInt(id) },
      data: {
        pertanyaan,
        jawaban,
        kategori,
        urutan: parseInt(urutan) || existingFaq.urutan
      }
    });

    res.json({ success: true, message: 'FAQ berhasil diperbarui.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    const existingFaq = await prisma.faq.findUnique({ where: { id_faq: parseInt(id) } });
    if (!existingFaq) {
      return res.status(404).json({ success: false, message: 'FAQ tidak ditemukan.' });
    }

    if (!validateFaqAccess(userRole, existingFaq.kategori)) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki hak akses untuk menghapus FAQ kategori ini.' });
    }

    // Soft delete
    await prisma.faq.update({
      where: { id_faq: parseInt(id) },
      data: { is_active: false }
    });

    res.json({ success: true, message: 'FAQ berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
