const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// ฟังก์ชันสำหรับการกำหนดที่เก็บไฟล์
const getUploadPath = (file, fieldName) => {
    if (fieldName === 'file_download') {
        return 'uploads/vehicle_doc/';
    }

    if (fieldName === 'file_finance') {
        return 'uploads/finance/';
    }

    if (fieldName === 'file_status') {
        return 'uploads/status_doc/';
    }

    if (fieldName === 'insurance_file') {
        return 'uploads/insurance_doc/';
    }

    if (fieldName === 'insurance_goods_file') {
        return 'uploads/insurance_doc/';
    }

    // -ข้อมูลไฟล์เอกสาร vendor 
    if (fieldName === 'file_vendor') {
        return 'uploads/vendor_doc/';
    }

    // ถ้าเป็นไฟล์ใบเสนอราคา ให้เก็บในโฟลเดอร์ quotation_doc
    if (fieldName === 'quotation_file') {
        return 'uploads/quotationMainternance/';
    }

        // ถ้าเป็นไฟล์ใบเสนอราคา ให้เก็บในโฟลเดอร์ quotation_doc
    if (fieldName === 'close_file') {
        return 'uploads/Close_job_mainternence/';
    }

    // ถ้าไม่ตรงเงื่อนไขให้เก็บในโฟลเดอร์อื่น
    return 'uploads/others/';
};

// การตั้งค่าการจัดเก็บไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // ส่ง file.fieldname เข้าไปใน getUploadPath
        const uploadDir = path.join(__dirname, '../../../', getUploadPath(file, file.fieldname));
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

// การตรวจสอบไฟล์ที่อัปโหลด
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('ไฟล์ที่อัปโหลดต้องเป็นรูปภาพหรือเอกสารเท่านั้น'));
};

// การตั้งค่าการอัปโหลด
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Maximum file size 10MB 
});

// ใช้ upload.fields() เพื่อรองรับการอัปโหลดหลายไฟล์
const uploadMultiple = upload.fields([
    { name: 'file_download', maxCount: 1 }, // กำหนดฟิลด์ 'file_download' สูงสุด 1 ไฟล์
    { name: 'file_finance', maxCount: 1 },   // กำหนดฟิลด์ 'file_finance' สูงสุด 1 ไฟล์
    { name: 'file_status', maxCount: 1 },   // กำหนดฟิลด์ 'file_status' สูงสุด 1 ไฟล์
    { name: 'insurance_file', maxCount: 1 }, // กำหนดฟิลด์ 'insurance_file' รองรับได้สูงสุด 1 ไฟล์ 
    { name: 'insurance_goods_file', maxCount: 1 }, // กำหนดฟิลด์ 'insurance_file' รองรับได้สูงสุด 1 ไฟล์ 
    { name: 'file_vendor', maxCount: 1 }, // กำหนดฟิลด์ 'file_vendor' รองรับได้สูงสุด 1 ไฟล์ 
    { name: 'quotation_file', maxCount: 1 }, // กำหนดฟิลด์ 'file_vendor' รองรับได้สูงสุด 1 ไฟล์ 
    { name: 'close_file', maxCount: 1 }, // กำหนดฟิลด์ 'file_vendor' รองรับได้สูงสุด 1 ไฟล์ 
]);

module.exports = { uploadMultiple }; 
