const prisma = require('../../config/prisma');

// ─── JENIS LAYANAN ────────────────────────────────────────────────────────────

exports.getJenisLayanan = async (req, res) => {
    try {
        const { search } = req.query;
        const whereCondition = { is_active: true };
        if (search) whereCondition.nama_layanan = { contains: search };

        const layanan = await prisma.jenis_layanan.findMany({ 
            where: whereCondition, 
            include: { formulir_layanan: { where: { is_active: true } } },
            orderBy: { nama_layanan: 'asc' } 
        });
        return res.json({ success: true, data: layanan });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Gagal memuat data layanan.' });
    }
};

exports.createJenisLayanan = async (req, res) => {
    const { nama_layanan, estimasi, deskripsi, formulir } = req.body;
    try {
        await prisma.$transaction(async (tx) => {
            const newLayanan = await tx.jenis_layanan.create({
                data: {
                    nama_layanan,
                    estimasi,
                    deskripsi,
                    is_active: true
                }
            });
            
            if (formulir && Array.isArray(formulir)) {
                const fieldsData = formulir.map((field, idx) => ({
                    id_layanan: newLayanan.id,
                    name: field.name || `field_${idx}`,
                    label: field.label || '',
                    type: field.type || 'text',
                    placeholder: field.placeholder || '',
                    required: field.required !== undefined ? !!field.required : true,
                    is_active: true
                }));
                
                await tx.formulir_layanan.createMany({
                    data: fieldsData
                });
            }
        });
        return res.json({ success: true, message: 'Layanan berhasil ditambahkan.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Gagal menambah layanan.' });
    }
};

exports.updateJenisLayanan = async (req, res) => {
    const { id } = req.params;
    const { nama_layanan, estimasi, deskripsi, formulir } = req.body;
    try {
        await prisma.$transaction(async (tx) => {
            await tx.jenis_layanan.update({
                where: { id: parseInt(id) },
                data: { nama_layanan, estimasi, deskripsi }
            });

            if (formulir && Array.isArray(formulir)) {
                await tx.formulir_layanan.deleteMany({
                    where: { id_layanan: parseInt(id) }
                });

                const fieldsData = formulir.map((field, idx) => ({
                    id_layanan: parseInt(id),
                    name: field.name || `field_${idx}`,
                    label: field.label || '',
                    type: field.type || 'text',
                    placeholder: field.placeholder || '',
                    required: field.required !== undefined ? !!field.required : true,
                    is_active: true
                }));

                await tx.formulir_layanan.createMany({
                    data: fieldsData
                });
            }
        });
        return res.json({ success: true, message: 'Layanan berhasil diperbarui.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Gagal update layanan.' });
    }
};

exports.deleteJenisLayanan = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.jenis_layanan.update({ where: { id: parseInt(id) }, data: { is_active: false } });
        return res.json({ success: true, message: 'Layanan berhasil dihapus.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Gagal menghapus layanan.' });
    }
};

// ─── JENIS TAGIHAN ────────────────────────────────────────────────────────────

exports.getAllTagihan = async (req, res) => {
    try {
        const { search } = req.query;
        const data = await prisma.jenis_tagihan.findMany({
            where: { is_active: true, ...(search && { jenis_tagihan: { contains: search } }) },
            orderBy: { id: 'desc' },
        });
        return res.json({ success: true, data });
    } catch (err) {
        console.error('Error get jenis tagihan:', err);
        return res.status(500).json({ success: false, message: 'Gagal memuat data.' });
    }
};

exports.createTagihanJenis = async (req, res) => {
    try {
        const { jenis_tagihan, deskripsi } = req.body;
        const newData = await prisma.jenis_tagihan.create({ data: { jenis_tagihan, deskripsi, is_active: true } });
        return res.json({ success: true, message: 'Berhasil ditambahkan.', data: newData });
    } catch (err) {
        console.error('Error create jenis tagihan:', err);
        return res.status(500).json({ success: false, message: 'Gagal menambah data.' });
    }
};

