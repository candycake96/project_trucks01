const multer = require('multer');
const path = require('path');
const fs = require('fs'); // สำหรับตรวจสอบและสร้างโฟลเดอร์
const { v4: uuidv4 } = require('uuid'); // ใช้ UUID สำหรับชื่อไฟล์

// ตั้งค่าการเก็บไฟล์ในโฟลเดอร์ uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // ตรวจสอบว่าโฟลเดอร์ uploads มีหรือไม่ ถ้าไม่มีก็สร้าง
        const uploadDir = path.join(__dirname, '../../../uploads/logo');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir); // เส้นทางโฟลเดอร์
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // ดึงนามสกุลไฟล์
        cb(null, `${uuidv4()}${ext}`); // ตั้งชื่อไฟล์ใหม่โดยใช้ UUID
    },
});

// ตรวจสอบชนิดไฟล์ที่อนุญาต (เฉพาะไฟล์ภาพ)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('ไฟล์ที่อัปโหลดต้องเป็นไฟล์รูปภาพเท่านั้น'));
};

// ตั้งค่าการตั้งค่า uploadSingle
const uploadSingle = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // ตั้งค่าขนาดไฟล์สูงสุดที่ 10MB
});

module.exports = { uploadSingle };
