const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const pm_plansController = require('../../../controllers/truck/preventive_mainternance/pm_plans');
const pm_plans_detailsController = require('../../../controllers/truck/preventive_mainternance/pm_plans_details');

// แสดง
router.get('/pm_plans_details/:id', authenticateToken, pm_plans_detailsController.pm_plans_details);

// เพิ่มข้อมูล
router.post('/pm_plans_add_set/:id', authenticateToken, pm_plansController.pm_plans_add_set);

// ลบข้อมูล
// router.delete('/part_delete/:id', authenticateToken, partsController.part_delete);


// แก้ไขข้อมูล
// router.put('/parts_edit/:id', authenticateToken, partsController.parts_edit);

// ค้นหา 
// router.post('/parts_search', authenticateToken, partsController.parts_search);



// ดึงข้อมูล



module.exports = router;