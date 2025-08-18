const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const repair_logController = require('../../../controllers/truck/maintenance/log/repair_log');

// แสดง
router.get('/reqair_log_show/:id', authenticateToken, repair_logController.reqair_log_show);

// เพิ่มข้อมูลอนุมัติขั้นสุดท้ายของการแจ้งซ่อม
// router.post('/approval_save/:id', authenticateToken, approval_saveController.approval_save);

// ลบข้อมูล
// router.delete('/part_delete/:id', authenticateToken, partsController.part_delete);

// แก้ไขข้อมูล
// router.put('/parts_edit/:id', authenticateToken, partsController.parts_edit);

// ค้นหา 
// router.post('/parts_search', authenticateToken, partsController.parts_search);



// ดึงข้อมูล



module.exports = router;