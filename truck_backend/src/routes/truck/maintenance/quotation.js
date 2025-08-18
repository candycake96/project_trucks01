const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const puotation_showController = require('../../../controllers/truck/maintenance/puotation/puotation_show');

// แสดง
router.get('/quotation_show_analysis_id/:id', authenticateToken, puotation_showController.quotation_show_analysis_id);

// เพิ่มข้อมูล
// router.post('/parts_add', authenticateToken, partsController.parts_add);

// ลบข้อมูล
// router.delete('/part_delete/:id', authenticateToken, partsController.part_delete);


// แก้ไขข้อมูล
// router.put('/parts_edit/:id', authenticateToken, partsController.parts_edit);

// ค้นหา 
// router.post('/parts_search', authenticateToken, partsController.parts_search);



// ดึงข้อมูล



module.exports = router;