const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const car_cmiController = require('../../controllers/truck/car_cmi/car_cmi');
// แสดง
router.get('/cmi_managment_show', authenticateToken, car_cmiController.cmi_managment_show);
router.get('/cmi_managment_show_all', authenticateToken, car_cmiController.cmi_managment_show_all);

// ลบข้อมูล


// แก้ไขข้อมูล


// ดึงข้อมูล



module.exports = router;