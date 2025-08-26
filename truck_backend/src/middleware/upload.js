const multer = require('multer');
const path = require('path');
const fs = require('fs'); // สำหรับตรวจสอบและสร้างโฟลเดอร์
const { v4: uuidv4 } = require('uuid'); // ใช้ UUID สำหรับชื่อไฟล์
// import w from '../uploads/vehicle_doc'

const getUploadPath = (file, fieldName) => {
    if (fieldName === 'image') {
        return 'uploads/emp_profile';
    }

    if (fieldName === 'signature') {
        return 'uploads/emp_signature';
    }

    // ถ้าไม่ตรงเงื่อนไขให้เก็บในโฟลเดอร์อื่น
    return 'uploads/others/';
};

// ตั้งค่าการเก็บไฟล์ในโฟลเดอร์ uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // ส่ง file.fieldname เข้าไปใน getUploadPath
        const uploadDir = path.join(__dirname, '../', getUploadPath(file, file.fieldname));
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
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

// ใช้ upload.fields() เพื่อรองรับการอัปโหลดหลายไฟล์
const uploadMultiple = uploadSingle.fields([
    { name: 'image', maxCount: 1 }, // กำหนดฟิลด์ 'file_download' สูงสุด 1 ไฟล์
    { name: 'signature', maxCount: 1 },   // กำหนดฟิลด์ 'file_finance' สูงสุด 1 ไฟล์
]);

module.exports = { uploadMultiple };







