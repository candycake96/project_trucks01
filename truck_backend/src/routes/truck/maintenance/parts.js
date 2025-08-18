const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const partsController = require('../../../controllers/truck/maintenance/parts/parts');

// แสดง
router.get('/parts_show_all', authenticateToken, partsController.parts_show_all);

// เพิ่มข้อมูล
router.post('/parts_add', authenticateToken, partsController.parts_add);

// ลบข้อมูล
router.delete('/part_delete/:id', authenticateToken, partsController.part_delete);


// แก้ไขข้อมูล
router.put('/parts_edit/:id', authenticateToken, partsController.parts_edit);

// ค้นหา 
router.post('/parts_search', authenticateToken, partsController.parts_search);



// ดึงข้อมูล



module.exports = router;