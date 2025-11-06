const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const changeController = require('../../../controllers/truck/maintenance/repair_change/change');

// แสดง
router.get('/change_show/:id', authenticateToken, changeController.change_show); 
router.get('/change_show_top/:id', authenticateToken, changeController.change_show_top); 
router.get('/change_show_id/:id', authenticateToken, changeController.change_show_id); 


router.post('/change_add/:id', authenticateToken, changeController.change_add); 
router.put('/change_approval/:id', authenticateToken, changeController.change_approval);  //อนุมัติ


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