const express = require('express');
const router = express.Router();
const setting_doc_repairController = require('../../../controllers/truck/maintenance/repair_requests/setting_doc_repair');


// แสดง
router.get('/setting_doc_repair', setting_doc_repairController.setting_doc_repair);
// 
router.put('/setting_doc_repair_update', setting_doc_repairController.setting_doc_repair_update);


module.exports = router;