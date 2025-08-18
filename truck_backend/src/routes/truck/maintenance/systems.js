const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const systems_show_allController = require('../../../controllers/truck/maintenance/systems/systems_show_all');

// แสดง
router.get('/systems_show_all', authenticateToken, systems_show_allController.systems_show_all);

// เพิ่มข้อมูล
router.post('/systems_add', authenticateToken, systems_show_allController.systems_add);

// ลบข้อมูล
router.delete('/systems_delete/:id', authenticateToken, systems_show_allController.systems_delete);


// แก้ไขข้อมูล
router.put('/systems_update/:id', authenticateToken, systems_show_allController.systems_update);


// ดึงข้อมูล



module.exports = router;