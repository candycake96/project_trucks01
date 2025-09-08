const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const repair_requests_addController = require('../../../controllers/truck/maintenance/repair_requests/repair_requests_add');
const repair_requests_detailsController = require('../../../controllers/truck/maintenance/repair_requests/repair_requests_details');
const repair_requests_editController = require('../../../controllers/truck/maintenance/repair_requests/repair_requests_edit');

// แสดง
router.get('/repair_requests_detail', authenticateToken, repair_requests_detailsController.repair_requests_detail); //แสดงข้อมูลเปิดการแจ้งซ่อมแสดงตารางส่วนแรก
router.get('/repair_requests_and_part_detail/:id', authenticateToken, repair_requests_detailsController.repair_requests_and_part_detail); //แสดงข้อมูลแจ้งซ่อมและอะไหล่ที่มีการบันทึกไว้
router.get('/repair_requests_detail_id/:id', authenticateToken, repair_requests_detailsController.repair_requests_detail_id); //แสดงข้อมูลงานแจ้งซ่อมใน datasbase โดยระบุ ID

// เพิ่มข้อมูล
router.post('/repair_requests_add', authenticateToken, repair_requests_addController.repair_requests_add);

// ลบข้อมูล
// router.delete('/part_delete/:id', authenticateToken, partsController.part_delete);


// แก้ไขข้อมูล
router.put('/repair_requests_edit/:id', authenticateToken, repair_requests_editController.repair_requests_edit);


// ค้นหา 
// router.post('/parts_search', authenticateToken, partsController.parts_search);



// ดึงข้อมูล



module.exports = router;