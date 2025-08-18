const express = require('express');
const router = express.Router();
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");

const { authenticateToken  } = require('../../jwt/AuthToken')
const car_mileage_addController = require('../../controllers/truck/car_mileage/car_mileage_add');
const car_mileage_showController = require('../../controllers/truck/car_mileage/car_mileage_show');
const car_mileage_deleteController = require('../../controllers/truck/car_mileage/car_mileage_delete');
const car_mileage_editController = require('../../controllers/truck/car_mileage/car_mileage_edit');

//  เพิ่ม
router.post('/car_mileage_add_incorrect', authenticateToken, car_mileage_addController.car_mileage_add_incorrect);
router.post('/car_mileage_reset', authenticateToken, car_mileage_addController.car_mileage_reset);
router.post('/car_mileage_add_data', authenticateToken, car_mileage_addController.car_mileage_add_data); //ใช้เพิ่มข้อมูลโดยตรง
router.post('/mileage_excel_uploader', authenticateToken, car_mileage_addController.mileage_excel_uploader); //ใช้เพิ่มข้อมูลโดยตรง

// แสดง
router.get('/car_mileage_show', authenticateToken, car_mileage_showController.car_mileage_show);
router.get('/getMileageData/:id', authenticateToken, car_mileage_showController.getMileageData);
router.get('/getMileageDataTow', authenticateToken, car_mileage_showController.getMileageDataTow);
router.get('/car_mileage_show_id/:id', authenticateToken, car_mileage_showController.car_mileage_show_id);
router.get('/car_mileage_show_tbl_all', authenticateToken, car_mileage_showController.car_mileage_show_tbl_all);
router.get('/car_mileage_show_tbl_all_one', authenticateToken, car_mileage_showController.car_mileage_show_tbl_all_one);

// ลบข้อมูล
router.delete('/car_mileage_delete/:id', authenticateToken,  car_mileage_deleteController.car_mileage_delete); // ใช้ uploadSingle โดยไม่ต้องเรียก .single() ซ้ำ


// แก้ไขข้อมูล
router.put('/car_mileage_update/:id', authenticateToken, car_mileage_editController.car_mileage_update);


// ดึงข้อมูล



module.exports = router;
