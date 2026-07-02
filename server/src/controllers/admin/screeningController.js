const { createScreeningController } = require("../shared/sharedScreeningController");
const prisma = require("../../config/prisma");

const sharedController = createScreeningController({
  writableRoles: ["admin"]
});

module.exports = {
  ...sharedController,

  updateFotoPredileksi: async (req, res) => {
    try {
      const { id } = req.params; // id_screening

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Foto wajib diupload"
        });
      }

      const existing = await prisma.screening.findUnique({
        where: { id_screening: Number(id) }
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Data screening tidak ditemukan"
        });
      }

      await prisma.screening.update({
        where: { id_screening: Number(id) },
        data: {
          foto_predileksi: req.file.secure_url || req.file.path
        }
      });

      res.json({
        success: true,
        message: "Foto predileksi berhasil diperbarui"
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};