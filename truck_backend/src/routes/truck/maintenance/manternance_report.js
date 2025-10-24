const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const mainyternance_report_details_allController = require('../../../controllers/truck/maintenance/mainternance_report/mainternance_report_details_all');
// const { uploadMultiple } = require('../../../controllers/truck/middleware/upload_vehicle_doc');



// แสดง
router.get('/mainternance_report_details_all', authenticateToken, mainyternance_report_details_allController.mainternance_report_details_all); //แสดงข้อมูลเปิดการแจ้งซ่อมแสดงตารางส่วนแรก
// 

// ปิดงานซ่อม




// เพิ่มข้อมูล ปิดงงานซ่อม


// ลบข้อมูล


// แก้ไขข้อมูล


// ค้นหา 




// ดึงข้อมูล



module.exports = router;