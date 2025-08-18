const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// กำหนดที่เก็บไฟล์ตามชื่อฟิลด์
const getUploadPath = (fieldName) => {
  console.log('DEBUG fieldName:', fieldName); // เพิ่มบรรทัดนี้
  if (fieldName && fieldName.includes('quotation_file')) {
    return 'upload/QT_MTN/';
  }
  return 'upload/others/';
};

// import p from '../upload/'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../', getUploadPath(file.fieldname));
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

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('ไฟล์ที่อัปโหลดต้องเป็นรูปภาพหรือเอกสารเท่านั้น'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadMultiple = upload.any();  // รับไฟล์ทุกฟิลด์

module.exports = { uploadMultiple };
