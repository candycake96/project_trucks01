const express = require('express');
const router = express.Router();
const { authenticateToken  } = require('../../jwt/AuthToken')
const act_addController = require('../../controllers/truck/car_act/act_add');
const act_detailsController = require('../../controllers/truck/car_act/act_details');
const act_deleteController = require('../../controllers/truck/car_act/act_delete');
const act_updateController = require('../../controllers/truck/car_act/act_update');
const { uploadMultiple } = require('../../controllers/truck/middleware/upload_vehicle_doc');

// แสดง
router.get('/act_details/:id', authenticateToken, act_detailsController.act_details);

//  เพิ่ม
router.post('/act_add/:id', authenticateToken, uploadMultiple, act_addController.act_add);

// แก้ไขข้อมูล
router.put('/act_update/:id', authenticateToken, uploadMultiple, act_updateController.act_update);

// ลบข้อมูล
router.delete('/act_delete/:id', authenticateToken, uploadMultiple, act_deleteController.act_delete);



module.exports = router;