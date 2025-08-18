const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const Driver_relationController = require('../../controllers/truck/driver_relation_management/Driver_relation');
const { uploadMultiple } = require('../../controllers/truck/middleware/upload_vehicle_doc');

// เพิ่มข้อมูล
router.post('/add_driver_relation', authenticateToken,  Driver_relationController.add_driver_relation); // ใช้ uploadSingle โดยไม่ต้องเรียก .single() ซ้ำ
 
// ลบข้อมูล
router.delete('/delete_driver_relation/:id', authenticateToken,  Driver_relationController.delete_driver_relation); // ใช้ uploadSingle โดยไม่ต้องเรียก .single() ซ้ำ


// update ยกเลิกหรือสิ้นสุดการใช้งานรถของ พขร
// ตั้งค่าเส้นทาง PUT สำหรับการยกเลิกความสัมพันธ์คนขับและรถ
router.put('/update_cancel_driver_relation/:id', authenticateToken, Driver_relationController.Cancel_driver_relation);// ใช้ uploadSingle โดยไม่ต้องเรียก .single() ซ้ำ


// ดึงข้อมูล ทั้งหมด


// ดึงข้อมูล ไอดี
router.get('/shows_driver_relation/:id', authenticateToken,  Driver_relationController.shows_driver_relation); // ใช้ uploadSingle โดยไม่ต้องเรียก .single() ซ้ำ
 


module.exports = router;

