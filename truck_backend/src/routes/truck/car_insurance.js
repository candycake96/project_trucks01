const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const car_insuranceController = require('../../controllers/truck/car_insurance/car_insurance');
const car_insurance_detailController = require('../../controllers/truck/car_insurance/car_insurance_detail');
const car_insurance_typeController = require('../../controllers/truck/car_insurance/car_insurance_type');
const car_insurance_addController = require('../../controllers/truck/car_insurance/car_insurance_add');
const car_insurance_classController = require('../../controllers/truck/car_insurance/car_insurance_class');
const car_insurance_coverage_typeController = require('../../controllers/truck/car_insurance/car_insurance_coverage_type');
const car_insurance_updateController = require('../../controllers/truck/car_insurance/car_insurance_update');
const car_insurance_deleteController = require('../../controllers/truck/car_insurance/car_insurance_delete');
const { uploadMultiple } = require('../../controllers/truck/middleware/upload_vehicle_doc');
// แสดง
router.get('/car_insurance_show', authenticateToken, car_insuranceController.car_insurance_show);
router.get('/car_insurance_show_all', authenticateToken, car_insuranceController.car_insurance_show_all);

// แสดงข้อมูลประเภท
router.get('/car_insurance_types', authenticateToken, car_insurance_typeController.car_insurance_types);
router.get('/car_insurance_class', authenticateToken, car_insurance_classController.car_insurance_class);
router.get('/car_insurance_coverage_type', authenticateToken, car_insurance_coverage_typeController.car_insurance_coverage_type);

//แสดงข้อมูลทั้งหมด
router.get('/car_insurance_details/:id', authenticateToken, car_insurance_detailController.car_insurance_details);
router.get('/car_insurance_datails_all', authenticateToken, car_insurance_detailController.car_insurance_datails_all);

// เพิ่มข้อมูล
router.post('/car_insurance_add/:id', authenticateToken, uploadMultiple, car_insurance_addController.car_insurance_add);

// ลบข้อมูล
router.delete('/car_insurance_delete/:id', authenticateToken, uploadMultiple, car_insurance_deleteController.car_insurance_delete);


// แก้ไขข้อมูล
router.put('/car_insurance_update/:id', authenticateToken, uploadMultiple, car_insurance_updateController.car_insurance_update);


// ดึงข้อมูล



module.exports = router;