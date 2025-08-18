const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const vendor_addController = require('../../controllers/truck/vender/vendor_add');
const vender_showController = require('../../controllers/truck/vender/vender_show');
const vender_typeController = require('../../controllers/truck/vender/vender_type');
const vendor_service_showController = require('../../controllers/truck/vender/vendor_service_show');
const vendor_organization_typeController = require('../../controllers/truck/vender/vendor_organization_type');
const { uploadMultiple } = require('../../controllers/truck/middleware/upload_vehicle_doc');

// แสดง
router.get('/vendor_show', authenticateToken, vender_showController.vendor_show);
router.get('/vendor_show_details/:id', authenticateToken, vender_showController.vendor_show_details);
// เพิ่มข้อมูล
router.post('/vendor_add', authenticateToken, uploadMultiple, vendor_addController.vendor_add);
// ลบข้อมูล
// แก้ไขข้อมูล
// ดึงข้อมูล


// ตาราง organization_type
// แสดง
router.get('/vendor_organization_type_show', authenticateToken, vendor_organization_typeController.vendor_organization_type_show);
// เพิ่มข้อมูล organization_type
router.post('/vendor_organization_type_add', authenticateToken, vendor_organization_typeController.vendor_organization_type_add);
// แก้ไข organization_type
router.put('/vendor_organization_type_update/:id', authenticateToken,  vendor_organization_typeController.vendor_organization_type_update);


// ตาราง vendor_type
// แสดง
router.get('/vendor_type_show', authenticateToken, vender_typeController.vendor_type_show);
// เพิ่มข้อมูล 
router.post('/vendor_type_add', authenticateToken, vender_typeController.vendor_type_add);
// แก้ไข 
router.put('/vendor_type_update/:id', authenticateToken,  vender_typeController.vendor_type_update);


// ตาราง service_type
// แสดง
router.get('/vendor_service_types_show', authenticateToken, vendor_service_showController.vendor_service_types_show);
// เพิ่มข้อมูล 
router.post('/vendor_service_types_add', authenticateToken, vendor_service_showController.vendor_service_types_add);
// แก้ไข 
router.put('/vendor_service_types_update/:id', authenticateToken,  vendor_service_showController.vendor_service_types_update);

module.exports = router;
