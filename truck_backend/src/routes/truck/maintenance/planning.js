const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const planningController = require('../../../controllers/truck/maintenance/repair_requests/planning');

// แสดง ก่อนจะทำการวางแผนเข้าซ่อม ส่งมาจากการแจ้งซ่อม
router.get('/planning_show', authenticateToken, planningController.planning_show);
// แสดงข้อมูลที่มีการวางแผนแล้ว
router.get('/planning_table_submit', authenticateToken, planningController.planning_table_submit);
//  
router.get('/planning_show_id/:id', authenticateToken, planningController.planning_show_id);

// // เพิ่มข้อมูล
router.post('/planning_add', authenticateToken, planningController.planning_add);

// // ลบข้อมูล
// router.delete('/part_delete/:id', authenticateToken, partsController.part_delete);


// // แก้ไขข้อมูล
router.put('/planning_update/:id', authenticateToken, planningController.planning_update);

// // ค้นหา 
// router.post('/parts_search', authenticateToken, partsController.parts_search);



// ดึงข้อมูล



module.exports = router;