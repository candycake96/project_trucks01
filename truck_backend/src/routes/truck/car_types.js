const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const car_typeController = require('../../controllers/truck/vehicle_doc/car_type');
const { uploadSingle } = require('../../controllers/truck/middleware/upload_vehicle_doc');

// แสดง
router.get('/detailscartype', authenticateToken, car_typeController.DetailsCarType);

// ลบข้อมูล


// แก้ไขข้อมูล


// ดึงข้อมูล



module.exports = router;

