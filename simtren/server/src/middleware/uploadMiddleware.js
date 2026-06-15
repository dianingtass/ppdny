const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'application/pdf',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf']);

/**
 * Factory untuk membuat uploader Multer per subfolder ke Cloudinary.
 *
 * @param {string} subFolder   - Subfolder di Cloudinary (folder path)
 * @param {string} filePrefix  - Prefix nama file
 */
const createUploader = (subFolder, filePrefix = 'file') => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => {
            const path = require('path');
            const userId = req.user ? req.user.id : 'guest';
            const uniqueSuffix = Date.now();
            const isPdf = file.mimetype === 'application/pdf';

            return {
                folder: `ppdny/uploads/${subFolder}`,
                public_id: `${filePrefix}-${userId}-${uniqueSuffix}`,
                resource_type: isPdf ? 'raw' : 'image',
            };
        },
    });

    const fileFilter = (req, file, cb) => {
        const path = require('path');
        const ext = path.extname(file.originalname).toLowerCase();
        const mimeOk = ALLOWED_MIME_TYPES.has(file.mimetype);
        const extOk = ALLOWED_EXTENSIONS.has(ext);

        if (mimeOk && extOk) {
            cb(null, true);
        } else {
            cb(new Error('Format file tidak didukung. Hanya JPEG, PNG, WebP, dan PDF yang diizinkan.'));
        }
    };

    return multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
        fileFilter,
    });
};

module.exports = createUploader;
