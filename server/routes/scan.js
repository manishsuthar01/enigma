const express = require('express');
const router = express.Router();
const multer = require('multer');
const { scanContract } = require('../controllers/scanController');

// ── Multer config — memory storage, 10MB limit ─────────────────────────────
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
        const allowed = [
            'application/pdf',
            'text/plain',
        ];
        // Some systems report .txt as application/octet-stream
        const ext = file.originalname.split('.').pop().toLowerCase();
        if (allowed.includes(file.mimetype) || ['pdf', 'txt'].includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type: ${file.mimetype} (.${ext}). Only PDF and TXT are accepted.`));
        }
    },
});

router.post('/', upload.single('contract'), scanContract);

module.exports = router;
