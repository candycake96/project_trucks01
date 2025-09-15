const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// ฟังก์ชันกำหนดโฟลเดอร์เก็บไฟล์
const getUploadPath = () => 'uploads/vehicle_img/';

// Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../../', getUploadPath());
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/; // เฉพาะรูป
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('ไฟล์ที่อัปโหลดต้องเป็นรูปภาพเท่านั้น'));
};

// Multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Middleware สำหรับหลายไฟล์ใน field 'vehicle_img'
const uploadMultiple = upload.array('vehicle_img', 10); // สูงสุด 10 รูป

module.exports = { uploadMultiple };
