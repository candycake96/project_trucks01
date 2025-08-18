const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const vehicleDocController = require('../../controllers/truck/vehicle_doc/vechicle_add');
const vehicle_showDetailsController = require('../../controllers/truck/vehicle_doc/vehicle_showDetails');
const vechicle_update_docController = require('../../controllers/truck/vehicle_doc_edit/vechicle_update_doc');
const { uploadMultiple } = require('../../controllers/truck/middleware/upload_vehicle_doc');

// เพิ่มข้อมูล
router.post('/vehicleAdd', authenticateToken, uploadMultiple, vehicleDocController.VehicleAdd); // ใช้ uploadSingle โดยไม่ต้องเรียก .single() ซ้ำ
// เช็คข้อมูล ตรวจสอบข้อมูลซ้ำ
router.post('/checkDuplicate_VehicleAdd', authenticateToken, uploadMultiple, vehicleDocController.checkDuplicate_VehicleAdd); // 


// ดึงข้อมูล ทั้งหมด
router.get('/vehicleget', authenticateToken , vehicle_showDetailsController.VehicleGet);

// ดึงข้อมูล ไอดี
router.get('/vehicledetailgetid/:id', authenticateToken , vehicle_showDetailsController.VehicleDetailGetId);

// ลบข้อมูล


// แก้ไขข้อมูล
router.put('/vehicle_update_doc/:id', authenticateToken , vechicle_update_docController.vehicle_update_doc);
router.put('/vehicle_updata_other_doc/:id', authenticateToken , uploadMultiple,  vechicle_update_docController.vehicle_updata_other_doc);
router.put('/vehicle_updata_tax/:id', authenticateToken , vechicle_update_docController.vehicle_updata_tax);
router.put('/vehicle_updata_cmi/:id', authenticateToken , vechicle_update_docController.vehicle_updata_cmi);
router.put('/vehicle_updata_insurance/:id', authenticateToken , vechicle_update_docController.vehicle_updata_insurance);



module.exports = router;

