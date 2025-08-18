const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const approval_showsController = require('../../../controllers/truck/maintenance/approval/approval_shows');
const approval_saveController = require('../../../controllers/truck/maintenance/approval/approval_save');
const approval_updateController = require('../../../controllers/truck/maintenance/approval/approval_update');
const approval_show_tableController = require('../../../controllers/truck/maintenance/approval/approval_show_table');

// แสดง
router.get('/approval_shows_id/:id', authenticateToken, approval_showsController.approval_shows_id);
router.get('/approval_data_details/:id', authenticateToken, approval_showsController.approval_data_details);
// แสดงข้อมูลตารางแรกของการอนุมัติ รออนุมัติ
router.get('/maintenance_approval_how_table', authenticateToken, approval_show_tableController.maintenance_approval_how_table);
//  แสดงข้อมูลตารางที่ทำการอนุมัติแล้ว
router.get('/maintenance_approval_show_table', authenticateToken, approval_show_tableController.maintenance_approval_show_table);
// 
// เพิ่มข้อมูลอนุมัติขั้นสุดท้ายของการแจ้งซ่อม
router.post('/approval_save/:id', authenticateToken, approval_saveController.approval_save);

// แก้ไขข้อมูลการอนุมัติ
router.put('/approval_update/:id', authenticateToken, approval_updateController.approval_update);

// แก้ไขข้อมูล
// router.put('/parts_edit/:id', authenticateToken, partsController.parts_edit);

// ค้นหา 
// router.post('/parts_search', authenticateToken, partsController.parts_search);

// ดึงข้อมูล



module.exports = router;