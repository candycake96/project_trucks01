const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const auto_loansController = require('../../controllers/truck/vehicle_doc/auto_loans');
const auto_car_addController = require('../../controllers/truck/vehicle_doc/auto_car_add');
const auto_car_updateController = require('../../controllers/truck/vehicle_doc/auto_car_update');
const { uploadSingle } = require('../../controllers/truck/middleware/upload_vehicle_doc');

// แสดง
router.get('/autocardetails/:id', authenticateToken, auto_loansController.AutoCarDetails);

// เพิ่มข้อมูล
router.post('/auto_car_add/:id', authenticateToken, auto_car_addController.auto_car_add);

// ลบข้อมูล
router.put('/auto_car_update/:id', authenticateToken, auto_car_updateController.auto_car_update);


// แก้ไขข้อมูล


// ดึงข้อมูล



module.exports = router;

