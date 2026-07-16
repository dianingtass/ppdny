const prisma = require('../../config/prisma');

const getGuidebookScreenshots = async (req, res) => {
  try {
    const role = req.query.role || 'santri';
    
    // Fetch screenshots using raw query to bypass compile-time model checks
    const rows = await prisma.$queryRaw`
      SELECT modul, bagian, device, url 
      FROM guidebook_screenshot 
      WHERE role = ${role}
    `;

    // Map into flat lookup dictionary
    const mapping = {};
    if (Array.isArray(rows)) {
      rows.forEach(row => {
        const key = `${row.modul}_${row.bagian}_${row.device}`;
        mapping[key] = row.url;
      });
    }

    return res.status(200).json({
      success: true,
      data: mapping
    });
  } catch (error) {
    console.error('Error fetching guidebook screenshots:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat data panduan'
    });
  }
};

module.exports = {
  getGuidebookScreenshots
};
