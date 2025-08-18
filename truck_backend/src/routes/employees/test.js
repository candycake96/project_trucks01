const express = require('express');
const router = express.Router();
const { uploadMultiple } = require('../../middleware/upload');
const testController = require('../../controllers/employees/test/addimage');
const { authenticateToken } = require('../../jwt/AuthToken');

// เส้นทางสำหรับการอัปโหลดภาพและบันทึกข้อมูล
router.post('/testaddimage', authenticateToken, uploadMultiple, testController.TestAddImage);

// Middleware สำหรับจัดการข้อผิดพลาด
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const { uploadSingle } = require('../../middleware/upload'); // Middleware สำหรับอัปโหลดไฟล์
// const testController = require('../../controllers/employees/test/addimage'); // Controller
// const { authenticateToken } = require('../../jwt/AuthToken'); // Middleware สำหรับตรวจสอบ Token

// // Route สำหรับอัปโหลดรูปภาพและบันทึกข้อมูล
// router.post(
//     '/testaddimage',
//     authenticateToken, // Middleware สำหรับตรวจสอบการยืนยันตัวตน
//     (req, res, next) => {
//         // เรียกใช้ uploadSingle.single() เพื่อจัดการไฟล์ที่อัปโหลด
//         uploadSingle.single('image')(req, res, (err) => {
//             if (err) {
//                 // หากเกิดข้อผิดพลาดระหว่างอัปโหลดไฟล์
//                 return res.status(400).json({ message: 'Error uploading file', error: err.message });
//             }
//             next(); // ส่งต่อไปยัง controller
//         });
//     },
//     testController.TestAddImage // Controller สำหรับบันทึกข้อมูลในฐานข้อมูล
// );

// // Middleware สำหรับจัดการข้อผิดพลาดทั่วไป
// router.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Internal Server Error', error: err.message });
// });

// module.exports = router;