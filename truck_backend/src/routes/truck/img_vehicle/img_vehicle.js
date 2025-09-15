const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const img_vechicle_addController = require('../../../controllers/truck/img_vehicle/img_vehicle_add');
const img_vehicle_showController = require('../../../controllers/truck/img_vehicle/img_vehicle_show');
const { uploadMultiple } = require('../../../controllers/truck/middleware/upload_vehicle_img');

// แสดง
router.get('/img_vehicle_show/:id', authenticateToken, img_vehicle_showController.img_vehicle_show);

// แสดงข้อมูลแจ้ง PM 

// เพิ่มข้อมูล
router.post('/img_vehicle_add/:id', authenticateToken, uploadMultiple, img_vechicle_addController.img_vehicle_add);

// ลบข้อมูล

// แก้ไขข้อมูล

// ค้นหา 

// ดึงข้อมูล



module.exports = router;