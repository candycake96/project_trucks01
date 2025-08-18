const { executeQueryEmployeeAccessDB } = require('../../../config/db');

module.exports = {
    TestAddImage: async (req, res) => {
        const file = req.file; // ไฟล์ที่อัปโหลด
        const { description } = req.body; // ข้อมูลจากฟอร์ม

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imagePath = file ? file.filename : null;

        if (!description || typeof description !== 'string') {
            return res.status(400).json({ message: 'Invalid description' });
        }

        try {
            // คำสั่ง SQL สำหรับบันทึกข้อมูลไฟล์และคำอธิบายลงในฐานข้อมูล
            const query = 'INSERT INTO Test (image, description) VALUES (@imagePath, @description)';

            const params = {
                imagePath: imagePath,
                description: description,
            };

            await executeQueryEmployeeAccessDB(query, params); // Using executeQueryEmployeeAccessDB

            // ส่ง response กลับเมื่ออัปโหลดไฟล์สำเร็จ
            res.status(200).json({ message: 'File uploaded successfully!', filePath: imagePath });
        } catch (err) {
            console.error('Error saving file:', err); 
            // ส่ง error response หากเกิดปัญหา
            res.status(500).json({ message: 'Error saving to database', error: err.message });
        }
    },
};





// const { executeQueryEmployeeAccessDB } = require('../../../config/db');
// const multer = require('multer');
// const mssql = require('mssql'); // เรียกใช้ mssql package
// const path = require('path');

// // ตั้งค่าการเก็บไฟล์ในโฟลเดอร์ uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // ใช้ path.join เพื่อสร้างเส้นทางที่ถูกต้อง
//         const uploadPath = path.join(__dirname, '../../../uploads'); // แก้ไขเส้นทาง
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = Date.now() + '-' + file.originalname; // ตั้งชื่อไฟล์ใหม่
//         cb(null, uniqueName); // ส่งชื่อไฟล์ใหม่
//     },
// });

// const upload = multer({ storage });

// // Export middleware สำหรับอัปโหลดไฟล์
// module.exports = {
//     // Middleware สำหรับอัปโหลดไฟล์
//     uploadSingle: upload.single('image'),

//     // ฟังก์ชันสำหรับจัดการอัปโหลดไฟล์
//     TestAddImage: async (req, res) => {
//         const file = req.file; // ไฟล์ที่อัปโหลด
//         const { description } = req.body; // ข้อมูลจากฟอร์ม

//         // กำหนดค่าของ image เป็น null หากไม่มีไฟล์
//         const imagePath = file ? file.filename : null;

//         try {
//             // คำสั่ง SQL สำหรับบันทึกข้อมูลไฟล์และคำอธิบายลงในฐานข้อมูล
//             const query = 'INSERT INTO Test (image, description) VALUES (@image, @description)';

//             // ใช้ executeQueryEmployeeAccessDB สำหรับการ query
//             const parameters = {
//                 image: imagePath, // ถ้าไม่มีไฟล์, imagePath จะเป็น null
//                 description: description, // กำหนดค่าของ @description
//             };

//             await executeQueryEmployeeAccessDB(query, parameters); // ใช้ executeQueryEmployeeAccessDB แทนการใช้ mssql.Request()

//             // ส่ง response กลับเมื่ออัปโหลดไฟล์สำเร็จ
//             res.status(200).json({ message: 'File uploaded successfully!', filePath: imagePath });
//         } catch (err) {
//             console.error('Error saving file:', err);
//             // ส่ง error response หากเกิดปัญหา
//             res.status(500).json({ message: 'Error saving to database', error: err.message });
//         }
//     },
// };
