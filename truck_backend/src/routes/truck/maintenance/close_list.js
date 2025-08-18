const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const close_list_showPendingController = require('../../../controllers/truck/maintenance/repair_close_list/close_list_show');
const close_list_addPendingController = require('../../../controllers/truck/maintenance/repair_close_list/close_list_add');
const { uploadMultiple } = require('../../../controllers/truck/middleware/upload_vehicle_doc');



// แสดง
router.get('/waiting_closing_list_table', authenticateToken, close_list_showPendingController.waiting_closing_list_table);
// 
router.get('/close_job_show_id/:id', authenticateToken, close_list_showPendingController.close_job_show_id);
// ปิดงานซ่อม
router.get('/closing_list_table', authenticateToken, close_list_showPendingController.closing_list_table);



// เพิ่มข้อมูล ปิดงงานซ่อม
router.post('/close_list_add/:id', authenticateToken, uploadMultiple, close_list_addPendingController.close_list_add);

// ลบข้อมูล
// router.delete('/part_delete/:id', authenticateToken, partsController.part_delete);

// แก้ไขข้อมูล
// router.put('/parts_edit/:id', authenticateToken, partsController.parts_edit);

// ค้นหา 
// router.post('/parts_search', authenticateToken, partsController.parts_search);



// ดึงข้อมูล



module.exports = router;