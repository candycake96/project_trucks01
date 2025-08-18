const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../../jwt/AuthToken')
const setting_modelsController = require('../../../controllers/truck/setting_vehicle/setting_models');

// แสดง
router.get('/setting_models_show', authenticateToken, setting_modelsController.setting_models_show);


// เพิ่มข้อมูล
router.post('/setting_models_add', authenticateToken, setting_modelsController.setting_models_add);


// ลบข้อมูล
router.delete('/setting_models_delete/:id', authenticateToken, setting_modelsController.setting_models_delete);


// แก้ไขข้อมูล
router.put('/setting_models_update/:id', authenticateToken, setting_modelsController.setting_models_update);

// ค้นหา 
// router.post('/parts_search', authenticateToken, partsController.parts_search);



// ดึงข้อมูล



module.exports = router;