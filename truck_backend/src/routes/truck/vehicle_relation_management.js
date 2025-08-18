const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const vehicle_relationeController = require('../../controllers/truck/vehicle_relation_management/vehicle_relation');

// แสดง
router.get('/vehicle_relation_shows/:reg_id/:car_type_id', authenticateToken, vehicle_relationeController.vehicle_relation_shows);

// บันทึก
router.post('/vehicle_relation_add', authenticateToken, vehicle_relationeController.vehicle_relation_add);


// ลบข้อมูล
router.delete('/vehicle_relation_delete/:id', authenticateToken, vehicle_relationeController.vehicle_relation_delete);


// แก้ไขข้อมูล


// ดึงข้อมูล



module.exports = router;

