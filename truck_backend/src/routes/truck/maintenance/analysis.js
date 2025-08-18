const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const { uploadMultiple } = require('../../../controllers/truck/middleware/uploadMultiple_mainternance');
const analysis_detailsController = require('../../../controllers/truck/maintenance/repair_requests/analysis_details');
const ananlysis_addController = require('../../../controllers/truck/maintenance/ananlysis/ananlysis_add');
const ananlysis_show_detailsController = require('../../../controllers/truck/maintenance/ananlysis/ananlysis_show_details');
const ananlysis_updateController = require('../../../controllers/truck/maintenance/ananlysis/ananlysis_update');
const annalysis_approver_showController = require('../../../controllers/truck/maintenance/ananlysis/analysis_approver_show');
const analysis_approver_saveController = require('../../../controllers/truck/maintenance/ananlysis/analysis_approver_save');

// แสดงข้อมูลแจ้งซ่อม
router.get('/analysis_details', authenticateToken, analysis_detailsController.analysis_details);
router.get('/analysis_details_table_active', authenticateToken, analysis_detailsController.analysis_details_table_active);

router.get('/ananlysis_show_details/:id', authenticateToken, ananlysis_show_detailsController.ananlysis_show_details);
// Show ข้อมูลที่ต้องอนุมัติผลตรวจ
router.get('/ananlysis_approver_show/:id', authenticateToken, annalysis_approver_showController.ananlysis_approver_show);
router.get('/ananlysis_approver_show_data/:id', authenticateToken, annalysis_approver_showController.ananlysis_approver_show_data);

// // เพิ่มข้อมูล         
router.post('/ananlysis_add/:id', authenticateToken, uploadMultiple, ananlysis_addController.ananlysis_add);

// // ลบข้อมูล
// router.delete('/part_delete/:id', authenticateToken, partsController.);
// part_delete

// // แก้ไขข้อมูล
router.put('/ananlysis_update/:id', authenticateToken, uploadMultiple, ananlysis_updateController.ananlysis_update);
//  เป็นการอนุมัติ 
router.put('/analysis_approver_save/:id', authenticateToken, uploadMultiple, analysis_approver_saveController.analysis_approver_save);
router.put('/analysis_approver_edit/:id', authenticateToken, uploadMultiple, analysis_approver_saveController.analysis_approver_edit);

// // ค้นหา 
// router.post('/parts_search', authenticateToken, partsController.parts_search);


// ดึงข้อมูล



module.exports = router;