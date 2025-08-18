const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const vehicle_statusController = require('../../controllers/truck/vehicle_status/vehicle_status');
const vehicle_status_updataController = require('../../controllers/truck/vehicle_status/vehicle_status_updata');
const { uploadMultiple } = require('../../controllers/truck/middleware/upload_vehicle_doc');



// แสดง
router.get('/vehicle_status_show', authenticateToken, vehicle_statusController.vehicle_status_show);
router.get('/vehicle_status_show_all', authenticateToken, vehicle_statusController.vehicle_status_show_all);
router.get('/vehicle_status_shows/:id', authenticateToken, vehicle_status_updataController.vehicle_status_shows);

// ลบข้อมูล


// แก้ไขข้อมูล
router.post('/vehicle_status_upddate/:id', authenticateToken, uploadMultiple, vehicle_status_updataController.vehicle_status_upddate); // ใช้ uploadSingle โดยไม่ต้องเรียก .single() ซ้ำ


// ดึงข้อมูล



module.exports = router;