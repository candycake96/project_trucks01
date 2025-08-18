const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const vehicle_typeController = require('../../controllers/truck/vehicle_doc/vehicle_type');

// แสดง
router.get('/detailsvehicletype', authenticateToken, vehicle_typeController.DetailsVehicleType);

// ลบข้อมูล


// แก้ไขข้อมูล


// ดึงข้อมูล



module.exports = router;

