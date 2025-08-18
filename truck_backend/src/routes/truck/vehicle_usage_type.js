const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const vehicle_usage_typeController = require('../../controllers/truck/vehicle_doc/vehicle_usage_type');

// แสดง
router.get('/detailsvehicleusagetype', authenticateToken, vehicle_usage_typeController.DetailsVehicleUsageType);

// ลบข้อมูล


// แก้ไขข้อมูล


// ดึงข้อมูล



module.exports = router;

