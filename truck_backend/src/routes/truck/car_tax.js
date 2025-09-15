const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const tax_managmentController = require('../../controllers/truck/car_tax/tax_managment');
const tax_addController = require('../../controllers/truck/car_tax/tax_add');
const tax_updateController = require('../../controllers/truck/car_tax/tax_update');
const tax_deleteController = require('../../controllers/truck/car_tax/tax_delete');
const tax_detailsController = require('../../controllers/truck/car_tax/tax_details');
const { uploadMultiple } = require('../../controllers/truck/middleware/upload_vehicle_doc');

// แสดง
router.get('/tax_managment_show', authenticateToken, tax_managmentController.tax_managment_show);
router.get('/tax_managment_show_all', authenticateToken, tax_managmentController.tax_managment_show_all);

router.get('/tax_details/:id', authenticateToken, tax_detailsController.tax_details);

//  เพิ่ม
router.post('/tax_add/:id', authenticateToken, uploadMultiple, tax_addController.tax_add);

// ลบข้อมูล


// แก้ไขข้อมูล
router.put('/tax_update/:id', authenticateToken, uploadMultiple, tax_updateController.tax_update);


// ดึงข้อมูล
router.delete('/tax_delete/:id', authenticateToken, uploadMultiple, tax_deleteController.tax_delete);



module.exports = router;