exports.updateTagihanJenis = async (req, res) => {
    try {
        const { id } = req.params;
        const { jenis_tagihan, deskripsi } = req.body;
        const updatedData = await prisma.jenis_tagihan.update({ where: { id: parseInt(id) }, data: { jenis_tagihan, deskripsi } });
        return res.json({ success: true, message: 'Berhasil diperbarui.', data: updatedData });
    } catch (err) {
        console.error('Error update jenis tagihan:', err);
        return res.status(500).json({ success: false, message: 'Gagal memperbarui data.' });
    }
};

exports.removeTagihanJenis = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.jenis_tagihan.update({ where: { id: parseInt(id) }, data: { is_active: false } });
        return res.json({ success: true, message: 'Berhasil dihapus.' });
    } catch (err) {
        console.error('Error delete jenis tagihan:', err);
        return res.status(500).json({ success: false, message: 'Gagal menghapus data.' });
    }
};

// ─── RIWAYAT LAYANAN ──────────────────────────────────────────────────────────

exports.getRiwayatLayanan = async (req, res) => {
    try {
        const { search } = req.query;
        const whereCondition = { is_active: true };
        if (search) {
            whereCondition.OR = [
                { users: { nama: { contains: search } } },
                { jenis_layanan: { nama_layanan: { contains: search } } },
            ];
        }

        const riwayat = await prisma.riwayat_layanan.findMany({
            where:   whereCondition,
            orderBy: { waktu: 'desc' },
            include: {
                users:        { select: { nama: true, nip: true, foto_profil: true } },
                jenis_layanan:{ select: { nama_layanan: true } },
                riwayat_layanan_detail: { where: { is_active: true } },
                feedback:     { where: { is_active: true }, select: { rating: true, isi_text: true, tanggal: true } },
            },
        });

        return res.json({ success: true, data: riwayat });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Gagal memuat riwayat layanan.' });
    }
};

exports.updateStatusLayanan = async (req, res) => {
    const { id } = req.params;
    const { status_sesudah, catatan } = req.body;
    try {
        await prisma.riwayat_layanan.update({ where: { id: parseInt(id) }, data: { status_sesudah, catatan } });
        return res.json({ success: true, message: 'Status layanan diperbarui.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Gagal update status.' });
    }
};

// ─── KEUANGAN (TAGIHAN & PEMBAYARAN) ─────────────────────────────────────────

exports.getTagihan = async (req, res) => {
    try {
        const { search } = req.query;
        const whereCondition = { is_active: true };
        if (search) {
            whereCondition.OR = [
                { nama_tagihan: { contains: search } },
                { users: { nama: { contains: search } } },
            ];
        }
        const tagihan = await prisma.tagihan.findMany({
            where:   whereCondition,
            include: { users: { select: { nama: true, nip: true } }, jenis_tagihan: true },
            orderBy: { tanggal_tagihan: 'desc' },
        });
        return res.json({ success: true, data: tagihan });
    } catch (error) {
        return res.status(500).json({ message: 'Gagal memuat data.' });
    }
};

exports.getKeuanganOptions = async (req, res) => {
    try {
        const santri = await prisma.users.findMany({
            where:   { is_active: true, user_role: { some: { id_role: 1 } } },
            select:  { id: true, nama: true, nip: true },
            orderBy: { nama: 'asc' },
        });
        const jenis = await prisma.jenis_tagihan.findMany({ where: { is_active: true } });
        return res.json({ santri, jenis_tagihan: jenis });
    } catch (error) {
        return res.status(500).json({ message: 'Error loading options.' });
    }
};

exports.createTagihan = async (req, res) => {
    const { nama_tagihan, id_jenis_tagihan, nominal, tanggal_tagihan, batas_pembayaran, target_santri } = req.body;
    try {
        if (!nama_tagihan || !nama_tagihan.trim()) {
            return res.status(400).json({ success: false, message: 'Nama tagihan wajib diisi.' });
        }
        if (!id_jenis_tagihan) {
            return res.status(400).json({ success: false, message: 'Jenis tagihan wajib dipilih.' });
        }
        if (nominal === undefined || nominal === null || nominal === "") {
            return res.status(400).json({ success: false, message: 'Nominal tagihan wajib diisi.' });
        }
        const parsedNominal = parseInt(nominal);
        if (isNaN(parsedNominal)) {
            return res.status(400).json({ success: false, message: 'Nominal tagihan harus berupa angka.' });
        }
        if (parsedNominal <= 0) {
            return res.status(400).json({ success: false, message: 'Nominal tagihan harus lebih besar dari 0.' });
        }
        if (!tanggal_tagihan) {
            return res.status(400).json({ success: false, message: 'Tanggal tagihan wajib diisi.' });
        }
        if (!batas_pembayaran) {
            return res.status(400).json({ success: false, message: 'Tanggal jatuh tempo wajib diisi.' });
        }

        let targetIds = [];
        if (target_santri === 'all') {
            const allSantri = await prisma.users.findMany({
                where:  { is_active: true, user_role: { some: { id_role: 1 } } },
                select: { id: true },
            });
            targetIds = allSantri.map(s => s.id);
        } else if (Array.isArray(target_santri)) {
            targetIds = target_santri;
        } else {
            return res.status(400).json({ message: 'Target santri tidak valid.' });
        }

        if (targetIds.length === 0) return res.status(400).json({ message: 'Tidak ada santri terpilih.' });

        await prisma.$transaction(async (tx) => {
            const dataToInsert = targetIds.map(santriId => ({
                id_santri:        parseInt(santriId),
                id_jenis_tagihan: parseInt(id_jenis_tagihan),
                nama_tagihan,
                nominal:          parsedNominal,
                tanggal_tagihan:  new Date(tanggal_tagihan),
                batas_pembayaran: new Date(batas_pembayaran),
                status:           'Aktif',
                is_active:        true,
            }));
            await tx.tagihan.createMany({ data: dataToInsert });
        });

        return res.json({ success: true, message: `Berhasil membuat tagihan untuk ${targetIds.length} santri.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Gagal membuat tagihan.' });
    }
};

exports.updateTagihan = async (req, res) => {
    const { id } = req.params;
    const { nama_tagihan, nominal, tanggal_tagihan, batas_pembayaran, id_jenis_tagihan } = req.body;
    try {
        if (!nama_tagihan || !nama_tagihan.trim()) {
            return res.status(400).json({ success: false, message: 'Nama tagihan wajib diisi.' });
        }
        if (!id_jenis_tagihan) {
            return res.status(400).json({ success: false, message: 'Jenis tagihan wajib dipilih.' });
        }
        if (nominal === undefined || nominal === null || nominal === "") {
            return res.status(400).json({ success: false, message: 'Nominal tagihan wajib diisi.' });
        }
        const parsedNominal = parseInt(nominal);
        if (isNaN(parsedNominal)) {
            return res.status(400).json({ success: false, message: 'Nominal tagihan harus berupa angka.' });
        }
        if (parsedNominal <= 0) {
            return res.status(400).json({ success: false, message: 'Nominal tagihan harus lebih besar dari 0.' });
        }
        if (!tanggal_tagihan) {
            return res.status(400).json({ success: false, message: 'Tanggal tagihan wajib diisi.' });
        }
        if (!batas_pembayaran) {
            return res.status(400).json({ success: false, message: 'Tanggal jatuh tempo wajib diisi.' });
        }

        await prisma.tagihan.update({
            where: { id: parseInt(id) },
            data: { nama_tagihan, id_jenis_tagihan: parseInt(id_jenis_tagihan), nominal: parsedNominal, tanggal_tagihan: new Date(tanggal_tagihan), batas_pembayaran: new Date(batas_pembayaran) },
        });
        return res.json({ success: true, message: 'Tagihan diperbarui.' });
    } catch (error) {
        return res.status(500).json({ message: 'Gagal update.' });
    }
};

exports.deleteTagihan = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.tagihan.update({ where: { id: parseInt(id) }, data: { is_active: false } });
        return res.json({ success: true, message: 'Tagihan dihapus.' });
    } catch (error) {
        return res.status(500).json({ message: 'Gagal hapus.' });
    }
};

exports.getPembayaranByTagihan = async (req, res) => {
    const { idTagihan } = req.params;
    try {
        const tagihan = await prisma.tagihan.findUnique({ where: { id: parseInt(idTagihan) }, select: { id: true, status: true, nominal: true } });
        const list    = await prisma.pembayaran.findMany({ where: { id_tagihan: parseInt(idTagihan), is_active: true }, orderBy: { tanggal_bayar: 'desc' } });
        return res.json({ success: true, data: list, tagihanInfo: tagihan });
    } catch (error) {
        return res.status(500).json({ message: 'Error loading payments.' });
    }
};

exports.updateStatusTagihan = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await prisma.tagihan.update({ where: { id: parseInt(id) }, data: { status } });
        return res.json({ success: true, message: 'Status tagihan diperbarui.' });
    } catch (error) {
        return res.status(500).json({ message: 'Gagal update status tagihan.' });
    }
};

exports.verifyPembayaran = async (req, res) => {
    const { id } = req.params;
    const { status, nominal_baru } = req.body;
    try {
        const updateData = { status };
        if (nominal_baru) updateData.nominal = parseFloat(nominal_baru);

        const updatedPay = await prisma.pembayaran.update({ where: { id: parseInt(id) }, data: updateData });
        const tagihanId = updatedPay.id_tagihan;

        const allPays = await prisma.pembayaran.findMany({
            where: { id_tagihan: tagihanId, is_active: true }
        });

        const totalPaid = allPays
            .filter(p => p.status === 'Berhasil')
            .reduce((acc, curr) => acc + (curr.nominal || 0), 0);

        const hasPending = allPays.some(p => p.status === 'Pending');

        const tagihan = await prisma.tagihan.findUnique({ where: { id: tagihanId } });

        if (tagihan) {
            if (totalPaid >= tagihan.nominal) {
                await prisma.tagihan.update({ where: { id: tagihanId }, data: { status: 'Lunas' } });
            } else if (hasPending || (totalPaid > 0 && totalPaid < tagihan.nominal)) {
                await prisma.tagihan.update({ where: { id: tagihanId }, data: { status: 'Perlu_Konfirmasi' } });
            } else {
                await prisma.tagihan.update({ where: { id: tagihanId }, data: { status: 'Aktif' } });
            }
        }

        return res.json({ success: true, message: 'Pembayaran berhasil diverifikasi.' });
    } catch (error) {
        console.error("verifyPembayaran error:", error);
        return res.status(500).json({ message: 'Gagal verifikasi pembayaran.' });
    }
};

exports.getRiwayatLayananOptions = async (req, res) => {
    try {
        const santri = await prisma.users.findMany({
            where: { is_active: true, user_role: { some: { id_role: 1, is_active: true } } },
            select: { id: true, nama: true, nip: true },
            orderBy: { nama: 'asc' }
        });
        const layanan = await prisma.jenis_layanan.findMany({
            where: { is_active: true },
            include: { formulir_layanan: { where: { is_active: true } } },
            orderBy: { nama_layanan: 'asc' }
        });
        return res.json({ success: true, data: { santri, layanan } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Gagal memuat opsi pengajuan.' });
    }
};

exports.createRiwayatLayanan = async (req, res) => {
    try {
        const { id_santri, id_layanan, status_sesudah, catatan, form_data } = req.body;

        if (!id_santri || !id_layanan) {
            return res.status(400).json({ success: false, message: "Santri dan Jenis Layanan wajib diisi" });
        }

        const result = await prisma.$transaction(async (tx) => {
            const riwayat = await tx.riwayat_layanan.create({
                data: {
                    id_santri: parseInt(id_santri),
                    id_layanan: parseInt(id_layanan),
                    waktu: new Date(),
                    status_sebelum: 'Proses',
                    status_sesudah: status_sesudah || 'Proses',
                    catatan: catatan || ""
                }
            });

            if (Array.isArray(form_data) && form_data.length > 0) {
                const detailData = form_data.map(item => ({
                    id_riwayat: riwayat.id,
                    aspek: String(item.label || "-"),
                    detail: String(item.value || "-"),
                    is_active: true
                }));

                await tx.riwayat_layanan_detail.createMany({
                    data: detailData
                });
            }

            return riwayat;
        });

        return res.json({ success: true, message: "Pengajuan layanan berhasil disimpan", data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Gagal menyimpan pengajuan", error_detail: error.message });
    }
};
